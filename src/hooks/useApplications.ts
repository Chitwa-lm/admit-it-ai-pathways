

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Application } from '@/types/database';

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async (): Promise<Application[]> => {
      console.log('Fetching applications from database...');
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          students (
            id,
            first_name,
            last_name,
            grade,
            current_school
          ),
          schools (
            id,
            name,
            school_type,
            town,
            province
          ),
          available_places (
            id,
            grade,
            application_deadline
          )
        `)
        .order('submitted_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
      
      console.log('Applications fetched successfully:', data?.length || 0);
      return data || [];
    },
  });
};

