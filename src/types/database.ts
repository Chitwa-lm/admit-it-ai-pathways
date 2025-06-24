
export interface School {
  id: string;
  name: string;
  school_type: 'Public' | 'Private' | 'Charter';
  location: string;
  district: string | null;
  description: string | null;
  website_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface AvailablePlace {
  id: string;
  school_id: string;
  grade: string;
  available_spots: number;
  total_spots: number;
  application_deadline: string;
  academic_year: string;
  created_at: string;
  updated_at: string;
  schools?: School;
}

export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  parent_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  grade: string;
  current_school: string | null;
  special_needs: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  medical_conditions: string | null;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  student_id: string;
  school_id: string;
  available_place_id: string;
  status: 'pending' | 'under_review' | 'enrolled' | 'waitlisted' | 'rejected';
  submitted_date: string;
  academic_readiness_score: number | null;
  social_skills_score: number | null;
  parent_engagement_score: number | null;
  learning_potential_score: number | null;
  overall_score: number | null;
  admin_notes: string | null;
  parent_notes: string | null;
  priority_number: number | null;
  created_at: string;
  updated_at: string;
  students?: Student;
  schools?: School;
  available_places?: AvailablePlace;
}
