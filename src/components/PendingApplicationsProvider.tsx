import React from 'react';
import PendingApplicationDialog from './PendingApplicationDialog';
import { usePendingApplications } from '@/hooks/usePendingApplications';

interface PendingApplicationsProviderProps {
  children: React.ReactNode;
  checkOnMount?: boolean;
}

const PendingApplicationsProvider: React.FC<PendingApplicationsProviderProps> = ({
  children,
  checkOnMount = false,
}) => {
  const {
    pendingApplications,
    showPendingDialog,
    handleContinueApplication,
    handleStartNewApplication,
    handleDiscardApplication,
    handleClosePendingDialog,
  } = usePendingApplications();

  React.useEffect(() => {
    if (checkOnMount && pendingApplications.length > 0) {
      // Reset the session storage flag to show dialog
      sessionStorage.removeItem('pendingApplicationsShown');
    }
  }, [checkOnMount, pendingApplications]);

  return (
    <>
      {children}
      <PendingApplicationDialog
        isOpen={showPendingDialog}
        onClose={handleClosePendingDialog}
        pendingApplications={pendingApplications}
        onContinueApplication={handleContinueApplication}
        onStartNewApplication={handleStartNewApplication}
        onDiscardApplication={handleDiscardApplication}
      />
    </>
  );
};

export default PendingApplicationsProvider;