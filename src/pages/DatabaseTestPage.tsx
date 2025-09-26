import React from 'react';
import DatabaseTest from '@/components/DatabaseTest';
import PageHeader from '@/components/ui/PageHeader';

const DatabaseTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <PageHeader
          title="Database Setup Test"
          description="Verify that your Supabase database is properly configured for the Admissions Management System"
          backTo="/"
          backLabel="Back to Home"
        />
        
        <div className="mt-8">
          <DatabaseTest />
        </div>
      </div>
    </div>
  );
};

export default DatabaseTestPage;