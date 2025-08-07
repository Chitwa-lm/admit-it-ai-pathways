import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { AvailablePlace } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export const useAvailablePlacesAdmin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const availablePlacesQuery = useQuery({
    queryKey: ['available-places-admin'],
    queryFn: async (): Promise<AvailablePlace[]> => {
      const { data, error } = await supabase
        .from('available_places')
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
        .order('school_id', { ascending: true })
        .order('grade', { ascending: true });
      
      if (error) {
        console.error('Error fetching available places:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const updateAvailablePlace = useMutation({
    mutationFn: async (data: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('available_places')
        .update(data.updates)
        .eq('id', data.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-places-admin'] });
      queryClient.invalidateQueries({ queryKey: ['available-places'] });
      toast({
        title: "Success",
        description: "Available place updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update available place",
        variant: "destructive",
      });
      console.error('Error updating available place:', error);
    },
  });

  const addAvailablePlace = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase
        .from('available_places')
        .insert(data);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['available-places-admin'] });
      queryClient.invalidateQueries({ queryKey: ['available-places'] });
      toast({
        title: "Success",
        description: "Available place added successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add available place",
        variant: "destructive",
      });
      console.error('Error adding available place:', error);
    },
  });

  return {
    ...availablePlacesQuery,
    updateAvailablePlace,
    addAvailablePlace,
  };
};

export const useSchoolAvailableSlots = () => {
  return useQuery({
    queryKey: ['school-available-slots'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('available_places')
        .select(`
          school_id,
          available_spots,
          total_spots,
          schools!inner (
            id,
            name,
            school_type,
            town,
            province
          )
        `);
      
      if (error) {
        console.error('Error fetching school slots:', error);
        throw error;
      }

      // Group by school and calculate totals
      const schoolSlotsMap = data?.reduce((acc, place) => {
        const schoolId = place.school_id;
        if (!acc[schoolId]) {
          acc[schoolId] = {
            school: place.schools,
            totalAvailable: 0,
            totalCapacity: 0,
            grades: []
          };
        }
        acc[schoolId].totalAvailable += place.available_spots;
        acc[schoolId].totalCapacity += place.total_spots;
        acc[schoolId].grades.push({
          available_spots: place.available_spots,
          total_spots: place.total_spots
        });
        return acc;
      }, {} as Record<string, any>);

      return Object.values(schoolSlotsMap || {});
    },
  });
};