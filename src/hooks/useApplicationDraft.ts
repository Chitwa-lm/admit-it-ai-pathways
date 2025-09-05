import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FormData {
  studentName: string;
  dateOfBirth: string;
  grade: string;
  gender: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  previousSchool: string;
  specialNeeds: string;
  hasAllergies: boolean;
  allergyDetails: string;
  emergencyContact: string;
  emergencyPhone: string;
  additionalInfo: string;
}

export interface FormProgress {
  studentInfo: boolean;
  parentInfo: boolean;
  additionalInfo: boolean;
}

interface ApplicationDraft {
  id: string;
  user_id: string;
  form_data: FormData;
  progress: FormProgress;
  last_saved_at: string;
  created_at: string;
  updated_at: string;
}

export const useApplicationDraft = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<FormData>({
    studentName: "",
    dateOfBirth: "",
    grade: "",
    gender: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    previousSchool: "",
    specialNeeds: "",
    hasAllergies: false,
    allergyDetails: "",
    emergencyContact: "",
    emergencyPhone: "",
    additionalInfo: ""
  });

  const [progress, setProgress] = useState<FormProgress>({
    studentInfo: false,
    parentInfo: false,
    additionalInfo: false
  });

  // Fetch existing draft
  const { data: existingDraft, isLoading } = useQuery({
    queryKey: ['applicationDraft'],
    queryFn: async (): Promise<ApplicationDraft | null> => {
      const { data, error } = await supabase
        .from('application_drafts')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      if (!data) return null;
      
      // Cast the Json types to our custom types
      return {
        ...data,
        form_data: data.form_data as unknown as FormData,
        progress: data.progress as unknown as FormProgress
      } as ApplicationDraft;
    },
  });

  // Load existing draft data
  useEffect(() => {
    if (existingDraft) {
      setFormData(existingDraft.form_data);
      setProgress(existingDraft.progress);
    }
  }, [existingDraft]);

  // Calculate progress based on form data
  const calculateProgress = useCallback((data: FormData): FormProgress => {
    const studentInfo = !!(data.studentName && data.dateOfBirth && data.grade);
    const parentInfo = !!(data.parentName && data.parentPhone && data.parentEmail && data.address);
    const additionalInfo = !!(data.emergencyContact && data.emergencyPhone);
    
    return { studentInfo, parentInfo, additionalInfo };
  }, []);

  // Auto-save mutation
  const saveDraftMutation = useMutation({
    mutationFn: async ({ formData, progress }: { formData: FormData; progress: FormProgress }) => {
      if (existingDraft) {
        // Update existing draft
        const { data, error } = await supabase
          .from('application_drafts')
          .update({
            form_data: formData as any,
            progress: progress as any,
            last_saved_at: new Date().toISOString()
          })
          .eq('id', existingDraft.id)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        // Create new draft
        const { data, error } = await supabase
          .from('application_drafts')
          .insert({
            form_data: formData as any,
            progress: progress as any,
            user_id: (await supabase.auth.getUser()).data.user?.id || ''
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicationDraft'] });
    },
    onError: (error) => {
      console.error('Error saving draft:', error);
      toast({
        title: "Save Error",
        description: "Failed to save draft. Your changes may be lost.",
        variant: "destructive"
      });
    }
  });

  // Auto-save function
  const autoSave = useCallback((newFormData: FormData) => {
    const newProgress = calculateProgress(newFormData);
    setProgress(newProgress);
    
    // Debounced save (save after 2 seconds of no changes)
    const timeoutId = setTimeout(() => {
      saveDraftMutation.mutate({ formData: newFormData, progress: newProgress });
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [calculateProgress, saveDraftMutation]);

  // Manual save function
  const saveDraft = useCallback(() => {
    const newProgress = calculateProgress(formData);
    setProgress(newProgress);
    saveDraftMutation.mutate({ formData, progress: newProgress });
    
    toast({
      title: "Draft Saved",
      description: "Your application progress has been saved.",
    });
  }, [formData, calculateProgress, saveDraftMutation, toast]);

  // Delete draft function
  const deleteDraft = useMutation({
    mutationFn: async () => {
      if (existingDraft) {
        const { error } = await supabase
          .from('application_drafts')
          .delete()
          .eq('id', existingDraft.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicationDraft'] });
      setFormData({
        studentName: "",
        dateOfBirth: "",
        grade: "",
        gender: "",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        address: "",
        previousSchool: "",
        specialNeeds: "",
        hasAllergies: false,
        allergyDetails: "",
        emergencyContact: "",
        emergencyPhone: "",
        additionalInfo: ""
      });
      setProgress({
        studentInfo: false,
        parentInfo: false,
        additionalInfo: false
      });
    }
  });

  const getProgressPercentage = () => {
    const completed = Object.values(progress).filter(Boolean).length;
    return Math.round((completed / 3) * 100);
  };

  const getCompletedSteps = () => {
    return Object.values(progress).filter(Boolean).length;
  };

  const getTotalSteps = () => {
    return Object.keys(progress).length;
  };

  return {
    formData,
    setFormData,
    progress,
    autoSave,
    saveDraft,
    deleteDraft: deleteDraft.mutate,
    isLoading,
    isSaving: saveDraftMutation.isPending,
    lastSaved: existingDraft?.last_saved_at,
    getProgressPercentage,
    getCompletedSteps,
    getTotalSteps,
    hasExistingDraft: !!existingDraft
  };
};