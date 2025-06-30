
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useSchoolAdmin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['school-admin', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      console.log('Checking school admin status for user:', user.id);
      const { data: adminData, error } = await supabase
        .from('school_admins')
        .select(`
          *,
          schools (
            id,
            name,
            school_type,
            town,
            province
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching school admin data:', error);
        return null;
      }

      return adminData;
    },
    enabled: !!user,
  });
};

export const useSchoolApplications = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['school-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log('Fetching applications for school admin:', user.id);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          students (
            id,
            first_name,
            last_name,
            grade,
            date_of_birth,
            current_school
          ),
          available_places (
            id,
            grade,
            application_deadline,
            academic_year
          )
        `)
        .order('submitted_date', { ascending: false });

      if (error) {
        console.error('Error fetching school applications:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });
};
