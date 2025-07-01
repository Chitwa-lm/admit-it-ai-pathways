
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
      
      // Check if this is the super admin email in mock mode
      if (user.email === 'chitwamakupe15@gmail.com') {
        return {
          id: 'super-admin-id',
          user_id: user.id,
          role: 'super_admin',
          is_active: true,
          schools: {
            id: 'super-admin-school',
            name: 'Super Admin Dashboard',
            school_type: 'Admin',
            town: 'All Locations',
            province: 'Zambia'
          }
        };
      }
      
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
      
      // If super admin, fetch all applications
      const isSuperAdmin = user.email === 'chitwamakupe15@gmail.com';
      
      let query = supabase
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
          ),
          schools (
            id,
            name,
            school_type,
            town,
            province
          )
        `)
        .order('submitted_date', { ascending: false });

      // If not super admin, we would filter by school in a real implementation
      // For now, super admin sees all applications
      const { data, error } = await query;

      if (error) {
        console.error('Error fetching school applications:', error);
        throw error;
      }

      console.log('Applications fetched:', data?.length || 0);
      return data || [];
    },
    enabled: !!user,
  });
};
