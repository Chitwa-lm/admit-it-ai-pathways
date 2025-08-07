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
  contentValidation: {
    isAppropriateContent: boolean;
    contentIssues: string[];
    legitimacyScore: number;
  };
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
            content: `You are an intelligent document content validator for ${documentType} documents used in school applications. 
            Your job is to:
            1. Extract relevant information from the document
            2. Verify that the document contains appropriate content for its type
            3. Check if the document is legitimate and contains expected information
            4. Identify missing required fields
            
            For example:
            - Birth Certificate should contain: student's full name, date of birth, place of birth, parent names, official seals/signatures
            - Academic Transcript should contain: student name, school name, grades, courses, dates, official letterhead
            - Immunization Records should contain: student name, vaccination dates, vaccine types, doctor/clinic info
            - Proof of Residence should contain: parent/guardian name, current address, date, official source
            
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
                "medicalInfo": "extracted value or null",
                "schoolName": "extracted value or null",
                "grades": "extracted value or null",
                "vaccinations": "extracted value or null",
                "doctorName": "extracted value or null",
                "dateIssued": "extracted value or null"
              },
              "missingFields": [
                {
                  "field": "fieldName",
                  "description": "Human readable description",
                  "required": true
                }
              ],
              "contentValidation": {
                "isAppropriateContent": true,
                "contentIssues": ["list of issues if document doesn't match expected type"],
                "legitimacyScore": 85
              },
              "confidence": 85
            }`
          },
          {
            role: 'user',
            content: `Analyze this ${documentType} document and validate its content appropriateness: 

"${text}"

Required fields: ${requiredFields.join(', ')}

Please verify:
1. Does this document actually appear to be a ${documentType}?
2. Does it contain the type of information expected for this document type?
3. Are there any red flags that suggest this might be the wrong document type?
4. Extract all relevant fields and identify what's missing.`
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
        contentValidation: {
          isAppropriateContent: false,
          contentIssues: ["Unable to parse document content"],
          legitimacyScore: 30
        },
        confidence: 70 
      };
    }

    // Calculate overall score including content validation
    const grammarScore = grammarResult.score || 85;
    const completenessScore = Math.max(0, 100 - (extractionResult.missingFields?.length || 0) * 15);
    const contentScore = extractionResult.contentValidation?.legitimacyScore || 70;
    const contentPenalty = extractionResult.contentValidation?.isAppropriateContent ? 0 : 30;
    const overallScore = Math.round(Math.max(0, (grammarScore + completenessScore + contentScore + extractionResult.confidence) / 4 - contentPenalty));

    const result: ValidationResult = {
      grammarErrors: grammarResult.errors || [],
      missingFields: extractionResult.missingFields || [],
      extractedData: extractionResult.extractedData || {},
      contentValidation: extractionResult.contentValidation || {
        isAppropriateContent: true,
        contentIssues: [],
        legitimacyScore: 70
      },
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
      contentValidation: {
        isAppropriateContent: false,
        contentIssues: ["Error processing document"],
        legitimacyScore: 0
      },
      confidence: 0,
      overallScore: 0
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});