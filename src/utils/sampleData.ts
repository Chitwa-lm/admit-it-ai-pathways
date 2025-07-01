
import { supabase } from '@/integrations/supabase/client';

export const createSampleData = async () => {
  try {
    // First, let's create some sample schools
    const { data: schools, error: schoolsError } = await supabase
      .from('schools')
      .upsert([
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Lusaka International School',
          school_type: 'Private',
          town: 'Lusaka',
          province: 'Lusaka Province',
          description: 'A premier international school offering world-class education'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440001',
          name: 'Ndola Public Primary',
          school_type: 'Public',
          town: 'Ndola',
          province: 'Copperbelt Province',
          description: 'Quality public education serving the Ndola community'
        },
        {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'Kitwe Charter Academy',
          school_type: 'Charter',
          town: 'Kitwe',
          province: 'Copperbelt Province',
          description: 'Innovative charter school with focus on STEM education'
        }
      ])
      .select();

    if (schoolsError) {
      console.error('Error creating schools:', schoolsError);
      return;
    }

    // Create available places for these schools
    const { data: places, error: placesError } = await supabase
      .from('available_places')
      .upsert([
        {
          id: '660e8400-e29b-41d4-a716-446655440000',
          school_id: '550e8400-e29b-41d4-a716-446655440000',
          grade: '1st Grade',
          total_spots: 30,
          available_spots: 25,
          application_deadline: '2025-03-15',
          academic_year: '2025-2026'
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440001',
          school_id: '550e8400-e29b-41d4-a716-446655440001',
          grade: 'Kindergarten',
          total_spots: 25,
          available_spots: 20,
          application_deadline: '2025-02-28',
          academic_year: '2025-2026'
        },
        {
          id: '660e8400-e29b-41d4-a716-446655440002',
          school_id: '550e8400-e29b-41d4-a716-446655440002',
          grade: '2nd Grade',
          total_spots: 28,
          available_spots: 23,
          application_deadline: '2025-04-01',
          academic_year: '2025-2026'
        }
      ])
      .select();

    if (placesError) {
      console.error('Error creating available places:', placesError);
      return;
    }

    // Create sample profiles (parents)
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .upsert([
        {
          id: '770e8400-e29b-41d4-a716-446655440000',
          first_name: 'John',
          last_name: 'Mwanza',
          role: 'parent'
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440001',
          first_name: 'Mary',
          last_name: 'Banda',
          role: 'parent'
        },
        {
          id: '770e8400-e29b-41d4-a716-446655440002',
          first_name: 'Peter',
          last_name: 'Chanda',
          role: 'parent'
        }
      ])
      .select();

    if (profilesError) {
      console.error('Error creating profiles:', profilesError);
      return;
    }

    // Create sample students
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .upsert([
        {
          id: '880e8400-e29b-41d4-a716-446655440000',
          parent_id: '770e8400-e29b-41d4-a716-446655440000',
          first_name: 'Sarah',
          last_name: 'Mwanza',
          date_of_birth: '2018-05-15',
          grade: '1st Grade',
          current_school: 'Little Angels Nursery'
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440001',
          parent_id: '770e8400-e29b-41d4-a716-446655440001',
          first_name: 'James',
          last_name: 'Banda',
          date_of_birth: '2019-03-22',
          grade: 'Kindergarten',
          current_school: null
        },
        {
          id: '880e8400-e29b-41d4-a716-446655440002',
          parent_id: '770e8400-e29b-41d4-a716-446655440002',
          first_name: 'Grace',
          last_name: 'Chanda',
          date_of_birth: '2017-08-10',
          grade: '2nd Grade',
          current_school: 'Sunshine Primary'
        }
      ])
      .select();

    if (studentsError) {
      console.error('Error creating students:', studentsError);
      return;
    }

    // Create sample applications
    const { data: applications, error: applicationsError } = await supabase
      .from('applications')
      .upsert([
        {
          id: '990e8400-e29b-41d4-a716-446655440000',
          student_id: '880e8400-e29b-41d4-a716-446655440000',
          school_id: '550e8400-e29b-41d4-a716-446655440000',
          available_place_id: '660e8400-e29b-41d4-a716-446655440000',
          status: 'under_review',
          submitted_date: '2025-01-15T10:30:00Z',
          academic_readiness_score: 85,
          social_skills_score: 78,
          parent_engagement_score: 92,
          learning_potential_score: 88,
          overall_score: 86,
          parent_notes: 'Sarah is very excited about starting school and loves reading.',
          admin_notes: 'Strong application with good academic foundation.'
        },
        {
          id: '990e8400-e29b-41d4-a716-446655440001',
          student_id: '880e8400-e29b-41d4-a716-446655440001',
          school_id: '550e8400-e29b-41d4-a716-446655440001',
          available_place_id: '660e8400-e29b-41d4-a716-446655440001',
          status: 'pending',
          submitted_date: '2025-01-20T14:15:00Z',
          parent_notes: 'James is very social and enjoys group activities.'
        },
        {
          id: '990e8400-e29b-41d4-a716-446655440002',
          student_id: '880e8400-e29b-41d4-a716-446655440002',
          school_id: '550e8400-e29b-41d4-a716-446655440002',
          available_place_id: '660e8400-e29b-41d4-a716-446655440002',
          status: 'enrolled',
          submitted_date: '2025-01-10T09:45:00Z',
          academic_readiness_score: 90,
          social_skills_score: 85,
          parent_engagement_score: 95,
          learning_potential_score: 92,
          overall_score: 91,
          parent_notes: 'Grace has been homeschooled and is ready for a structured environment.',
          admin_notes: 'Excellent application. Student enrolled.'
        }
      ])
      .select();

    if (applicationsError) {
      console.error('Error creating applications:', applicationsError);
      return;
    }

    // Create the super admin record for chitwamakupe15@gmail.com
    const { data: adminData, error: adminError } = await supabase
      .from('school_admins')
      .upsert([
        {
          id: 'c7a6b1e4-2d8f-4c3a-9b5e-1f2a3c4d5e6f',
          user_id: 'c7a6b1e4-2d8f-4c3a-9b5e-1f2a3c4d5e6f',
          school_id: '550e8400-e29b-41d4-a716-446655440000', // Link to first school for consistency
          role: 'super_admin',
          is_active: true
        }
      ])
      .select();

    if (adminError) {
      console.error('Error creating admin record:', adminError);
    }

    console.log('Sample data created successfully!', {
      schools: schools?.length,
      places: places?.length,
      profiles: profiles?.length,
      students: students?.length,
      applications: applications?.length
    });

  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};
