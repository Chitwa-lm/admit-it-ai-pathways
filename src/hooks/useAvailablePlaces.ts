

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AvailablePlace } from '@/types/database';

export const useAvailablePlaces = () => {
  return useQuery({
    queryKey: ['available-places'],
    queryFn: async (): Promise<AvailablePlace[]> => {
      console.log('Fetching available places from database...');
      const { data, error } = await supabase
        .from('available_places')
        .select(`
          *,
          schools (
            id,
            name,
            school_type,
            town,
            province,
            description,
            phone,
            email,
            address
          )
        `)
        .order('application_deadline');
      
      if (error) {
        console.error('Error fetching available places:', error);
        throw error;
      }
      
      console.log('Available places fetched successfully:', data?.length || 0);
      return data || [];
    },
  });
};

