-- Indexes for optimal query performance

-- User profiles indexes
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_province ON user_profiles(province);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- Schools indexes
CREATE INDEX idx_schools_type ON schools(type);
CREATE INDEX idx_schools_province ON schools(province);
CREATE INDEX idx_schools_district ON schools(district);
CREATE INDEX idx_schools_type_province ON schools(type, province);

-- Available places indexes
CREATE INDEX idx_available_places_school_id ON available_places(school_id);
CREATE INDEX idx_available_places_grade_level ON available_places(grade_level);
CREATE INDEX idx_available_places_academic_year ON available_places(academic_year);
CREATE INDEX idx_available_places_deadline ON available_places(application_deadline);
CREATE INDEX idx_available_places_available ON available_places(available_places) WHERE available_places > 0;

-- Applications indexes
CREATE INDEX idx_applications_applicant_id ON applications(applicant_id);
CREATE INDEX idx_applications_school_id ON applications(school_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_grade_level ON applications(grade_level);
CREATE INDEX idx_applications_submitted_at ON applications(submitted_at);
CREATE INDEX idx_applications_reviewer_id ON applications(reviewer_id);
CREATE INDEX idx_applications_status_school ON applications(status, school_id);

-- Application documents indexes
CREATE INDEX idx_application_documents_application_id ON application_documents(application_id);
CREATE INDEX idx_application_documents_type ON application_documents(document_type);
CREATE INDEX idx_application_documents_verified ON application_documents(verified_at) WHERE verified_at IS NOT NULL;

-- Application status history indexes
CREATE INDEX idx_application_status_history_application_id ON application_status_history(application_id);
CREATE INDEX idx_application_status_history_created_at ON application_status_history(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_application_id ON notifications(application_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;

-- School administrators indexes
CREATE INDEX idx_school_administrators_school_id ON school_administrators(school_id);
CREATE INDEX idx_school_administrators_user_id ON school_administrators(user_id);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);