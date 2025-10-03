import { supabase } from '@/integrations/supabase/client';

export interface ApplicationSuggestion {
  field: string;
  suggestion: string;
  confidence: number;
  type?: 'spelling' | 'validation' | 'enhancement';
}

export interface DocumentVerification {
  isValid: boolean;
  documentType: string;
  extractedData: Record<string, any>;
  issues: string[];
  confidence: number;
  grammarErrors: Array<{
    text: string;
    suggestion: string;
    position: number;
    severity: 'low' | 'medium' | 'high';
    type: string;
  }>;
  missingFields: Array<{
    field: string;
    description: string;
    required: boolean;
    suggestion?: string;
    severity?: 'high' | 'medium' | 'low';
  }>;
  contentValidation: {
    isAppropriateContent: boolean;
    contentIssues: Array<{
      issue: string;
      explanation: string;
      solution: string;
      severity: 'high' | 'medium' | 'low';
    }> | string[];
    legitimacyScore: number;
    documentTypeMatch?: boolean;
    qualityIssues?: string[];
  };
  overallScore: number;
}

export interface PredictiveText {
  suggestions: string[];
  context: string;
}

export interface SpellCheckResult {
  isCorrect: boolean;
  suggestions: string[];
  correctedText: string;
}

class NLPService {
  private apiKey: string | null = null;
  private commonWords: Set<string>;
  private educationTerms: Set<string>;

  constructor() {
    this.initializeApiKey();
    this.initializeDictionaries();
  }

  private async initializeApiKey() {
    this.apiKey = 'simulated-api-key';
  }

  private initializeDictionaries() {
    // Common English words dictionary
    this.commonWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'for', 'not', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there',
      'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can',
      'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
      'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
      'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any',
      'these', 'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had', 'were', 'said', 'each', 'which',
      'student', 'school', 'education', 'grade', 'teacher', 'parent', 'family', 'child', 'children', 'learning'
    ]);

    // Education-specific terms
    this.educationTerms = new Set([
      'kindergarten', 'elementary', 'middle', 'high', 'primary', 'secondary', 'preschool', 'daycare',
      'curriculum', 'mathematics', 'science', 'english', 'history', 'geography', 'physical', 'art', 'music',
      'special', 'needs', 'iep', 'allergies', 'medication', 'emergency', 'contact', 'address', 'phone',
      'immunization', 'vaccination', 'medical', 'records', 'transcript', 'enrollment', 'admission',
      'application', 'tuition', 'scholarship', 'transportation', 'bus', 'lunch', 'cafeteria'
    ]);
  }

  private spellCheck(text: string): SpellCheckResult {
    const words = text.toLowerCase().split(/\s+/);
    const misspelledWords: string[] = [];
    const suggestions: string[] = [];
    
    words.forEach(word => {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 2 && !this.commonWords.has(cleanWord) && !this.educationTerms.has(cleanWord)) {
        // Simple spell checking logic
        const possibleCorrections = this.findSimilarWords(cleanWord);
        if (possibleCorrections.length > 0) {
          misspelledWords.push(word);
          suggestions.push(...possibleCorrections);
        }
      }
    });

    const isCorrect = misspelledWords.length === 0;
    const correctedText = isCorrect ? text : this.correctText(text, misspelledWords, suggestions);

    return {
      isCorrect,
      suggestions: [...new Set(suggestions)].slice(0, 5),
      correctedText
    };
  }

  private findSimilarWords(word: string): string[] {
    const suggestions: string[] = [];
    
    // Check education terms first
    for (const term of this.educationTerms) {
      if (this.calculateSimilarity(word, term) > 0.7) {
        suggestions.push(term);
      }
    }
    
    // Then check common words
    for (const commonWord of this.commonWords) {
      if (commonWord.length > 3 && this.calculateSimilarity(word, commonWord) > 0.8) {
        suggestions.push(commonWord);
      }
    }
    
    return suggestions.slice(0, 3);
  }

  private calculateSimilarity(word1: string, word2: string): number {
    const longer = word1.length > word2.length ? word1 : word2;
    const shorter = word1.length > word2.length ? word2 : word1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private correctText(text: string, misspelledWords: string[], suggestions: string[]): string {
    let correctedText = text;
    misspelledWords.forEach((misspelled, index) => {
      if (suggestions[index]) {
        correctedText = correctedText.replace(new RegExp(`\\b${misspelled}\\b`, 'gi'), suggestions[index]);
      }
    });
    return correctedText;
  }

  async analyzeApplicationText(text: string, field: string): Promise<ApplicationSuggestion[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const suggestions: ApplicationSuggestion[] = [];

    // Spell checking
    const spellCheckResult = this.spellCheck(text);
    if (!spellCheckResult.isCorrect) {
      suggestions.push({
        field,
        suggestion: `Possible spelling corrections: ${spellCheckResult.suggestions.join(', ')}`,
        confidence: 0.8,
        type: 'spelling'
      });
    }

    // Field-specific validation
    switch (field) {
      case 'studentName':
        if (text.length < 2) {
          suggestions.push({
            field,
            suggestion: 'Please enter the student\'s full name (first and last name)',
            confidence: 0.9,
            type: 'validation'
          });
        } else if (!text.includes(' ')) {
          suggestions.push({
            field,
            suggestion: 'Consider adding both first and last name',
            confidence: 0.7,
            type: 'enhancement'
          });
        }
        break;
      
      case 'parentEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(text)) {
          suggestions.push({
            field,
            suggestion: 'Please enter a valid email address (e.g., parent@example.com)',
            confidence: 0.95,
            type: 'validation'
          });
        }
        break;
      
      case 'parentPhone':
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(text)) {
          suggestions.push({
            field,
            suggestion: 'Please enter a valid phone number with area code',
            confidence: 0.85,
            type: 'validation'
          });
        }
        break;
      
      case 'address':
        if (text.length < 10) {
          suggestions.push({
            field,
            suggestion: 'Please provide a complete address including street, city, and postal code',
            confidence: 0.8,
            type: 'validation'
          });
        }
        break;
    }

    return suggestions;
  }

  async verifyDocument(file: File, documentText?: string): Promise<DocumentVerification> {
    try {
      // First, try to extract text from document if not provided
      let text = documentText || '';
      
      if (!text && file.type === 'application/pdf') {
        // For demo purposes, simulate text extraction
        text = `Sample extracted text from ${file.name}. Student name: John Doe. Parent: Jane Doe. Address: 123 Main Street.`;
      } else if (!text && file.type.startsWith('image/')) {
        // For demo purposes, simulate OCR
        text = `Sample OCR text from ${file.name}. Document appears to be a birth certificate.`;
      }

      const documentType = this.detectDocumentType(file.name);
      const requiredFields = this.getRequiredFieldsForDocumentType(documentType);

      // Call our NLP validation edge function
      const response = await supabase.functions.invoke('validate-document', {
        body: {
          text,
          documentType,
          requiredFields
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const validationResult = response.data;

      const result: DocumentVerification = {
        isValid: validationResult.overallScore >= 70 && (validationResult.contentValidation?.isAppropriateContent !== false),
        documentType,
        extractedData: validationResult.extractedData || {},
        issues: [],
        confidence: validationResult.confidence / 100,
        grammarErrors: validationResult.grammarErrors || [],
        missingFields: validationResult.missingFields || [],
        contentValidation: {
          ...validationResult.contentValidation,
          contentIssues: validationResult.contentValidation?.contentIssues || [],
          legitimacyScore: validationResult.contentValidation?.legitimacyScore || 70,
          documentTypeMatch: validationResult.contentValidation?.documentTypeMatch !== false,
          qualityIssues: validationResult.contentValidation?.qualityIssues || []
        },
        overallScore: validationResult.overallScore || 0
      };

      // Convert grammar errors to issues
      result.grammarErrors.forEach(error => {
        result.issues.push(`Grammar: "${error.text}" → "${error.suggestion}"`);
      });

      // Convert missing fields to issues
      result.missingFields.forEach(field => {
        if (field.required) {
          result.issues.push(`Missing required field: ${field.description}`);
        }
      });

      // Add content validation issues
      if (!result.contentValidation.isAppropriateContent) {
        result.contentValidation.contentIssues.forEach(issue => {
          if (typeof issue === 'string') {
            result.issues.push(`Content Issue: ${issue}`);
          } else {
            result.issues.push(`${issue.issue}: ${issue.explanation} → ${issue.solution}`);
          }
        });
      }

      // Add document type mismatch issues
      if (result.contentValidation.documentTypeMatch === false) {
        result.issues.push(`Document Type Mismatch: This document may not be a valid ${documentType}`);
      }

      // Add quality issues
      result.contentValidation.qualityIssues?.forEach(qualityIssue => {
        result.issues.push(`Quality Issue: ${qualityIssue}`);
      });

      // Add file-specific validations
      if (file.size > 5 * 1024 * 1024) {
        result.issues.push('File size is large (>5MB). Consider compressing the document.');
      }

      if (file.size < 50 * 1024) {
        result.issues.push('File size seems small. Please ensure the document is complete.');
        result.confidence = Math.max(0, result.confidence - 0.2);
      }

      return result;
    } catch (error) {
      console.error('Document verification error:', error);
      return {
        isValid: false,
        documentType: this.detectDocumentType(file.name),
        extractedData: {},
        issues: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        confidence: 0,
        grammarErrors: [],
        missingFields: [],
        contentValidation: {
          isAppropriateContent: false,
          contentIssues: ["Error processing document"],
          legitimacyScore: 0
        },
        overallScore: 0
      };
    }
  }

  private getRequiredFieldsForDocumentType(documentType: string): string[] {
    const fieldMap: Record<string, string[]> = {
      'Birth Certificate': ['studentName', 'dateOfBirth', 'parentName'],
      'Academic Transcript': ['studentName', 'schoolName', 'grades', 'dateIssued'],
      'Immunization Records': ['studentName', 'dateOfBirth', 'vaccinations', 'doctorName'],
      'Proof of Residence': ['parentName', 'address', 'dateIssued'],
      'Medical Records': ['studentName', 'dateOfBirth', 'medicalInfo', 'doctorName']
    };
    
    return fieldMap[documentType] || ['studentName', 'dateOfBirth'];
  }

  async getPredictiveText(currentText: string, field: string): Promise<PredictiveText> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    const suggestions: string[] = [];

    // Context-aware suggestions based on field and current text
    switch (field) {
      case 'previousSchool':
        if (currentText.toLowerCase().includes('elem')) {
          suggestions.push('Elementary School', 'Elmwood Elementary', 'Elmhurst Elementary');
        } else if (currentText.toLowerCase().includes('high')) {
          suggestions.push('High School', 'Highland High School', 'Hillcrest High School');
        } else if (currentText.toLowerCase().includes('mid')) {
          suggestions.push('Middle School', 'Midtown Middle School');
        } else {
          suggestions.push('Public School', 'Private School', 'Charter School', 'Homeschool');
        }
        break;
      
      case 'specialNeeds':
        const lowerText = currentText.toLowerCase();
        if (lowerText.includes('read')) {
          suggestions.push('Reading support needed', 'Reading comprehension assistance');
        } else if (lowerText.includes('math')) {
          suggestions.push('Mathematics support', 'Math tutoring required');
        } else if (lowerText.includes('speech')) {
          suggestions.push('Speech therapy', 'Speech and language support');
        } else {
          suggestions.push('No special needs', 'Learning disability support', 'ADHD accommodations', 'Autism spectrum support');
        }
        break;
      
      case 'allergyDetails':
        if (currentText.toLowerCase().includes('food')) {
          suggestions.push('Food allergies - nuts, dairy, eggs', 'Severe food allergies requiring EpiPen');
        } else if (currentText.toLowerCase().includes('medication')) {
          suggestions.push('Medication allergies', 'Antibiotic allergies');
        } else {
          suggestions.push('No known allergies', 'Environmental allergies', 'Seasonal allergies');
        }
        break;
      
      default:
        // Generic suggestions based on partial text
        if (currentText.length > 2) {
          suggestions.push(
            currentText + ' (suggested completion)',
            currentText.charAt(0).toUpperCase() + currentText.slice(1)
          );
        }
    }

    return {
      suggestions: suggestions.slice(0, 5), // Limit to 5 suggestions
      context: field
    };
  }

  private detectDocumentType(filename: string): string {
    const lower = filename.toLowerCase();
    
    if (lower.includes('birth') || lower.includes('certificate')) {
      return 'Birth Certificate';
    } else if (lower.includes('immunization') || lower.includes('vaccine')) {
      return 'Immunization Records';
    } else if (lower.includes('transcript') || lower.includes('academic')) {
      return 'Academic Transcript';
    } else if (lower.includes('photo') || lower.includes('picture')) {
      return 'Student Photo';
    } else if (lower.includes('address') || lower.includes('residence') || lower.includes('proof')) {
      return 'Proof of Residence';
    } else if (lower.includes('medical') || lower.includes('health')) {
      return 'Medical Records';
    } else {
      return 'Unknown Document Type';
    }
  }

  async generateApplicationSummary(formData: Record<string, any>): Promise<string> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const summary = `
Application Summary for ${formData.studentName || 'Student'}:

• Grade Level: ${formData.grade || 'Not specified'}
• Parent/Guardian: ${formData.parentName || 'Not provided'}
• Contact: ${formData.parentEmail || 'Not provided'}
• Previous School: ${formData.previousSchool || 'Not specified'}
• Special Needs: ${formData.specialNeeds || 'None specified'}
• Medical Information: ${formData.hasAllergies ? 'Has allergies/medical conditions' : 'No known allergies'}

This application appears to be ${this.calculateCompleteness(formData)}% complete.
    `.trim();

    return summary;
  }

  private calculateCompleteness(formData: Record<string, any>): number {
    const requiredFields = ['studentName', 'dateOfBirth', 'grade', 'parentName', 'parentPhone', 'parentEmail', 'address', 'emergencyContact', 'emergencyPhone'];
    const filledFields = requiredFields.filter(field => formData[field] && formData[field].toString().trim().length > 0);
    return Math.round((filledFields.length / requiredFields.length) * 100);
  }
}

export const nlpService = new NLPService();
