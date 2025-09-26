import React, { useState, useEffect } from 'react';
import { DocumentUploadManager } from './DocumentUploadManager';
import { DocumentPreview } from './DocumentPreview';
import { useDocumentUpload, useApplicationDocuments, checkDocumentCompleteness } from '../../hooks/useDocumentUpload';
import { DocumentValidationResult } from '../../services/documentVerificationService';
import { AlertCircle, CheckCircle, Eye } from 'lucide-react';

interface ApplicationDocumentsStepProps {
  applicationId: string;
  applicationLevel: 'grade_8' | 'grade_10' | 'grade_12';
  onValidationChange: (isValid: boolean) => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

interface UploadedDocument {
  file: File;
  validationResult: DocumentValidationResult;
  uploadedAt: Date;
}

export const ApplicationDocumentsStep: React.FC<ApplicationDocumentsStepProps> = ({
  applicationId,
  applicationLevel,
  onValidationChange,
  onNext,
  onPrevious
}) => {
  const [localDocuments, setLocalDocuments] = useState<Record<string, UploadedDocument>>({});
  const [previewDocument, setPreviewDocument] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { uploadDocument, isUploading, error: uploadError } = useDocumentUpload();
  const { documents: savedDocuments, isLoading, error: fetchError, refetch } = useApplicationDocuments(applicationId);

  // Check completion status whenever documents change
  useEffect(() => {
    const completeness = checkDocumentCompleteness(savedDocuments, applicationLevel);
    onValidationChange(completeness.isComplete);
  }, [savedDocuments, applicationLevel, onValidationChange]);

  const handleDocumentsChange = async (documents: Record<string, UploadedDocument>) => {
    setLocalDocuments(documents);
    
    // Auto-upload documents as they are added
    for (const [documentType, docData] of Object.entries(documents)) {
      // Check if this document is already saved
      const existingSaved = savedDocuments.find(d => d.document_type === documentType);
      if (!existingSaved) {
        try {
          await uploadDocument(
            applicationId,
            docData.file,
            documentType,
            docData.validationResult
          );
          // Refresh the saved documents list
          refetch();
        } catch (error) {
          console.error('Failed to upload document:', error);
        }
      }
    }
  };

  const handleDocumentPreview = (document: any) => {
    setPreviewDocument(document);
  };

  const handleDownload = async (document: any) => {
    if (document.public_url) {
      const link = document.createElement('a');
      link.href = document.public_url;
      link.download = document.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const completeness = checkDocumentCompleteness(savedDocuments, applicationLevel);

  // Convert saved documents to the format expected by DocumentUploadManager
  const existingDocuments = savedDocuments.reduce((acc, doc) => {
    acc[doc.document_type] = {
      name: doc.file_name,
      url: doc.public_url || '',
      validationResult: doc.validation_result
    };
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Required Documents
        </h2>
        <p className="text-gray-600">
          Please upload all required documents for your {applicationLevel.replace('_', ' ').toUpperCase()} application.
          Our AI system will verify each document automatically.
        </p>
      </div>

      {/* Error Display */}
      {(uploadError || fetchError) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">
              {uploadError || fetchError}
            </span>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading your documents...</p>
        </div>
      )}

      {/* Document Upload Manager */}
      {!isLoading && (
        <DocumentUploadManager
          applicationLevel={applicationLevel}
          onDocumentsChange={handleDocumentsChange}
          existingDocuments={existingDocuments}
        />
      )}

      {/* Saved Documents List */}
      {savedDocuments.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Uploaded Documents ({savedDocuments.length})
          </h3>
          
          <div className="space-y-3">
            {savedDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between bg-white p-3 rounded border">
                <div className="flex items-center space-x-3">
                  {doc.validation_result?.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {doc.document_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.file_name} • {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDocumentPreview(doc)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Preview document"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completion Status */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Application Status</h3>
          {completeness.isComplete ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          )}
        </div>

        {completeness.isComplete ? (
          <div className="text-green-700">
            <p className="font-medium">✅ All required documents uploaded and verified!</p>
            <p className="text-sm mt-1">You can now proceed to submit your application.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {completeness.missingRequired.length > 0 && (
              <div className="text-red-700">
                <p className="font-medium">Missing Required Documents:</p>
                <ul className="text-sm mt-1 space-y-1">
                  {completeness.missingRequired.map(type => (
                    <li key={type}>
                      • {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {completeness.invalidDocuments.length > 0 && (
              <div className="text-yellow-700">
                <p className="font-medium">Documents with Issues:</p>
                <ul className="text-sm mt-1 space-y-1">
                  {completeness.invalidDocuments.map(type => (
                    <li key={type}>
                      • {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} (needs review)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Previous Step
          </button>
        )}
        
        {onNext && (
          <button
            onClick={onNext}
            disabled={!completeness.isComplete || isUploading}
            className={`px-6 py-2 rounded-lg font-medium ${
              completeness.isComplete && !isUploading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Next Step'}
          </button>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <DocumentPreview
          document={previewDocument}
          onClose={() => setPreviewDocument(null)}
          onDownload={() => handleDownload(previewDocument)}
        />
      )}
    </div>
  );
};