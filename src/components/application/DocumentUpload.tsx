import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Eye, RotateCcw } from 'lucide-react';
import { documentVerificationService, DocumentValidationResult } from '../../services/documentVerificationService';

interface DocumentUploadProps {
  documentType: string;
  label: string;
  description?: string;
  required?: boolean;
  onUpload: (file: File, validationResult: DocumentValidationResult) => void;
  onRemove: () => void;
  existingFile?: {
    name: string;
    url: string;
    validationResult?: DocumentValidationResult;
  };
  maxSizeInMB?: number;
  acceptedFormats?: string[];
}

interface UploadState {
  isDragging: boolean;
  isUploading: boolean;
  isVerifying: boolean;
  uploadProgress: number;
  file: File | null;
  validationResult: DocumentValidationResult | null;
  error: string | null;
  showPreview: boolean;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  documentType,
  label,
  description,
  required = false,
  onUpload,
  onRemove,
  existingFile,
  maxSizeInMB = 10,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>({
    isDragging: false,
    isUploading: false,
    isVerifying: false,
    uploadProgress: 0,
    file: null,
    validationResult: null,
    error: null,
    showPreview: false
  });

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      isDragging: false,
      isUploading: false,
      isVerifying: false,
      uploadProgress: 0,
      file: null,
      validationResult: null,
      error: null,
      showPreview: false
    }));
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      const formats = acceptedFormats.map(format => format.split('/')[1].toUpperCase()).join(', ');
      return `File must be one of: ${formats}`;
    }

    return null;
  }, [maxSizeInMB, acceptedFormats]);

  const processFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      file, 
      error: null, 
      isUploading: true, 
      uploadProgress: 0 
    }));

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setState(prev => {
          const newProgress = Math.min(prev.uploadProgress + 10, 90);
          return { ...prev, uploadProgress: newProgress };
        });
      }, 100);

      // Start verification
      setState(prev => ({ ...prev, isVerifying: true, uploadProgress: 90 }));
      
      const validationResult = await documentVerificationService.verifyDocument(file, documentType);
      
      clearInterval(progressInterval);
      
      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        isVerifying: false, 
        uploadProgress: 100,
        validationResult 
      }));

      // Call parent callback
      onUpload(file, validationResult);

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isUploading: false, 
        isVerifying: false, 
        error: 'Failed to process document. Please try again.' 
      }));
    }
  }, [documentType, validateFile, onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, isDragging: false }));
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleRemove = useCallback(() => {
    resetState();
    onRemove();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [resetState, onRemove]);

  const handleRetry = useCallback(() => {
    if (state.file) {
      processFile(state.file);
    }
  }, [state.file, processFile]);

  const getStatusColor = (validationResult: DocumentValidationResult | null) => {
    if (!validationResult) return 'text-gray-500';
    if (validationResult.isValid) return 'text-green-600';
    if (validationResult.overallScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (validationResult: DocumentValidationResult | null) => {
    if (!validationResult) return <FileText className="w-5 h-5" />;
    if (validationResult.isValid) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const currentFile = state.file || existingFile;
  const currentValidation = state.validationResult || existingFile?.validationResult;

  return (
    <div className="space-y-4">
      {/* Label and Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      {!currentFile && (
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${state.isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${state.error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={acceptedFormats.join(',')}
            onChange={handleFileSelect}
          />
          
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">
            Drop your {label.toLowerCase()} here, or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supports: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} 
            (Max {maxSizeInMB}MB)
          </p>
        </div>
      )}

      {/* Error Display */}
      {state.error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Upload Progress */}
      {state.isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {state.isVerifying ? 'Verifying document...' : 'Uploading...'}
            </span>
            <span className="text-gray-500">{state.uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${state.uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* File Display */}
      {currentFile && !state.isUploading && (
        <div className="border rounded-lg p-4 space-y-3">
          {/* File Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(currentValidation)}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {'name' in currentFile ? currentFile.name : currentFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {'size' in currentFile 
                    ? `${(currentFile.size / 1024 / 1024).toFixed(2)} MB`
                    : 'Uploaded file'
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {currentValidation && !currentValidation.isValid && (
                <button
                  onClick={handleRetry}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Retry verification"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              {'url' in currentFile && (
                <button
                  onClick={() => setState(prev => ({ ...prev, showPreview: true }))}
                  className="p-1 text-gray-400 hover:text-gray-600"
                  title="Preview document"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleRemove}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Remove document"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Validation Results */}
          {currentValidation && (
            <div className="space-y-3 pt-3 border-t">
              {/* Overall Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verification Status:</span>
                <span className={`text-sm font-medium ${getStatusColor(currentValidation)}`}>
                  {currentValidation.isValid ? 'Valid' : 'Issues Found'} 
                  ({currentValidation.overallScore}%)
                </span>
              </div>

              {/* Type Detection */}
              <div className="text-sm">
                <span className="font-medium">Document Type: </span>
                <span className={currentValidation.typeDetection.isCorrectType ? 'text-green-600' : 'text-red-600'}>
                  {currentValidation.typeDetection.detectedType}
                </span>
                {!currentValidation.typeDetection.isCorrectType && (
                  <span className="text-gray-500 ml-1">
                    (Expected: {currentValidation.typeDetection.expectedType})
                  </span>
                )}
              </div>

              {/* Quality Indicators */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Image Quality: </span>
                  <span className={`capitalize ${
                    currentValidation.qualityAnalysis.imageQuality === 'excellent' ? 'text-green-600' :
                    currentValidation.qualityAnalysis.imageQuality === 'good' ? 'text-blue-600' :
                    currentValidation.qualityAnalysis.imageQuality === 'fair' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {currentValidation.qualityAnalysis.imageQuality}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Readability: </span>
                  <span className={currentValidation.qualityAnalysis.readability >= 80 ? 'text-green-600' : 'text-yellow-600'}>
                    {currentValidation.qualityAnalysis.readability}%
                  </span>
                </div>
              </div>

              {/* Recommendations */}
              {currentValidation.recommendations.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">Recommendations:</span>
                  <div className="space-y-1">
                    {currentValidation.recommendations.slice(0, 3).map((rec, index) => (
                      <p key={index} className="text-xs text-gray-600 pl-2">
                        {rec}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {state.showPreview && 'url' in currentFile! && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Document Preview</h3>
              <button
                onClick={() => setState(prev => ({ ...prev, showPreview: false }))}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4">
              <img 
                src={currentFile.url} 
                alt="Document preview"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};