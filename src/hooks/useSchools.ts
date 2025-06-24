
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { School } from '@/types/database';

export const useSchools = () => {
  return useQuery({
    queryKey: ['schools'],
    queryFn: async (): Promise<School[]> => {
      console.log('Fetching schools from database...');
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching schools:', error);
        throw error;
      }
      
      console.log('Schools fetched successfully:', data?.length || 0);
      return data || [];
    },
  });
};
