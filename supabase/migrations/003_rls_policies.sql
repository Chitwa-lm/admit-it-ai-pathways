-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_places ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_administrators ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('system_admin', 'school_admin', 'admissions_officer')
    )
  );

-- Schools policies
CREATE POLICY "Anyone can view schools" ON schools
  FOR SELECT USING (true);

CREATE POLICY "School admins can update their schools" ON schools
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM school_administrators sa
      JOIN user_profiles up ON sa.user_id = up.id
      WHERE sa.school_id = schools.id 
      AND sa.user_id = auth.uid()
      AND up.role IN ('school_admin', 'system_admin')
    )
  );

CREATE POLICY "System admins can manage all schools" ON schools
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'system_admin'
    )
  );

-- Available places policies
CREATE POLICY "Anyone can view available places" ON available_places
  FOR SELECT USING (true);

CREATE POLICY "School admins can manage their school places" ON available_places
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM school_administrators sa
      JOIN user_profiles up ON sa.user_id = up.id
      WHERE sa.school_id = available_places.school_id 
      AND sa.user_id = auth.uid()
      AND up.role IN ('school_admin', 'system_admin')
    )
  );

-- Applications policies
CREATE POLICY "Users can view their own applications" ON applications
  FOR SELECT USING (auth.uid() = applicant_id);

CREATE POLICY "Users can create their own applications" ON applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

CREATE POLICY "Users can update their own draft applications" ON applications
  FOR UPDATE USING (
    auth.uid() = applicant_id 
    AND status = 'draft'
  );

CREATE POLICY "Admissions officers can view applications for their schools" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM school_administrators sa
      JOIN user_profiles up ON sa.user_id = up.id
      WHERE sa.school_id = applications.school_id 
      AND sa.user_id = auth.uid()
      AND up.role IN ('admissions_officer', 'school_admin', 'system_admin')
    )
  );

CREATE POLICY "Admissions officers can update applications for their schools" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM school_administrators sa
      JOIN user_profiles up ON sa.user_id = up.id
      WHERE sa.school_id = applications.school_id 
      AND sa.user_id = auth.uid()
      AND up.role IN ('admissions_officer', 'school_admin', 'system_admin')
    )
  );

-- Application documents policies
CREATE POLICY "Users can view documents for their applications" ON application_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE id = application_documents.application_id 
      AND applicant_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload documents for their applications" ON application_documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE id = application_documents.application_id 
      AND applicant_id = auth.uid()
    )
  );

CREATE POLICY "Admissions officers can view documents for their school applications" ON application_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN school_administrators sa ON sa.school_id = a.school_id
      JOIN user_profiles up ON sa.user_id = up.id
      WHERE a.id = application_documents.application_id 
      AND sa.user_id = auth.uid()
      AND up.role IN ('admissions_officer', 'school_admin', 'system_admin')
    )
  );

-- Application status history policies
CREATE POLICY "Users can view status history for their applications" ON application_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM applications 
      WHERE id = application_status_history.application_id 
      AND applicant_id = auth.uid()
    )
  );

CREATE POLICY "Admissions officers can view and create status history" ON application_status_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM applications a
      JOIN school_administrators sa ON sa.school_id = a.school_id
      JOIN user_profiles up ON sa.user_id = up.id
      WHERE a.id = application_status_history.application_id 
      AND sa.user_id = auth.uid()
      AND up.role IN ('admissions_officer', 'school_admin', 'system_admin')
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can mark their notifications as read" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- School administrators policies
CREATE POLICY "School admins can view their school assignments" ON school_administrators
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'system_admin'
    )
  );

CREATE POLICY "System admins can manage school assignments" ON school_administrators
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'system_admin'
    )
  );

-- Audit logs policies
CREATE POLICY "System admins can view audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'system_admin'
    )
  );

CREATE POLICY "System can create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (true);