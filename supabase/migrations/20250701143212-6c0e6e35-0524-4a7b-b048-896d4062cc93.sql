
-- First, let's drop the problematic policies that are causing infinite recursion
DROP POLICY IF EXISTS "School admins can view students who applied to their school" ON students;
DROP POLICY IF EXISTS "Super admins can view all students" ON students;

-- Create a simpler policy for school admins to view students
-- This avoids the circular dependency by using a direct join
CREATE POLICY "School admins can view students who applied to their school" 
ON students 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM applications a
    INNER JOIN school_admins sa ON sa.school_id = a.school_id
    WHERE a.student_id = students.id 
    AND sa.user_id = auth.uid() 
    AND sa.is_active = true
    AND sa.role = 'school_admin'::app_role
  )
);

-- Create a separate policy for super admins to view all students
CREATE POLICY "Super admins can view all students" 
ON students 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM school_admins sa
    WHERE sa.user_id = auth.uid() 
    AND sa.role = 'super_admin'::app_role 
    AND sa.is_active = true
  )
);

-- Also update the applications policies to be more explicit and avoid recursion
DROP POLICY IF EXISTS "Parents can view applications for their students" ON applications;
DROP POLICY IF EXISTS "School admins can view applications for their school" ON applications;
DROP POLICY IF EXISTS "Super admins can view all applications" ON applications;

-- Recreate the policies with clearer logic
CREATE POLICY "Parents can view applications for their students" 
ON applications 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM students s 
    WHERE s.id = applications.student_id 
    AND s.parent_id = auth.uid()
  )
);

CREATE POLICY "School admins can view applications for their school" 
ON applications 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM school_admins sa 
    WHERE sa.school_id = applications.school_id 
    AND sa.user_id = auth.uid() 
    AND sa.is_active = true 
    AND sa.role = 'school_admin'::app_role
  )
);

CREATE POLICY "Super admins can view all applications" 
ON applications 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM school_admins sa 
    WHERE sa.user_id = auth.uid() 
    AND sa.role = 'super_admin'::app_role 
    AND sa.is_active = true
  )
);
