import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocumentValidationRequest {
  text: string;
  documentType: string;
  requiredFields?: string[];
}

interface ValidationResult {
  grammarErrors: Array<{
    text: string;
    suggestion: string;
    position: number;
    severity: 'low' | 'medium' | 'high';
  }>;
  missingFields: Array<{
    field: string;
    description: string;
    required: boolean;
  }>;
  extractedData: Record<string, any>;
  confidence: number;
  overallScore: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, documentType, requiredFields = [] }: DocumentValidationRequest = await req.json();

    console.log(`Processing document validation for type: ${documentType}`);

    // Grammar and spelling check
    const grammarResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are a grammar and spelling checker for school application documents. 
            Analyze the text and return only a JSON object with this structure:
            {
              "errors": [
                {
                  "text": "original error text",
                  "suggestion": "corrected text",
                  "position": 0,
                  "severity": "low|medium|high",
                  "type": "grammar|spelling|punctuation"
                }
              ],
              "score": 85
            }
            Score should be 0-100 based on grammar quality.`
          },
          {
            role: 'user',
            content: `Check grammar and spelling in this ${documentType} text: "${text}"`
          }
        ],
        temperature: 0.1,
      }),
    });

    const grammarData = await grammarResponse.json();
    let grammarResult;
    try {
      grammarResult = JSON.parse(grammarData.choices[0].message.content);
    } catch {
      grammarResult = { errors: [], score: 85 };
    }

    // Field extraction and validation
    const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are a document field extractor for ${documentType} documents. 
            Extract relevant information and identify missing required fields.
            Return only a JSON object with this structure:
            {
              "extractedData": {
                "studentName": "extracted value or null",
                "dateOfBirth": "extracted value or null",
                "parentName": "extracted value or null",
                "address": "extracted value or null",
                "phone": "extracted value or null",
                "email": "extracted value or null",
                "emergencyContact": "extracted value or null",
                "medicalInfo": "extracted value or null"
              },
              "missingFields": [
                {
                  "field": "fieldName",
                  "description": "Human readable description",
                  "required": true
                }
              ],
              "confidence": 85
            }`
          },
          {
            role: 'user',
            content: `Extract fields from this ${documentType}: "${text}". Required fields: ${requiredFields.join(', ')}`
          }
        ],
        temperature: 0.1,
      }),
    });

    const extractionData = await extractionResponse.json();
    let extractionResult;
    try {
      extractionResult = JSON.parse(extractionData.choices[0].message.content);
    } catch {
      extractionResult = { 
        extractedData: {}, 
        missingFields: [], 
        confidence: 70 
      };
    }

    // Calculate overall score
    const grammarScore = grammarResult.score || 85;
    const completenessScore = Math.max(0, 100 - (extractionResult.missingFields?.length || 0) * 15);
    const overallScore = Math.round((grammarScore + completenessScore + extractionResult.confidence) / 3);

    const result: ValidationResult = {
      grammarErrors: grammarResult.errors || [],
      missingFields: extractionResult.missingFields || [],
      extractedData: extractionResult.extractedData || {},
      confidence: extractionResult.confidence || 70,
      overallScore
    };

    console.log(`Document validation completed with score: ${overallScore}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in document validation:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      grammarErrors: [],
      missingFields: [],
      extractedData: {},
      confidence: 0,
      overallScore: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});