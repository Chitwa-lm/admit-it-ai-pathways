-- Database functions and triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schools_updated_at 
  BEFORE UPDATE ON schools 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_available_places_updated_at 
  BEFORE UPDATE ON available_places 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at 
  BEFORE UPDATE ON applications 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to log application status changes
CREATE OR REPLACE FUNCTION log_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO application_status_history (
      application_id,
      status,
      changed_by,
      notes
    ) VALUES (
      NEW.id,
      NEW.status,
      auth.uid(),
      CASE 
        WHEN NEW.decision_reason IS NOT NULL AND OLD.decision_reason IS DISTINCT FROM NEW.decision_reason 
        THEN NEW.decision_reason
        ELSE NULL
      END
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to log status changes
CREATE TRIGGER log_application_status_changes
  AFTER UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION log_application_status_change();

-- Function to update available places when application is approved
CREATE OR REPLACE FUNCTION update_available_places_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- If application status changed to approved, reduce available places
  IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
    UPDATE available_places 
    SET available_places = available_places - 1
    WHERE school_id = NEW.school_id 
    AND grade_level = NEW.grade_level
    AND available_places > 0;
  END IF;
  
  -- If application status changed from approved to something else, increase available places
  IF OLD.status = 'approved' AND NEW.status != 'approved' THEN
    UPDATE available_places 
    SET available_places = available_places + 1
    WHERE school_id = NEW.school_id 
    AND grade_level = NEW.grade_level;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update available places
CREATE TRIGGER update_places_on_approval
  AFTER UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_available_places_on_approval();

-- Function to create notification
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id UUID,
  p_application_id UUID,
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info'
)
RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, application_id, title, message, type)
  VALUES (p_user_id, p_application_id, p_title, p_message, p_type)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
  p_action TEXT,
  p_table_name TEXT,
  p_record_id UUID,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO audit_logs (
    user_id, action, table_name, record_id, old_values, new_values
  ) VALUES (
    auth.uid(), p_action, p_table_name, p_record_id, p_old_values, p_new_values
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS user_role AS $$
DECLARE
  user_role_result user_role;
BEGIN
  SELECT role INTO user_role_result
  FROM user_profiles
  WHERE id = user_id;
  
  RETURN COALESCE(user_role_result, 'applicant');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is school admin for specific school
CREATE OR REPLACE FUNCTION is_school_admin(school_id UUID, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM school_administrators sa
    JOIN user_profiles up ON sa.user_id = up.id
    WHERE sa.school_id = $1 
    AND sa.user_id = $2
    AND up.role IN ('school_admin', 'system_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;