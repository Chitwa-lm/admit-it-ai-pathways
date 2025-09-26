// Enhanced Document Verification Service with AI-powered document type detection

export interface DocumentTypeDetection {
  detectedType: string;
  expectedType: string;
  confidence: number;
  isCorrectType: boolean;
  reasons: string[];
}

export interface DocumentValidationResult {
  isValid: boolean;
  typeDetection: DocumentTypeDetection;
  contentAnalysis: {
    hasRequiredFields: boolean;
    missingFields: string[];
    extractedData: Record<string, any>;
  };
  qualityAnalysis: {
    imageQuality: 'excellent' | 'good' | 'fair' | 'poor';
    readability: number; // 0-100
    issues: string[];
  };
  securityAnalysis: {
    isAuthentic: boolean;
    suspiciousElements: string[];
    legitimacyScore: number; // 0-100
  };
  overallScore: number;
  recommendations: string[];
}

class DocumentVerificationService {
  private documentPatterns = {
    'birth_certificate': {
      keywords: ['birth', 'certificate', 'born', 'date of birth', 'place of birth', 'parents', 'registrar', 'vital records'],
      requiredFields: ['full name', 'date of birth', 'place of birth', 'parent names'],
      format: 'official government document'
    },
    'grade_7_certificate': {
      keywords: ['grade 7', 'certificate', 'examination', 'results', 'subjects', 'marks', 'school', 'education'],
      requiredFields: ['student name', 'school name', 'subjects', 'grades', 'year'],
      format: 'educational certificate'
    },
    'grade_9_certificate': {
      keywords: ['grade 9', 'certificate', 'examination', 'results', 'subjects', 'marks', 'school', 'education'],
      requiredFields: ['student name', 'school name', 'subjects', 'grades', 'year'],
      format: 'educational certificate'
    },
    'grade_12_certificate': {
      keywords: ['grade 12', 'certificate', 'examination', 'results', 'subjects', 'marks', 'school', 'education'],
      requiredFields: ['student name', 'school name', 'subjects', 'grades', 'year'],
      format: 'educational certificate'
    },
    'medical_report': {
      keywords: ['medical', 'health', 'doctor', 'physician', 'examination', 'report', 'patient', 'diagnosis'],
      requiredFields: ['patient name', 'date', 'doctor name', 'medical findings'],
      format: 'medical document'
    },
    'passport_photo': {
      keywords: ['photo', 'picture', 'image'],
      requiredFields: ['clear face', 'proper lighting', 'neutral background'],
      format: 'photograph'
    },
    'parent_id': {
      keywords: ['identity', 'identification', 'id card', 'national', 'citizen', 'passport'],
      requiredFields: ['full name', 'id number', 'photo', 'signature'],
      format: 'identification document'
    },
    'proof_of_residence': {
      keywords: ['address', 'residence', 'utility', 'bill', 'statement', 'lease', 'rental'],
      requiredFields: ['name', 'address', 'date', 'issuing authority'],
      format: 'address verification document'
    }
  };

  async verifyDocument(
    file: File, 
    expectedDocumentType: string
  ): Promise<DocumentValidationResult> {
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Extract text content (simulated OCR/text extraction)
      const extractedText = await this.extractTextFromFile(file);
      
      // Detect actual document type
      const typeDetection = this.detectDocumentType(extractedText, file.name, expectedDocumentType);
      
      // Analyze content
      const contentAnalysis = this.analyzeContent(extractedText, expectedDocumentType);
      
      // Analyze quality
      const qualityAnalysis = await this.analyzeQuality(file, extractedText);
      
      // Security analysis
      const securityAnalysis = this.analyzeAuthenticity(extractedText, file);
      
      // Calculate overall score
      const overallScore = this.calculateOverallScore(
        typeDetection,
        contentAnalysis,
        qualityAnalysis,
        securityAnalysis
      );
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(
        typeDetection,
        contentAnalysis,
        qualityAnalysis,
        securityAnalysis
      );

      return {
        isValid: overallScore >= 70 && typeDetection.isCorrectType,
        typeDetection,
        contentAnalysis,
        qualityAnalysis,
        securityAnalysis,
        overallScore,
        recommendations
      };

    } catch (error) {
      console.error('Document verification error:', error);
      return this.createErrorResult(expectedDocumentType, error);
    }
  }

  private async extractTextFromFile(file: File): Promise<string> {
    // Simulate OCR/text extraction based on file type
    const fileName = file.name.toLowerCase();
    
    if (file.type.startsWith('image/')) {
      // Simulate OCR for images
      if (fileName.includes('birth')) {
        return `REPUBLIC OF ZAMBIA
CERTIFICATE OF BIRTH
Registration No: BC/2010/123456
This is to certify that JOHN MWANZA was born on 15th March 2010
at University Teaching Hospital, Lusaka
Father: PETER MWANZA
Mother: MARY MWANZA
Registrar of Births and Deaths`;
      } else if (fileName.includes('grade') || fileName.includes('certificate')) {
        return `ZAMBIA EXAMINATIONS COUNCIL
GRADE 7 CERTIFICATE
Student: JOHN MWANZA
School: Lusaka Primary School
Year: 2023
Mathematics: 85%
English: 78%
Science: 82%`;
      } else if (fileName.includes('medical')) {
        return `MEDICAL EXAMINATION REPORT
Patient: JOHN MWANZA
Date: 20th January 2024
Doctor: Dr. Sarah Banda
Medical Officer
The student is in good health and fit for school activities.`;
      } else {
        return `Sample document text extracted from ${file.name}. 
This appears to be a general document with some text content.
Name: Sample Name
Date: 2024-01-20`;
      }
    } else if (file.type === 'application/pdf') {
      // Simulate PDF text extraction
      return `PDF Document Content
Title: ${file.name}
This is extracted text from a PDF document.
Contains various information and data fields.`;
    } else {
      return `Document content from ${file.name}`;
    }
  }

  private detectDocumentType(
    text: string, 
    fileName: string, 
    expectedType: string
  ): DocumentTypeDetection {
    const textLower = text.toLowerCase();
    const fileNameLower = fileName.toLowerCase();
    
    let bestMatch = '';
    let highestScore = 0;
    let matchReasons: string[] = [];

    // Check each document type pattern
    Object.entries(this.documentPatterns).forEach(([type, pattern]) => {
      let score = 0;
      const reasons: string[] = [];

      // Check keywords in text
      pattern.keywords.forEach(keyword => {
        if (textLower.includes(keyword.toLowerCase())) {
          score += 10;
          reasons.push(`Contains keyword: "${keyword}"`);
        }
      });

      // Check filename
      pattern.keywords.forEach(keyword => {
        if (fileNameLower.includes(keyword.toLowerCase())) {
          score += 5;
          reasons.push(`Filename suggests: "${keyword}"`);
        }
      });

      // Check required fields presence
      pattern.requiredFields.forEach(field => {
        if (textLower.includes(field.toLowerCase().replace(' ', ''))) {
          score += 8;
          reasons.push(`Contains required field: "${field}"`);
        }
      });

      if (score > highestScore) {
        highestScore = score;
        bestMatch = type;
        matchReasons = reasons;
      }
    });

    const detectedType = this.formatDocumentType(bestMatch);
    const expectedTypeFormatted = this.formatDocumentType(expectedType);
    const isCorrectType = bestMatch === expectedType || detectedType.toLowerCase().includes(expectedTypeFormatted.toLowerCase());
    
    // Calculate confidence based on score
    const confidence = Math.min(100, Math.max(0, (highestScore / 50) * 100));

    const reasons = isCorrectType 
      ? matchReasons
      : [
          `Expected: ${expectedTypeFormatted}`,
          `Detected: ${detectedType}`,
          ...matchReasons.slice(0, 3)
        ];

    return {
      detectedType,
      expectedType: expectedTypeFormatted,
      confidence,
      isCorrectType,
      reasons
    };
  }

  private formatDocumentType(type: string): string {
    const typeMap: Record<string, string> = {
      'birth_certificate': 'Birth Certificate',
      'grade_7_certificate': 'Grade 7 Certificate',
      'grade_9_certificate': 'Grade 9 Certificate', 
      'grade_12_certificate': 'Grade 12 Certificate',
      'medical_report': 'Medical Report',
      'passport_photo': 'Passport Photo',
      'parent_id': 'Parent ID Document',
      'proof_of_residence': 'Proof of Residence',
      'recommendation_letter': 'Recommendation Letter',
      'other': 'Other Document'
    };
    
    return typeMap[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  private analyzeContent(text: string, expectedType: string): {
    hasRequiredFields: boolean;
    missingFields: string[];
    extractedData: Record<string, any>;
  } {
    const pattern = this.documentPatterns[expectedType as keyof typeof this.documentPatterns];
    const extractedData: Record<string, any> = {};
    const missingFields: string[] = [];

    if (!pattern) {
      return {
        hasRequiredFields: false,
        missingFields: ['Unknown document type'],
        extractedData: {}
      };
    }

    // Extract common data patterns
    const nameMatch = text.match(/(?:name|student|patient):\s*([A-Za-z\s]+)/i);
    if (nameMatch) extractedData.name = nameMatch[1].trim();

    const dateMatch = text.match(/(?:date|born):\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}|\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4})/i);
    if (dateMatch) extractedData.date = dateMatch[1].trim();

    const schoolMatch = text.match(/(?:school|institution):\s*([A-Za-z\s]+)/i);
    if (schoolMatch) extractedData.school = schoolMatch[1].trim();

    // Check for required fields
    pattern.requiredFields.forEach(field => {
      const fieldLower = field.toLowerCase();
      let found = false;

      if (fieldLower.includes('name') && extractedData.name) found = true;
      else if (fieldLower.includes('date') && extractedData.date) found = true;
      else if (fieldLower.includes('school') && extractedData.school) found = true;
      else if (text.toLowerCase().includes(fieldLower.replace(' ', ''))) found = true;

      if (!found) {
        missingFields.push(field);
      }
    });

    return {
      hasRequiredFields: missingFields.length === 0,
      missingFields,
      extractedData
    };
  }

  private async analyzeQuality(file: File, text: string): Promise<{
    imageQuality: 'excellent' | 'good' | 'fair' | 'poor';
    readability: number;
    issues: string[];
  }> {
    const issues: string[] = [];
    let imageQuality: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
    let readability = 85;

    // File size analysis
    if (file.size < 50 * 1024) { // Less than 50KB
      issues.push('File size is very small, image quality may be poor');
      imageQuality = 'poor';
      readability -= 30;
    } else if (file.size > 10 * 1024 * 1024) { // Greater than 10MB
      issues.push('File size is very large, consider compressing');
      readability -= 10;
    }

    // Text quality analysis
    if (text.length < 50) {
      issues.push('Very little text detected, document may be unclear');
      readability -= 25;
    }

    // Check for common OCR errors
    const ocrErrorPatterns = [
      /[0O]{3,}/, // Multiple zeros/Os
      /[1Il]{3,}/, // Multiple 1s/Is/ls
      /[^\w\s\.\,\-\(\)]{3,}/, // Multiple special characters
    ];

    ocrErrorPatterns.forEach(pattern => {
      if (pattern.test(text)) {
        issues.push('Text recognition errors detected, document may be blurry');
        readability -= 15;
      }
    });

    // Determine image quality based on readability
    if (readability >= 90) imageQuality = 'excellent';
    else if (readability >= 75) imageQuality = 'good';
    else if (readability >= 50) imageQuality = 'fair';
    else imageQuality = 'poor';

    return {
      imageQuality,
      readability: Math.max(0, Math.min(100, readability)),
      issues
    };
  }

  private analyzeAuthenticity(text: string, file: File): {
    isAuthentic: boolean;
    suspiciousElements: string[];
    legitimacyScore: number;
  } {
    const suspiciousElements: string[] = [];
    let legitimacyScore = 80;

    // Check for common authenticity markers
    const authenticityMarkers = [
      'official', 'government', 'ministry', 'department', 'registrar', 
      'seal', 'stamp', 'signature', 'authorized', 'certified'
    ];

    const hasAuthenticityMarkers = authenticityMarkers.some(marker => 
      text.toLowerCase().includes(marker)
    );

    if (!hasAuthenticityMarkers) {
      suspiciousElements.push('Missing official authenticity markers');
      legitimacyScore -= 20;
    }

    // Check for suspicious patterns
    if (text.includes('SAMPLE') || text.includes('DRAFT')) {
      suspiciousElements.push('Document appears to be a sample or draft');
      legitimacyScore -= 30;
    }

    // Check file metadata (simulated)
    if (file.name.toLowerCase().includes('fake') || file.name.toLowerCase().includes('sample')) {
      suspiciousElements.push('Filename suggests non-authentic document');
      legitimacyScore -= 25;
    }

    // Check for proper formatting
    if (text.length < 100) {
      suspiciousElements.push('Document content seems insufficient for official document');
      legitimacyScore -= 15;
    }

    return {
      isAuthentic: legitimacyScore >= 60 && suspiciousElements.length < 2,
      suspiciousElements,
      legitimacyScore: Math.max(0, Math.min(100, legitimacyScore))
    };
  }

  private calculateOverallScore(
    typeDetection: DocumentTypeDetection,
    contentAnalysis: any,
    qualityAnalysis: any,
    securityAnalysis: any
  ): number {
    let score = 0;

    // Type detection (40% weight)
    if (typeDetection.isCorrectType) {
      score += 40 * (typeDetection.confidence / 100);
    } else {
      score += 10; // Partial credit for detecting something
    }

    // Content analysis (30% weight)
    if (contentAnalysis.hasRequiredFields) {
      score += 30;
    } else {
      const fieldRatio = Math.max(0, 1 - (contentAnalysis.missingFields.length / 5));
      score += 30 * fieldRatio;
    }

    // Quality analysis (20% weight)
    score += 20 * (qualityAnalysis.readability / 100);

    // Security analysis (10% weight)
    score += 10 * (securityAnalysis.legitimacyScore / 100);

    return Math.round(Math.max(0, Math.min(100, score)));
  }

  private generateRecommendations(
    typeDetection: DocumentTypeDetection,
    contentAnalysis: any,
    qualityAnalysis: any,
    securityAnalysis: any
  ): string[] {
    const recommendations: string[] = [];

    // Type mismatch recommendations
    if (!typeDetection.isCorrectType) {
      recommendations.push(
        `❌ Wrong document type: Expected ${typeDetection.expectedType}, but detected ${typeDetection.detectedType}. Please upload the correct document type.`
      );
      recommendations.push(
        `💡 Make sure you're uploading a ${typeDetection.expectedType} and not a ${typeDetection.detectedType}.`
      );
    } else {
      recommendations.push(`✅ Correct document type detected: ${typeDetection.detectedType}`);
    }

    // Content recommendations
    if (!contentAnalysis.hasRequiredFields) {
      recommendations.push(
        `📋 Missing required information: ${contentAnalysis.missingFields.join(', ')}. Please ensure your document contains all necessary details.`
      );
    }

    // Quality recommendations
    if (qualityAnalysis.imageQuality === 'poor') {
      recommendations.push(
        `📸 Poor image quality detected. Please retake the photo with better lighting and focus.`
      );
    } else if (qualityAnalysis.imageQuality === 'fair') {
      recommendations.push(
        `📷 Image quality could be improved. Consider retaking with better lighting or higher resolution.`
      );
    }

    // Security recommendations
    if (!securityAnalysis.isAuthentic) {
      recommendations.push(
        `🔒 Document authenticity concerns detected. Please ensure you're uploading an original, official document.`
      );
    }

    if (securityAnalysis.suspiciousElements.length > 0) {
      recommendations.push(
        `⚠️ Potential issues: ${securityAnalysis.suspiciousElements.join(', ')}`
      );
    }

    // General recommendations
    if (recommendations.filter(r => r.startsWith('❌')).length === 0) {
      recommendations.push(`🎉 Document verification successful! Your ${typeDetection.detectedType} looks good.`);
    }

    return recommendations;
  }

  private createErrorResult(expectedType: string, error: any): DocumentValidationResult {
    return {
      isValid: false,
      typeDetection: {
        detectedType: 'Error',
        expectedType: this.formatDocumentType(expectedType),
        confidence: 0,
        isCorrectType: false,
        reasons: [`Verification failed: ${error.message || 'Unknown error'}`]
      },
      contentAnalysis: {
        hasRequiredFields: false,
        missingFields: ['Unable to analyze'],
        extractedData: {}
      },
      qualityAnalysis: {
        imageQuality: 'poor',
        readability: 0,
        issues: ['Document processing failed']
      },
      securityAnalysis: {
        isAuthentic: false,
        suspiciousElements: ['Processing error'],
        legitimacyScore: 0
      },
      overallScore: 0,
      recommendations: [
        '❌ Document verification failed. Please try uploading the document again.',
        '💡 Ensure the file is not corrupted and is in a supported format (PDF, JPG, PNG).'
      ]
    };
  }
}

export const documentVerificationService = new DocumentVerificationService();