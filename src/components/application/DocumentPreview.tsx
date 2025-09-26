import React, { useState } from 'react';
import { X, Download, Eye, FileText, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { DocumentValidationResult } from '../../services/documentVerificationService';

interface DocumentPreviewProps {
  document: {
    id: string;
    file_name: string;
    file_path: string;
    mime_type: string;
    document_type: string;
    validation_result?: DocumentValidationResult;
    public_url?: string;
  };
  onClose: () => void;
  onDownload?: () => void;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onClose,
  onDownload
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isImage = document.mime_type.startsWith('image/');
  const isPDF = document.mime_type === 'application/pdf';

  const formatDocumentType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getValidationStatusColor = (result?: DocumentValidationResult) => {
    if (!result) return 'text-gray-500';
    if (result.isValid) return 'text-green-600';
    if (result.overallScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getValidationIcon = (result?: DocumentValidationResult) => {
    if (!result) return <FileText className="w-5 h-5 text-gray-500" />;
    if (result.isValid) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl max-h-[95vh] w-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center space-x-3">
            {isImage ? (
              <Image className="w-6 h-6 text-blue-600" />
            ) : (
              <FileText className="w-6 h-6 text-blue-600" />
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {formatDocumentType(document.document_type)}
              </h3>
              <p className="text-sm text-gray-500">{document.file_name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {onDownload && (
              <button
                onClick={onDownload}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                title="Download document"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
              title="Close preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document Viewer */}
          <div className="flex-1 flex items-center justify-center bg-gray-100 relative">
            {isImage && document.public_url && !imageError ? (
              <div className="max-w-full max-h-full overflow-auto p-4">
                <img
                  src={document.public_url}
                  alt={document.file_name}
                  className="max-w-full h-auto shadow-lg rounded"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setImageError(true);
                    setIsLoading(false);
                  }}
                />
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            ) : isPDF && document.public_url ? (
              <iframe
                src={document.public_url}
                className="w-full h-full border-0"
                title={document.file_name}
                onLoad={() => setIsLoading(false)}
              />
            ) : (
              <div className="text-center p-8">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  {imageError ? 'Failed to load image' : 'Preview not available'}
                </p>
                <p className="text-sm text-gray-500">
                  {document.file_name}
                </p>
                {onDownload && (
                  <button
                    onClick={onDownload}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Download to View
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Validation Panel */}
          {document.validation_result && (
            <div className="w-80 border-l bg-white overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="border-b pb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Verification Results
                  </h4>
                  
                  {/* Overall Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Status:</span>
                    <div className="flex items-center space-x-2">
                      {getValidationIcon(document.validation_result)}
                      <span className={`text-sm font-medium ${getValidationStatusColor(document.validation_result)}`}>
                        {document.validation_result.isValid ? 'Valid' : 'Issues Found'}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Score:</span>
                    <span className={`text-sm font-medium ${getValidationStatusColor(document.validation_result)}`}>
                      {document.validation_result.overallScore}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        document.validation_result.isValid 
                          ? 'bg-green-600' 
                          : document.validation_result.overallScore >= 50 
                            ? 'bg-yellow-600' 
                            : 'bg-red-600'
                      }`}
                      style={{ width: `${document.validation_result.overallScore}%` }}
                    />
                  </div>
                </div>

                {/* Type Detection */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900">Document Type</h5>
                  <div className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected:</span>
                      <span>{document.validation_result.typeDetection.expectedType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Detected:</span>
                      <span className={document.validation_result.typeDetection.isCorrectType ? 'text-green-600' : 'text-red-600'}>
                        {document.validation_result.typeDetection.detectedType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span>{document.validation_result.typeDetection.confidence}%</span>
                    </div>
                  </div>
                </div>

                {/* Quality Analysis */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900">Quality Analysis</h5>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Image Quality:</span>
                      <span className={`capitalize ${
                        document.validation_result.qualityAnalysis.imageQuality === 'excellent' ? 'text-green-600' :
                        document.validation_result.qualityAnalysis.imageQuality === 'good' ? 'text-blue-600' :
                        document.validation_result.qualityAnalysis.imageQuality === 'fair' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {document.validation_result.qualityAnalysis.imageQuality}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Readability:</span>
                      <span className={document.validation_result.qualityAnalysis.readability >= 80 ? 'text-green-600' : 'text-yellow-600'}>
                        {document.validation_result.qualityAnalysis.readability}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Analysis */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900">Content Analysis</h5>
                  <div className="text-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Required Fields:</span>
                      <span className={document.validation_result.contentAnalysis.hasRequiredFields ? 'text-green-600' : 'text-red-600'}>
                        {document.validation_result.contentAnalysis.hasRequiredFields ? 'Complete' : 'Missing'}
                      </span>
                    </div>
                    
                    {document.validation_result.contentAnalysis.missingFields.length > 0 && (
                      <div>
                        <span className="text-gray-600 text-xs">Missing:</span>
                        <ul className="text-xs text-red-600 mt-1 space-y-1">
                          {document.validation_result.contentAnalysis.missingFields.map((field, index) => (
                            <li key={index}>• {field}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Analysis */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-gray-900">Security Analysis</h5>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Authenticity:</span>
                      <span className={document.validation_result.securityAnalysis.isAuthentic ? 'text-green-600' : 'text-red-600'}>
                        {document.validation_result.securityAnalysis.isAuthentic ? 'Authentic' : 'Suspicious'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Legitimacy Score:</span>
                      <span className={document.validation_result.securityAnalysis.legitimacyScore >= 70 ? 'text-green-600' : 'text-yellow-600'}>
                        {document.validation_result.securityAnalysis.legitimacyScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {document.validation_result.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-900">Recommendations</h5>
                    <div className="space-y-2">
                      {document.validation_result.recommendations.slice(0, 5).map((rec, index) => (
                        <div key={index} className="text-xs p-2 bg-gray-50 rounded border-l-2 border-gray-300">
                          {rec}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};