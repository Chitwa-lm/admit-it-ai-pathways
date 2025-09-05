import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ApplicationFormData {
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

export interface ApplicationProgress {
  studentInfo: boolean;
  parentInfo: boolean;
  additionalInfo: boolean;
  completionPercentage: number;
}

const initialFormData: ApplicationFormData = {
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
};

export const useApplicationDraft = () => {
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormData);
  const [progress, setProgress] = useState<ApplicationProgress>({
    studentInfo: false,
    parentInfo: false,
    additionalInfo: false,
    completionPercentage: 0
  });
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Calculate progress based on form data
  const calculateProgress = useCallback((data: ApplicationFormData): ApplicationProgress => {
    const studentInfo = !!(data.studentName && data.dateOfBirth && data.grade);
    const parentInfo = !!(data.parentName && data.parentPhone && data.parentEmail && data.address);
    const additionalInfo = !!(data.emergencyContact && data.emergencyPhone);
    
    const completedSections = [studentInfo, parentInfo, additionalInfo].filter(Boolean).length;
    const completionPercentage = Math.round((completedSections / 3) * 100);

    return {
      studentInfo,
      parentInfo,
      additionalInfo,
      completionPercentage
    };
  }, []);

  // Load existing draft
  const loadDraft = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('application_drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('last_saved_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading draft:', error);
        setIsLoading(false);
        return;
      }

      if (data) {
        setDraftId(data.id);
        setFormData(data.form_data as unknown as ApplicationFormData);
        setProgress(data.progress as unknown as ApplicationProgress);
        
        if ((data.progress as any)?.completionPercentage > 0) {
          toast({
            title: "Draft Loaded",
            description: `Continuing from ${(data.progress as any).completionPercentage}% completion`,
          });
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Save draft
  const saveDraft = useCallback(async (data: ApplicationFormData) => {
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const newProgress = calculateProgress(data);
      
      const draftData = {
        user_id: user.id,
        form_data: data as any,
        progress: newProgress as any,
        last_saved_at: new Date().toISOString()
      };

      if (draftId) {
        // Update existing draft
        const { error } = await supabase
          .from('application_drafts')
          .update(draftData)
          .eq('id', draftId);

        if (error) {
          console.error('Error updating draft:', error);
          return;
        }
      } else {
        // Create new draft
        const { data: newDraft, error } = await supabase
          .from('application_drafts')
          .insert(draftData)
          .select()
          .single();

        if (error) {
          console.error('Error creating draft:', error);
          return;
        }

        setDraftId(newDraft.id);
      }

      setProgress(newProgress);
      
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  }, [draftId, calculateProgress]);

  // Update form data and trigger auto-save
  const updateFormData = useCallback((field: string, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    
    // Auto-save after a short delay
    const timeoutId = setTimeout(() => {
      saveDraft(newData);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData, saveDraft]);

  // Manual save
  const saveNow = useCallback(async () => {
    await saveDraft(formData);
    toast({
      title: "Draft Saved",
      description: "Your progress has been saved successfully",
    });
  }, [formData, saveDraft, toast]);

  // Delete draft
  const deleteDraft = useCallback(async () => {
    if (!draftId) return;

    try {
      const { error } = await supabase
        .from('application_drafts')
        .delete()
        .eq('id', draftId);

      if (error) {
        console.error('Error deleting draft:', error);
        return;
      }

      setDraftId(null);
      setFormData(initialFormData);
      setProgress({
        studentInfo: false,
        parentInfo: false,
        additionalInfo: false,
        completionPercentage: 0
      });
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  }, [draftId]);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  return {
    formData,
    progress,
    isLoading,
    isSaving,
    updateFormData,
    saveNow,
    deleteDraft,
    hasDraft: !!draftId
  };
};