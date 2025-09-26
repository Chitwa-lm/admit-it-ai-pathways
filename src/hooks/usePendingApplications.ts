import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { Application } from '@/types/database';
import { toast } from 'sonner';

export const usePendingApplications = () => {
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const queryClient = useQueryClient();

  // Query to fetch pending applications
  const {
    data: pendingApplications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pendingApplications'],
    queryFn: async () => {
      const user = await getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          schools (
            id,
            name,
            type,
            province,
            district
          )
        `)
        .eq('applicant_id', user.id)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data as Application[];
    },
    enabled: true,
  });

  // Mutation to discard an application
  const discardApplicationMutation = useMutation({
    mutationFn: async (applicationId: string) => {
      // First delete associated documents
      const { error: documentsError } = await supabase
        .from('application_documents')
        .delete()
        .eq('application_id', applicationId);

      if (documentsError) throw documentsError;

      // Then delete the application
      const { error: applicationError } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (applicationError) throw applicationError;

      return applicationId;
    },
    onSuccess: (applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['pendingApplications'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application discarded successfully');
    },
    onError: (error) => {
      console.error('Error discarding application:', error);
      toast.error('Failed to discard application. Please try again.');
    },
  });

  // Check for pending applications when component mounts
  useEffect(() => {
    if (pendingApplications.length > 0 && !showPendingDialog) {
      // Only show dialog if we haven't shown it in this session
      const hasShownDialog = sessionStorage.getItem('pendingApplicationsShown');
      if (!hasShownDialog) {
        setShowPendingDialog(true);
        sessionStorage.setItem('pendingApplicationsShown', 'true');
      }
    }
  }, [pendingApplications, showPendingDialog]);

  const handleContinueApplication = (applicationId: string) => {
    setShowPendingDialog(false);
    // Navigate to application form with the specific application ID
    window.location.href = `/application?continue=${applicationId}`;
  };

  const handleStartNewApplication = () => {
    setShowPendingDialog(false);
    // Clear any existing draft and start fresh
    sessionStorage.removeItem('applicationDraft');
    window.location.href = '/application';
  };

  const handleDiscardApplication = (applicationId: string) => {
    discardApplicationMutation.mutate(applicationId);
  };

  const handleClosePendingDialog = () => {
    setShowPendingDialog(false);
  };

  // Function to manually trigger the pending applications check
  const checkPendingApplications = () => {
    if (pendingApplications.length > 0) {
      setShowPendingDialog(true);
    }
  };

  return {
    pendingApplications,
    isLoading,
    error,
    showPendingDialog,
    handleContinueApplication,
    handleStartNewApplication,
    handleDiscardApplication,
    handleClosePendingDialog,
    checkPendingApplications,
    isDiscarding: discardApplicationMutation.isPending,
  };
};

// Hook to check for pending applications on specific pages
export const useCheckPendingApplications = (shouldCheck: boolean = true) => {
  const {
    pendingApplications,
    showPendingDialog,
    handleContinueApplication,
    handleStartNewApplication,
    handleDiscardApplication,
    handleClosePendingDialog,
  } = usePendingApplications();

  useEffect(() => {
    if (shouldCheck && pendingApplications.length > 0) {
      // Check if user is trying to start a new application
      const currentPath = window.location.pathname;
      const isApplicationPage = currentPath === '/application';
      const hasShownDialog = sessionStorage.getItem('pendingApplicationsShown');
      
      if (isApplicationPage && !hasShownDialog) {
        // Show dialog when user tries to access application page with pending applications
        sessionStorage.setItem('pendingApplicationsShown', 'true');
      }
    }
  }, [shouldCheck, pendingApplications]);

  return {
    pendingApplications,
    showPendingDialog,
    handleContinueApplication,
    handleStartNewApplication,
    handleDiscardApplication,
    handleClosePendingDialog,
  };
};