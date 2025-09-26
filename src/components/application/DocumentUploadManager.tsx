import React, { useState, useCallback } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { DocumentValidationResult } from '../../services/documentVerificationService';
import { AlertCircle, CheckCircle, FileText, Info } from 'lucide-react';

interface DocumentRequirement {
  type: string;
  label: string;
  description: string;
  required: boolean;
  acceptedFormats?: string[];
  maxSizeInMB?: number;
}

interface UploadedDocument {
  file: File;
  validationResult: DocumentValidationResult;
  uploadedAt: Date;
}

interface DocumentUploadManagerProps {
  applicationLevel: 'grade_8' | 'grade_10' | 'grade_12';
  onDocumentsChange: (documents: Record<string, UploadedDocument>) => void;
  existingDocuments?: Record<string, {
    name: string;
    url: string;
    validationResult?: DocumentValidationResult;
  }>;
}

const DOCUMENT_REQUIREMENTS: Record<string, DocumentRequirement[]> = {
  grade_8: [
    {
      type: 'birth_certificate',
      label: 'Birth Certificate',
      description: 'Official birth certificate issued by the Government of Zambia',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'grade_7_certificate',
      label: 'Grade 7 Certificate',
      description: 'Grade 7 examination certificate from your primary school',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'medical_report',
      label: 'Medical Report',
      description: 'Recent medical examination report (within 6 months)',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'passport_photo',
      label: 'Passport Photo',
      description: 'Recent passport-size photograph with white background',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png'],
      maxSizeInMB: 2
    },
    {
      type: 'parent_id',
      label: 'Parent/Guardian ID',
      description: 'National Registration Card or Passport of parent/guardian',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'proof_of_residence',
      label: 'Proof of Residence',
      description: 'Utility bill, lease agreement, or council letter (within 3 months)',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    }
  ],
  grade_10: [
    {
      type: 'birth_certificate',
      label: 'Birth Certificate',
      description: 'Official birth certificate issued by the Government of Zambia',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'grade_9_certificate',
      label: 'Grade 9 Certificate',
      description: 'Grade 9 examination certificate with all subject results',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'medical_report',
      label: 'Medical Report',
      description: 'Recent medical examination report (within 6 months)',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'passport_photo',
      label: 'Passport Photo',
      description: 'Recent passport-size photograph with white background',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png'],
      maxSizeInMB: 2
    },
    {
      type: 'parent_id',
      label: 'Parent/Guardian ID',
      description: 'National Registration Card or Passport of parent/guardian',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'proof_of_residence',
      label: 'Proof of Residence',
      description: 'Utility bill, lease agreement, or council letter (within 3 months)',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    }
  ],
  grade_12: [
    {
      type: 'birth_certificate',
      label: 'Birth Certificate',
      description: 'Official birth certificate issued by the Government of Zambia',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'grade_12_certificate',
      label: 'Grade 12 Certificate',
      description: 'Grade 12 examination certificate with all subject results',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'medical_report',
      label: 'Medical Report',
      description: 'Recent medical examination report (within 6 months)',
      required: false,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'passport_photo',
      label: 'Passport Photo',
      description: 'Recent passport-size photograph with white background',
      required: true,
      acceptedFormats: ['image/jpeg', 'image/png'],
      maxSizeInMB: 2
    },
    {
      type: 'parent_id',
      label: 'Parent/Guardian ID',
      description: 'National Registration Card or Passport of parent/guardian',
      required: false,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    },
    {
      type: 'recommendation_letter',
      label: 'Recommendation Letter',
      description: 'Letter of recommendation from previous school or employer',
      required: false,
      acceptedFormats: ['image/jpeg', 'image/png', 'application/pdf'],
      maxSizeInMB: 5
    }
  ]
};

export const DocumentUploadManager: React.FC<DocumentUploadManagerProps> = ({
  applicationLevel,
  onDocumentsChange,
  existingDocuments = {}
}) => {
  const [documents, setDocuments] = useState<Record<string, UploadedDocument>>({});
  const [showOptional, setShowOptional] = useState(false);

  const requirements = DOCUMENT_REQUIREMENTS[applicationLevel] || [];
  const requiredDocs = requirements.filter(req => req.required);
  const optionalDocs = requirements.filter(req => !req.required);

  const handleDocumentUpload = useCallback((
    documentType: string,
    file: File,
    validationResult: DocumentValidationResult
  ) => {
    const newDocuments = {
      ...documents,
      [documentType]: {
        file,
        validationResult,
        uploadedAt: new Date()
      }
    };
    
    setDocuments(newDocuments);
    onDocumentsChange(newDocuments);
  }, [documents, onDocumentsChange]);

  const handleDocumentRemove = useCallback((documentType: string) => {
    const newDocuments = { ...documents };
    delete newDocuments[documentType];
    
    setDocuments(newDocuments);
    onDocumentsChange(newDocuments);
  }, [documents, onDocumentsChange]);

  const getUploadStats = () => {
    const totalRequired = requiredDocs.length;
    const uploadedRequired = requiredDocs.filter(req => 
      documents[req.type] || existingDocuments[req.type]
    ).length;
    const validRequired = requiredDocs.filter(req => {
      const doc = documents[req.type] || existingDocuments[req.type];
      return doc && (
        'validationResult' in doc 
          ? doc.validationResult?.isValid 
          : doc.validationResult?.isValid
      );
    }).length;

    const totalOptional = optionalDocs.length;
    const uploadedOptional = optionalDocs.filter(req => 
      documents[req.type] || existingDocuments[req.type]
    ).length;

    return {
      totalRequired,
      uploadedRequired,
      validRequired,
      totalOptional,
      uploadedOptional,
      isComplete: uploadedRequired === totalRequired && validRequired === totalRequired
    };
  };

  const stats = getUploadStats();

  return (
    <div className="space-y-6">
      {/* Header and Progress */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Document Upload Requirements for {applicationLevel.replace('_', ' ').toUpperCase()}
            </h3>
            <p className="text-sm text-blue-700 mb-3">
              Please upload all required documents. Our AI system will automatically verify each document 
              to ensure it meets the admission requirements.
            </p>
            
            {/* Progress Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>
                  Required: {stats.uploadedRequired}/{stats.totalRequired} uploaded
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {stats.validRequired === stats.totalRequired ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                )}
                <span>
                  Valid: {stats.validRequired}/{stats.totalRequired} verified
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span>
                  Optional: {stats.uploadedOptional}/{stats.totalOptional} uploaded
                </span>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-blue-700 mb-1">
                <span>Overall Progress</span>
                <span>{Math.round((stats.validRequired / stats.totalRequired) * 100)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(stats.validRequired / stats.totalRequired) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Required Documents */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          Required Documents
          <span className="ml-2 text-sm text-red-600">({stats.totalRequired} documents)</span>
        </h3>
        
        <div className="grid gap-6">
          {requiredDocs.map((requirement) => (
            <DocumentUpload
              key={requirement.type}
              documentType={requirement.type}
              label={requirement.label}
              description={requirement.description}
              required={requirement.required}
              acceptedFormats={requirement.acceptedFormats}
              maxSizeInMB={requirement.maxSizeInMB}
              existingFile={existingDocuments[requirement.type]}
              onUpload={(file, validationResult) => 
                handleDocumentUpload(requirement.type, file, validationResult)
              }
              onRemove={() => handleDocumentRemove(requirement.type)}
            />
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      {optionalDocs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              Optional Documents
              <span className="ml-2 text-sm text-gray-600">({optionalDocs.length} documents)</span>
            </h3>
            <button
              onClick={() => setShowOptional(!showOptional)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showOptional ? 'Hide Optional' : 'Show Optional'}
            </button>
          </div>

          {showOptional && (
            <div className="grid gap-6">
              {optionalDocs.map((requirement) => (
                <DocumentUpload
                  key={requirement.type}
                  documentType={requirement.type}
                  label={requirement.label}
                  description={requirement.description}
                  required={requirement.required}
                  acceptedFormats={requirement.acceptedFormats}
                  maxSizeInMB={requirement.maxSizeInMB}
                  existingFile={existingDocuments[requirement.type]}
                  onUpload={(file, validationResult) => 
                    handleDocumentUpload(requirement.type, file, validationResult)
                  }
                  onRemove={() => handleDocumentRemove(requirement.type)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completion Status */}
      {stats.isComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h4 className="text-sm font-medium text-green-900">
                All Required Documents Uploaded Successfully!
              </h4>
              <p className="text-sm text-green-700">
                All your required documents have been uploaded and verified. 
                You can now proceed to submit your application.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Validation Issues Summary */}
      {stats.uploadedRequired > 0 && stats.validRequired < stats.uploadedRequired && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900 mb-2">
                Document Verification Issues
              </h4>
              <p className="text-sm text-yellow-700 mb-2">
                Some documents have validation issues that need to be resolved:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                {requiredDocs.map(req => {
                  const doc = documents[req.type] || existingDocuments[req.type];
                  const isValid = doc && (
                    'validationResult' in doc 
                      ? doc.validationResult?.isValid 
                      : doc.validationResult?.isValid
                  );
                  
                  if (doc && !isValid) {
                    return (
                      <li key={req.type} className="flex items-center space-x-2">
                        <span>•</span>
                        <span>{req.label}: Please review and re-upload if necessary</span>
                      </li>
                    );
                  }
                  return null;
                }).filter(Boolean)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};