
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useStats = () => {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      console.log('Fetching dashboard statistics...');
      
      // Get application counts by status
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('status');
      
      if (appsError) {
        console.error('Error fetching applications:', appsError);
        throw appsError;
      }

      // Get total students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id');
      
      if (studentsError) {
        console.error('Error fetching students:', studentsError);
        throw studentsError;
      }

      // Get total available spots
      const { data: places, error: placesError } = await supabase
        .from('available_places')
        .select('available_spots');
      
      if (placesError) {
        console.error('Error fetching available places:', placesError);
        throw placesError;
      }

      // Calculate stats
      const newApplications = applications?.filter(app => app.status === 'pending').length || 0;
      const underReview = applications?.filter(app => app.status === 'under_review').length || 0;
      const enrolled = applications?.filter(app => app.status === 'enrolled').length || 0;
      const totalStudents = students?.length || 0;
      const totalAvailableSpots = places?.reduce((sum, place) => sum + place.available_spots, 0) || 0;

      console.log('Stats calculated successfully');
      
      return {
        newApplications,
        underReview,
        enrolled,
        totalStudents,
        totalAvailableSpots
      };
    },
  });
};
