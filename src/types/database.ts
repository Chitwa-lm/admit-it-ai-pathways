// Database types and interfaces for Supabase

export type SchoolType = 'government' | 'private' | 'trust_grant_aided';

export type Province = 
  | 'central' 
  | 'copperbelt' 
  | 'eastern' 
  | 'luapula' 
  | 'lusaka' 
  | 'muchinga' 
  | 'northern' 
  | 'north_western' 
  | 'southern' 
  | 'western';

export type GradeLevel = 
  | 'grade_1' | 'grade_2' | 'grade_3' | 'grade_4' | 'grade_5' | 'grade_6' | 'grade_7'
  | 'grade_8' | 'grade_9' | 'grade_10' | 'grade_11' | 'grade_12'
  | 'form_1' | 'form_2' | 'form_3' | 'form_4' | 'form_5';

export type ApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'documents_required' 
  | 'interview_scheduled' 
  | 'approved' 
  | 'rejected' 
  | 'waitlisted';

export type DocumentType = 
  | 'birth_certificate' 
  | 'grade_7_certificate' 
  | 'grade_9_certificate' 
  | 'grade_12_certificate' 
  | 'medical_report' 
  | 'passport_photo' 
  | 'parent_id' 
  | 'proof_of_residence' 
  | 'recommendation_letter' 
  | 'other';

export type UserRole = 
  | 'applicant' 
  | 'parent' 
  | 'admissions_officer' 
  | 'school_admin' 
  | 'system_admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone_number?: string;
  province?: Province;
  district?: string;
  address?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  nationality?: string;
  created_at: string;
  updated_at: string;
}

export interface School {
  id: string;
  name: string;
  type: SchoolType;
  province: Province;
  district: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  principal_name?: string;
  established_year?: number;
  description?: string;
  facilities?: string[];
  programs?: string[];
  website_url?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AvailablePlace {
  id: string;
  school_id: string;
  grade_level: GradeLevel;
  total_places: number;
  available_places: number;
  academic_year: string;
  application_deadline?: string;
  requirements?: string[];
  fees?: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  applicant_id: string;
  school_id: string;
  grade_level: GradeLevel;
  status: ApplicationStatus;
  application_data: ApplicationData;
  submitted_at?: string;
  reviewed_at?: string;
  decision_at?: string;
  decision_reason?: string;
  reviewer_id?: string;
  nlp_analysis?: NLPAnalysisResult;
  score?: number;
  created_at: string;
  updated_at: string;
}

export interface ApplicationData {
  personal_info?: PersonalInfo;
  academic_history?: AcademicRecord[];
  essays?: Essay[];
  extracurriculars?: Activity[];
  references?: Reference[];
  emergency_contact?: EmergencyContact;
  medical_info?: MedicalInfo;
}

export interface PersonalInfo {
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'male' | 'female';
  nationality: string;
  province: Province;
  district: string;
  address: string;
  parent_guardian_info: ParentGuardianInfo;
}

export interface ParentGuardianInfo {
  father_name?: string;
  father_occupation?: string;
  father_phone?: string;
  father_email?: string;
  mother_name?: string;
  mother_occupation?: string;
  mother_phone?: string;
  mother_email?: string;
  guardian_name?: string;
  guardian_relationship?: string;
  guardian_phone?: string;
  guardian_email?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address: string;
}

export interface MedicalInfo {
  allergies?: string[];
  medications?: string[];
  medical_conditions?: string[];
  doctor_name?: string;
  doctor_phone?: string;
}

export interface AcademicRecord {
  institution: string;
  grade_level: string;
  year: number;
  subjects: SubjectGrade[];
  overall_grade?: string;
  certificate_number?: string;
}

export interface SubjectGrade {
  subject: string;
  grade: string;
  points?: number;
}

export interface Essay {
  title: string;
  content: string;
  word_count: number;
}

export interface Activity {
  name: string;
  type: 'sport' | 'academic' | 'community' | 'leadership' | 'other';
  description: string;
  duration: string;
  achievements?: string[];
}

export interface Reference {
  name: string;
  title: string;
  organization: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_type: DocumentType;
  file_path: string;
  file_name: string;
  file_size?: number;
  mime_type?: string;
  uploaded_at: string;
  verified_at?: string;
  verified_by?: string;
  verification_notes?: string;
}

export interface ApplicationStatusHistory {
  id: string;
  application_id: string;
  status: ApplicationStatus;
  changed_by?: string;
  notes?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  application_id?: string;
  title: string;
  message: string;
  type: string;
  read_at?: string;
  sent_via_email: boolean;
  sent_via_sms: boolean;
  created_at: string;
}

export interface SchoolAdministrator {
  id: string;
  school_id: string;
  user_id: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  table_name: string;
  record_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface NLPAnalysisResult {
  sentiment: {
    score: number; // -1 to 1
    confidence: number;
    label: 'positive' | 'neutral' | 'negative';
  };
  key_phrases: string[];
  summary: string;
  plagiarism_score: number;
  red_flags: string[];
  quality_score: number;
  readability_score: number;
}

// Database schema type for Supabase client
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>;
      };
      schools: {
        Row: School;
        Insert: Omit<School, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<School, 'id' | 'created_at' | 'updated_at'>>;
      };
      available_places: {
        Row: AvailablePlace;
        Insert: Omit<AvailablePlace, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AvailablePlace, 'id' | 'created_at' | 'updated_at'>>;
      };
      applications: {
        Row: Application;
        Insert: Omit<Application, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Application, 'id' | 'created_at' | 'updated_at'>>;
      };
      application_documents: {
        Row: ApplicationDocument;
        Insert: Omit<ApplicationDocument, 'id' | 'uploaded_at'>;
        Update: Partial<Omit<ApplicationDocument, 'id' | 'uploaded_at'>>;
      };
      application_status_history: {
        Row: ApplicationStatusHistory;
        Insert: Omit<ApplicationStatusHistory, 'id' | 'created_at'>;
        Update: Partial<Omit<ApplicationStatusHistory, 'id' | 'created_at'>>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, 'id' | 'created_at'>;
        Update: Partial<Omit<Notification, 'id' | 'created_at'>>;
      };
      school_administrators: {
        Row: SchoolAdministrator;
        Insert: Omit<SchoolAdministrator, 'id' | 'created_at'>;
        Update: Partial<Omit<SchoolAdministrator, 'id' | 'created_at'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: Partial<Omit<AuditLog, 'id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_role: {
        Args: { user_id?: string };
        Returns: UserRole;
      };
      is_school_admin: {
        Args: { school_id: string; user_id?: string };
        Returns: boolean;
      };
      create_notification: {
        Args: {
          p_user_id: string;
          p_application_id?: string;
          p_title: string;
          p_message: string;
          p_type?: string;
        };
        Returns: string;
      };
      create_audit_log: {
        Args: {
          p_action: string;
          p_table_name: string;
          p_record_id?: string;
          p_old_values?: Record<string, any>;
          p_new_values?: Record<string, any>;
        };
        Returns: string;
      };
    };
    Enums: {
      school_type: SchoolType;
      province_enum: Province;
      grade_enum: GradeLevel;
      application_status: ApplicationStatus;
      document_type_enum: DocumentType;
      user_role: UserRole;
    };
  };
}