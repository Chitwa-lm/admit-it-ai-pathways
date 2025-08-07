-- Allow super admins to insert new schools
CREATE POLICY "Super admins can insert schools" 
ON public.schools 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.school_admins sa
    WHERE sa.user_id = auth.uid() 
    AND sa.role = 'super_admin'::app_role 
    AND sa.is_active = true
  )
);

-- Allow super admins to update schools
CREATE POLICY "Super admins can update schools" 
ON public.schools 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM public.school_admins sa
    WHERE sa.user_id = auth.uid() 
    AND sa.role = 'super_admin'::app_role 
    AND sa.is_active = true
  )
);