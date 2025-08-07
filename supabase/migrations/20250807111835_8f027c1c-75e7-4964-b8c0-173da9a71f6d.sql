-- Create trigger function to update available spots when application status changes
CREATE OR REPLACE FUNCTION update_available_spots_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If application is being enrolled (new status is 'enrolled' and old status is not 'enrolled')
  IF NEW.status = 'enrolled' AND (OLD.status IS NULL OR OLD.status != 'enrolled') THEN
    UPDATE available_places 
    SET available_spots = available_spots - 1
    WHERE id = NEW.available_place_id 
    AND available_spots > 0;
  END IF;
  
  -- If application was enrolled but is no longer enrolled (old status was 'enrolled' and new status is not 'enrolled')
  IF OLD.status = 'enrolled' AND NEW.status != 'enrolled' THEN
    UPDATE available_places 
    SET available_spots = available_spots + 1
    WHERE id = NEW.available_place_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on applications table
CREATE TRIGGER trigger_update_available_spots
  AFTER UPDATE OF status ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_available_spots_on_status_change();

-- Also handle inserts in case applications are created with 'enrolled' status
CREATE OR REPLACE FUNCTION update_available_spots_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- If application is created with 'enrolled' status
  IF NEW.status = 'enrolled' THEN
    UPDATE available_places 
    SET available_spots = available_spots - 1
    WHERE id = NEW.available_place_id 
    AND available_spots > 0;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inserts
CREATE TRIGGER trigger_update_available_spots_insert
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_available_spots_on_insert();

-- Update RLS policies for available_places to allow school admins to manage them
CREATE POLICY "School admins can update available places for their school"
ON available_places
FOR UPDATE
USING (school_id = get_admin_school_id(auth.uid()));

CREATE POLICY "School admins can insert available places for their school"
ON available_places
FOR INSERT
WITH CHECK (school_id = get_admin_school_id(auth.uid()));

CREATE POLICY "Super admins can manage all available places"
ON available_places
FOR ALL
USING (EXISTS (
  SELECT 1 FROM school_admins sa
  WHERE sa.user_id = auth.uid() 
  AND sa.role = 'super_admin'
  AND sa.is_active = true
));