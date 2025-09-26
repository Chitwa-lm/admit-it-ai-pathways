-- Initial schema for Zambian Admissions Management System

-- Create custom types/enums
CREATE TYPE school_type AS ENUM ('government', 'private', 'trust_grant_aided');

CREATE TYPE province_enum AS ENUM (
  'central', 'copperbelt', 'eastern', 'luapula', 'lusaka', 
  'muchinga', 'northern', 'north_western', 'southern', 'western'
);

CREATE TYPE grade_enum AS ENUM (
  'grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6', 'grade_7',
  'grade_8', 'grade_9', 'grade_10', 'grade_11', 'grade_12',
  'form_1', 'form_2', 'form_3', 'form_4', 'form_5'
);

CREATE TYPE application_status AS ENUM (
  'draft', 'submitted', 'under_review', 'documents_required', 
  'interview_scheduled', 'approved', 'rejected', 'waitlisted'
);

CREATE TYPE document_type_enum AS ENUM (
  'birth_certificate', 'grade_7_certificate', 'grade_9_certificate', 
  'grade_12_certificate', 'medical_report', 'passport_photo', 
  'parent_id', 'proof_of_residence', 'recommendation_letter', 'other'
);

CREATE TYPE user_role AS ENUM (
  'applicant', 'parent', 'admissions_officer', 'school_admin', 'system_admin'
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR NOT NULL,
  role user_role NOT NULL DEFAULT 'applicant',
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  phone_number VARCHAR,
  province province_enum,
  district VARCHAR,
  address TEXT,
  date_of_birth DATE,
  gender VARCHAR CHECK (gender IN ('male', 'female')),
  nationality VARCHAR DEFAULT 'Zambian',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schools table
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  type school_type NOT NULL,
  province province_enum NOT NULL,
  district VARCHAR NOT NULL,
  address TEXT,
  contact_email VARCHAR,
  contact_phone VARCHAR,
  principal_name VARCHAR,
  established_year INTEGER,
  description TEXT,
  facilities TEXT[],
  programs TEXT[],
  website_url VARCHAR,
  logo_url VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Available places table
CREATE TABLE available_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  grade_level grade_enum NOT NULL,
  total_places INTEGER NOT NULL CHECK (total_places >= 0),
  available_places INTEGER NOT NULL CHECK (available_places >= 0),
  academic_year VARCHAR NOT NULL,
  application_deadline DATE,
  requirements TEXT[],
  fees DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, grade_level, academic_year)
);

-- Applications table
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  grade_level grade_enum NOT NULL,
  status application_status DEFAULT 'draft',
  application_data JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMP WITH TIME ZONE,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  decision_at TIMESTAMP WITH TIME ZONE,
  decision_reason TEXT,
  reviewer_id UUID REFERENCES auth.users(id),
  nlp_analysis JSONB,
  score INTEGER CHECK (score >= 0 AND score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application documents table
CREATE TABLE application_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  document_type document_type_enum NOT NULL,
  file_path VARCHAR NOT NULL,
  file_name VARCHAR NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  verification_notes TEXT
);

-- Application status history table
CREATE TABLE application_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  status application_status NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR NOT NULL DEFAULT 'info',
  read_at TIMESTAMP WITH TIME ZONE,
  sent_via_email BOOLEAN DEFAULT FALSE,
  sent_via_sms BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- School administrators table (many-to-many relationship)
CREATE TABLE school_administrators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, user_id)
);

-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR NOT NULL,
  table_name VARCHAR NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);