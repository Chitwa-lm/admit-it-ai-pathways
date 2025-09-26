import React, { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DocumentValidationResult } from '../services/documentVerificationService';

interface UploadedDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  document_type: string;
  validation_result: DocumentValidationResult;
  uploaded_at: string;
  public_url?: string;
}

interface UseDocumentUploadReturn {
  uploadDocument: (
    applicationId: string,
    file: File,
    documentType: string,
    validationResult: DocumentValidationResult
  ) => Promise<UploadedDocument>;
  deleteDocument: (documentId: string, filePath: string) => Promise<void>;
  getDocumentUrl: (filePath: string) => Promise<string>;
  isUploading: boolean;
  error: string | null;
}

export const useDocumentUpload = (): UseDocumentUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = useCallback(async (
    applicationId: string,
    file: File,
    documentType: string,
    validationResult: DocumentValidationResult
  ): Promise<UploadedDocument> => {
    setIsUploading(true);
    setError(null);

    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${applicationId}/${documentType}_${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('application-documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('application-documents')
        .getPublicUrl(filePath);

      // Save document metadata to database
      const { data: documentData, error: dbError } = await supabase
        .from('documents')
        .insert({
          application_id: applicationId,
          document_type: documentType,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          validation_result: validationResult,
          is_verified: validationResult.isValid,
          verification_score: validationResult.overallScore
        })
        .select()
        .single();

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage
          .from('application-documents')
          .remove([filePath]);
        
        throw new Error(`Database error: ${dbError.message}`);
      }

      return {
        ...documentData,
        public_url: urlData.publicUrl,
        validation_result: validationResult
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteDocument = useCallback(async (
    documentId: string,
    filePath: string
  ): Promise<void> => {
    setError(null);

    try {
      // Delete from database first
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) {
        throw new Error(`Database deletion failed: ${dbError.message}`);
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('application-documents')
        .remove([filePath]);

      if (storageError) {
        console.warn('Storage deletion failed:', storageError.message);
        // Don't throw here as the database record is already deleted
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Deletion failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getDocumentUrl = useCallback(async (filePath: string): Promise<string> => {
    try {
      const { data } = supabase.storage
        .from('application-documents')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get document URL';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    uploadDocument,
    deleteDocument,
    getDocumentUrl,
    isUploading,
    error
  };
};

// Hook for fetching application documents
export const useApplicationDocuments = (applicationId: string | null) => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!applicationId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw new Error(`Failed to fetch documents: ${fetchError.message}`);
      }

      // Get public URLs for all documents
      const documentsWithUrls = await Promise.all(
        (data || []).map(async (doc) => {
          try {
            const { data: urlData } = supabase.storage
              .from('application-documents')
              .getPublicUrl(doc.file_path);

            return {
              ...doc,
              public_url: urlData.publicUrl
            };
          } catch {
            return doc;
          }
        })
      );

      setDocuments(documentsWithUrls);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [applicationId]);

  // Fetch documents when applicationId changes
  React.useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    error,
    refetch: fetchDocuments
  };
};

// Utility function to check if all required documents are uploaded and valid
export const checkDocumentCompleteness = (
  documents: UploadedDocument[],
  applicationLevel: 'grade_8' | 'grade_10' | 'grade_12'
): {
  isComplete: boolean;
  missingRequired: string[];
  invalidDocuments: string[];
} => {
  const requiredDocuments: Record<string, string[]> = {
    grade_8: [
      'birth_certificate',
      'grade_7_certificate', 
      'medical_report',
      'passport_photo',
      'parent_id',
      'proof_of_residence'
    ],
    grade_10: [
      'birth_certificate',
      'grade_9_certificate',
      'medical_report', 
      'passport_photo',
      'parent_id',
      'proof_of_residence'
    ],
    grade_12: [
      'birth_certificate',
      'grade_12_certificate',
      'passport_photo'
    ]
  };

  const required = requiredDocuments[applicationLevel] || [];
  const uploadedTypes = documents.map(doc => doc.document_type);
  const validTypes = documents
    .filter(doc => doc.validation_result?.isValid)
    .map(doc => doc.document_type);

  const missingRequired = required.filter(type => !uploadedTypes.includes(type));
  const invalidDocuments = documents
    .filter(doc => required.includes(doc.document_type) && !doc.validation_result?.isValid)
    .map(doc => doc.document_type);

  return {
    isComplete: missingRequired.length === 0 && invalidDocuments.length === 0,
    missingRequired,
    invalidDocuments
  };
};