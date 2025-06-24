
-- Create enum types for better data consistency
CREATE TYPE school_type AS ENUM ('Public', 'Private', 'Charter');
CREATE TYPE application_status AS ENUM ('pending', 'under_review', 'enrolled', 'waitlisted', 'rejected');
CREATE TYPE grade_level AS ENUM ('Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade');
CREATE TYPE document_type AS ENUM ('birth_certificate', 'immunization_records', 'transcripts', 'proof_of_residence', 'other');

-- Create schools table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  school_type school_type NOT NULL,
  location TEXT NOT NULL,
  district TEXT,
  description TEXT,
  website_url TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create available places table
CREATE TABLE public.available_places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  grade grade_level NOT NULL,
  available_spots INTEGER NOT NULL DEFAULT 0,
  total_spots INTEGER NOT NULL DEFAULT 0,
  application_deadline DATE NOT NULL,
  academic_year TEXT NOT NULL DEFAULT '2024-2025',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(school_id, grade, academic_year)
);

-- Create user profiles table for extended user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT DEFAULT 'California',
  zip_code TEXT,
  role TEXT DEFAULT 'parent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  grade grade_level NOT NULL,
  current_school TEXT,
  special_needs TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
  available_place_id UUID REFERENCES public.available_places(id) ON DELETE CASCADE NOT NULL,
  status application_status DEFAULT 'pending',
  submitted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  academic_readiness_score DECIMAL(3,1),
  social_skills_score DECIMAL(3,1),
  parent_engagement_score DECIMAL(3,1),
  learning_potential_score DECIMAL(3,1),
  overall_score DECIMAL(3,1),
  admin_notes TEXT,
  parent_notes TEXT,
  priority_number INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, school_id, available_place_id)
);

-- Create documents table for file uploads
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  document_type document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  is_required BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.profiles(id)
);

-- Create application timeline/history table
CREATE TABLE public.application_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  status application_status NOT NULL,
  changed_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.available_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for schools and available places (public read access)
CREATE POLICY "Schools are viewable by everyone" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Available places are viewable by everyone" ON public.available_places FOR SELECT USING (true);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for students
CREATE POLICY "Parents can view their own students" ON public.students FOR SELECT USING (parent_id = auth.uid());
CREATE POLICY "Parents can insert their own students" ON public.students FOR INSERT WITH CHECK (parent_id = auth.uid());
CREATE POLICY "Parents can update their own students" ON public.students FOR UPDATE USING (parent_id = auth.uid());
CREATE POLICY "Parents can delete their own students" ON public.students FOR DELETE USING (parent_id = auth.uid());

-- RLS Policies for applications
CREATE POLICY "Parents can view applications for their students" ON public.applications FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
);
CREATE POLICY "Parents can insert applications for their students" ON public.applications FOR INSERT WITH CHECK (
  student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
);
CREATE POLICY "Parents can update applications for their students" ON public.applications FOR UPDATE USING (
  student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
);

-- RLS Policies for documents
CREATE POLICY "Parents can view documents for their applications" ON public.documents FOR SELECT USING (
  application_id IN (
    SELECT a.id FROM public.applications a 
    JOIN public.students s ON a.student_id = s.id 
    WHERE s.parent_id = auth.uid()
  )
);
CREATE POLICY "Parents can insert documents for their applications" ON public.documents FOR INSERT WITH CHECK (
  application_id IN (
    SELECT a.id FROM public.applications a 
    JOIN public.students s ON a.student_id = s.id 
    WHERE s.parent_id = auth.uid()
  )
);

-- RLS Policies for application history
CREATE POLICY "Parents can view history for their applications" ON public.application_history FOR SELECT USING (
  application_id IN (
    SELECT a.id FROM public.applications a 
    JOIN public.students s ON a.student_id = s.id 
    WHERE s.parent_id = auth.uid()
  )
);

-- Insert sample schools data
INSERT INTO public.schools (name, school_type, location, district, description, phone, email, address) VALUES
('Lincoln Elementary School', 'Public', 'Downtown District', 'Metro Public Schools', 'A vibrant elementary school focused on academic excellence and character development with small class sizes and dedicated teachers.', '(555) 123-4567', 'info@lincolnelem.edu', '123 Main Street, Downtown, CA 90210'),
('Washington Middle School', 'Public', 'North District', 'Metro Public Schools', 'Preparing students for high school success with innovative STEM programs, arts integration, and comprehensive support services.', '(555) 234-5678', 'contact@washingtonmiddle.edu', '456 Oak Avenue, North Hills, CA 90211'),
('Roosevelt High School', 'Public', 'East District', 'Metro Public Schools', 'Comprehensive high school offering college prep, AP courses, career pathways, and extensive extracurricular activities.', '(555) 345-6789', 'admin@roosevelthigh.edu', '789 Pine Boulevard, Eastside, CA 90212'),
('St. Marys Academy', 'Private', 'Central District', 'Independent', 'Catholic school providing faith-based education in a nurturing environment with strong academic standards and community service focus.', '(555) 456-7890', 'office@stmarysacademy.edu', '321 Church Lane, Central, CA 90213'),
('Innovation Charter School', 'Charter', 'West District', 'Charter Network', 'STEM-focused charter school with project-based learning, technology integration, and partnerships with local tech companies.', '(555) 567-8901', 'hello@innovationcharter.edu', '654 Tech Drive, West Valley, CA 90214'),
('Riverside Elementary', 'Public', 'South District', 'Metro Public Schools', 'Community-centered elementary school with dual-language programs and strong parent involvement opportunities.', '(555) 678-9012', 'info@riversideelem.edu', '987 River Road, Riverside, CA 90215'),
('Valley Prep High School', 'Private', 'North District', 'Independent', 'College preparatory school with advanced placement courses, small class sizes, and personalized learning approaches.', '(555) 789-0123', 'admissions@valleyprep.edu', '147 Valley View Drive, North Valley, CA 90216');

-- Insert sample available places with realistic data
INSERT INTO public.available_places (school_id, grade, available_spots, total_spots, application_deadline, academic_year) VALUES
-- Lincoln Elementary
((SELECT id FROM public.schools WHERE name = 'Lincoln Elementary School'), 'Kindergarten', 25, 50, '2024-03-15', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Lincoln Elementary School'), '1st Grade', 15, 45, '2024-03-15', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Lincoln Elementary School'), '2nd Grade', 8, 40, '2024-03-15', '2024-2025'),
-- Washington Middle School
((SELECT id FROM public.schools WHERE name = 'Washington Middle School'), '6th Grade', 18, 60, '2024-02-28', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Washington Middle School'), '7th Grade', 12, 55, '2024-02-28', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Washington Middle School'), '8th Grade', 6, 50, '2024-02-28', '2024-2025'),
-- Roosevelt High School
((SELECT id FROM public.schools WHERE name = 'Roosevelt High School'), '9th Grade', 32, 80, '2024-04-01', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Roosevelt High School'), '10th Grade', 20, 75, '2024-04-01', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Roosevelt High School'), '11th Grade', 15, 70, '2024-04-01', '2024-2025'),
-- St. Marys Academy
((SELECT id FROM public.schools WHERE name = 'St. Marys Academy'), 'Kindergarten', 12, 25, '2024-03-01', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'St. Marys Academy'), '3rd Grade', 8, 22, '2024-03-01', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'St. Marys Academy'), '6th Grade', 10, 28, '2024-03-01', '2024-2025'),
-- Innovation Charter School
((SELECT id FROM public.schools WHERE name = 'Innovation Charter School'), '7th Grade', 8, 30, '2024-03-20', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Innovation Charter School'), '8th Grade', 5, 25, '2024-03-20', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Innovation Charter School'), '9th Grade', 15, 35, '2024-03-20', '2024-2025'),
-- Riverside Elementary
((SELECT id FROM public.schools WHERE name = 'Riverside Elementary'), 'Kindergarten', 20, 40, '2024-03-10', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Riverside Elementary'), '4th Grade', 10, 35, '2024-03-10', '2024-2025'),
-- Valley Prep High School
((SELECT id FROM public.schools WHERE name = 'Valley Prep High School'), '9th Grade', 18, 30, '2024-02-15', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Valley Prep High School'), '10th Grade', 12, 28, '2024-02-15', '2024-2025');

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to calculate overall application score
CREATE OR REPLACE FUNCTION public.calculate_overall_score()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.academic_readiness_score IS NOT NULL AND 
     NEW.social_skills_score IS NOT NULL AND 
     NEW.parent_engagement_score IS NOT NULL AND 
     NEW.learning_potential_score IS NOT NULL THEN
    NEW.overall_score := ROUND(
      (NEW.academic_readiness_score + NEW.social_skills_score + 
       NEW.parent_engagement_score + NEW.learning_potential_score) / 4.0, 1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-calculate overall score
CREATE TRIGGER calculate_application_score
  BEFORE INSERT OR UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.calculate_overall_score();

-- Create function to log application status changes
CREATE OR REPLACE FUNCTION public.log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.application_history (application_id, status, notes)
    VALUES (NEW.id, NEW.status, 'Status changed from ' || COALESCE(OLD.status::text, 'new') || ' to ' || NEW.status::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to log status changes
CREATE TRIGGER log_status_changes
  AFTER UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.log_application_status_change();

-- Create indexes for better performance
CREATE INDEX idx_students_parent_id ON public.students(parent_id);
CREATE INDEX idx_applications_student_id ON public.applications(student_id);
CREATE INDEX idx_applications_school_id ON public.applications(school_id);
CREATE INDEX idx_applications_status ON public.applications(status);
CREATE INDEX idx_documents_application_id ON public.documents(application_id);
CREATE INDEX idx_available_places_school_grade ON public.available_places(school_id, grade);
CREATE INDEX idx_application_history_application_id ON public.application_history(application_id);
