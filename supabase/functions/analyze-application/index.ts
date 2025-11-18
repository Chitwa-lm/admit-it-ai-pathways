import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalysisRequest {
  applicationId: string;
  essays: Array<{ title: string; content: string }>;
  personalStatement?: string;
  existingApplicationIds?: string[];
}

interface NLPAnalysisResult {
  sentiment: {
    score: number;
    confidence: number;
    label: 'positive' | 'neutral' | 'negative';
  };
  key_phrases: string[];
  summary: string;
  plagiarism_score: number;
  red_flags: string[];
  quality_score: number;
  readability_score: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { applicationId, essays, personalStatement, existingApplicationIds = [] }: AnalysisRequest = await req.json();

    console.log(`Analyzing application: ${applicationId}`);

    // Combine all text content
    const allText = [
      personalStatement || '',
      ...essays.map(e => `${e.title}: ${e.content}`)
    ].filter(Boolean).join('\n\n');

    if (!allText.trim()) {
      throw new Error('No text content provided for analysis');
    }

    // Perform sentiment analysis
    const sentimentResult = await analyzeSentiment(allText);

    // Extract key phrases
    const keyPhrases = await extractKeyPhrases(allText);

    // Generate summary
    const summary = await generateSummary(allText);

    // Detect red flags
    const redFlags = await detectRedFlags(allText);

    // Calculate quality and readability scores
    const qualityScore = await calculateQualityScore(allText);
    const readabilityScore = calculateReadabilityScore(allText);

    // Check for plagiarism if we have existing applications
    let plagiarismScore = 0;
    if (existingApplicationIds.length > 0) {
      plagiarismScore = await checkPlagiarism(allText, existingApplicationIds);
    }

    const analysisResult: NLPAnalysisResult = {
      sentiment: sentimentResult,
      key_phrases: keyPhrases,
      summary,
      plagiarism_score: plagiarismScore,
      red_flags: redFlags,
      quality_score: qualityScore,
      readability_score: readabilityScore,
    };

    // Store the analysis result in the database
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error: updateError } = await supabase
      .from('applications')
      .update({ nlp_analysis: analysisResult })
      .eq('id', applicationId);

    if (updateError) {
      console.error('Error storing analysis:', updateError);
    }

    console.log(`Analysis completed for application: ${applicationId}`);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in application analysis:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      sentiment: { score: 0, confidence: 0, label: 'neutral' },
      key_phrases: [],
      summary: '',
      plagiarism_score: 0,
      red_flags: ['Analysis failed'],
      quality_score: 0,
      readability_score: 0,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function analyzeSentiment(text: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Analyze the sentiment of this school application text. Return only a JSON object:
          {
            "score": -1 to 1 (negative to positive),
            "confidence": 0 to 1,
            "label": "positive" | "neutral" | "negative"
          }`
        },
        { role: 'user', content: text }
      ],
      temperature: 0.1,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return { score: 0, confidence: 0.5, label: 'neutral' };
  }
}

async function extractKeyPhrases(text: string): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Extract 5-10 key phrases from this application text that highlight the applicant's strengths, interests, and qualifications. Return only a JSON array of strings.`
        },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return [];
  }
}

async function generateSummary(text: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Summarize this school application in 2-3 sentences, highlighting the applicant's key strengths and motivations.`
        },
        { role: 'user', content: text }
      ],
      temperature: 0.3,
      max_tokens: 150,
    }),
  });

  const data = await response.json();
  return data.choices[0].message.content.trim();
}

async function detectRedFlags(text: string): Promise<string[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Analyze this application for potential red flags such as:
          - Inappropriate content
          - Dishonesty indicators
          - Concerning behavioral patterns
          - Plagiarism indicators
          - Lack of genuine interest
          - Overly generic responses
          
          Return only a JSON array of specific red flag descriptions, or empty array if none found.`
        },
        { role: 'user', content: text }
      ],
      temperature: 0.1,
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.choices[0].message.content);
  } catch {
    return [];
  }
}

async function calculateQualityScore(text: string): Promise<number> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Rate the overall quality of this application on a scale of 0-100 based on:
          - Writing quality and grammar
          - Depth of content
          - Authenticity and personal voice
          - Relevance to school admission
          - Clarity and organization
          
          Return only a number between 0 and 100.`
        },
        { role: 'user', content: text }
      ],
      temperature: 0.1,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  const score = parseInt(content.match(/\d+/)?.[0] || '50');
  return Math.min(100, Math.max(0, score));
}

function calculateReadabilityScore(text: string): number {
  // Flesch Reading Ease calculation
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const words = text.split(/\s+/).filter(w => w.length > 0).length;
  const syllables = text.split(/\s+/).reduce((count, word) => {
    return count + countSyllables(word);
  }, 0);

  if (sentences === 0 || words === 0) return 50;

  const avgWordsPerSentence = words / sentences;
  const avgSyllablesPerWord = syllables / words;

  const score = 206.835 - 1.015 * avgWordsPerSentence - 84.6 * avgSyllablesPerWord;
  return Math.min(100, Math.max(0, Math.round(score)));
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  const vowels = 'aeiouy';
  let count = 0;
  let previousWasVowel = false;

  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    if (isVowel && !previousWasVowel) {
      count++;
    }
    previousWasVowel = isVowel;
  }

  if (word.endsWith('e')) count--;
  return Math.max(1, count);
}

async function checkPlagiarism(text: string, existingApplicationIds: string[]): Promise<number> {
  // Fetch existing application texts
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const { data: applications } = await supabase
    .from('applications')
    .select('application_data')
    .in('id', existingApplicationIds.slice(0, 10)); // Limit to 10 for performance

  if (!applications || applications.length === 0) {
    return 0;
  }

  // Extract essays from existing applications
  const existingTexts = applications
    .map(app => {
      const essays = app.application_data?.essays || [];
      return essays.map((e: any) => e.content).join(' ');
    })
    .filter(Boolean);

  if (existingTexts.length === 0) {
    return 0;
  }

  // Use OpenAI to detect similarity
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Compare the new text with existing texts and rate the similarity/plagiarism on a scale of 0-100.
          0 = completely unique, 100 = identical or heavily plagiarized.
          Return only a number.`
        },
        {
          role: 'user',
          content: `New text: ${text.substring(0, 2000)}\n\nExisting texts: ${existingTexts.join('\n---\n').substring(0, 3000)}`
        }
      ],
      temperature: 0.1,
    }),
  });

  const data = await response.json();
  const content = data.choices[0].message.content.trim();
  const score = parseInt(content.match(/\d+/)?.[0] || '0');
  return Math.min(100, Math.max(0, score));
}
