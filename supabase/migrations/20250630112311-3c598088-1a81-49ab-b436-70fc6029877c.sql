
-- Add school admin role to the existing app_role enum (if it doesn't exist, create it)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE app_role AS ENUM ('parent', 'school_admin', 'super_admin');
    ELSE
        -- Add school_admin role if it doesn't exist
        BEGIN
            ALTER TYPE app_role ADD VALUE 'school_admin';
        EXCEPTION
            WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- Create school_admins table to link users to specific schools
CREATE TABLE public.school_admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE NOT NULL,
    role app_role DEFAULT 'school_admin' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, school_id)
);

-- Enable RLS on school_admins table
ALTER TABLE public.school_admins ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin of a specific school
CREATE OR REPLACE FUNCTION public.is_school_admin(user_id UUID, school_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.school_admins sa
        WHERE sa.user_id = $1 
        AND sa.school_id = $2 
        AND sa.is_active = true
    );
$$;

-- Create function to get user's administered school
CREATE OR REPLACE FUNCTION public.get_admin_school_id(user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT sa.school_id 
    FROM public.school_admins sa
    WHERE sa.user_id = $1 
    AND sa.is_active = true
    LIMIT 1;
$$;

-- RLS Policies for school_admins table
CREATE POLICY "School admins can view their own records" 
    ON public.school_admins 
    FOR SELECT 
    USING (user_id = auth.uid());

-- Update applications table RLS policies to allow school admins to see their school's applications
CREATE POLICY "School admins can view applications for their school" 
    ON public.applications 
    FOR SELECT 
    USING (
        school_id = public.get_admin_school_id(auth.uid())
    );

CREATE POLICY "School admins can update applications for their school" 
    ON public.applications 
    FOR UPDATE 
    USING (
        school_id = public.get_admin_school_id(auth.uid())
    );

-- Update students table RLS to allow school admins to see students who applied to their school
CREATE POLICY "School admins can view students who applied to their school" 
    ON public.students 
    FOR SELECT 
    USING (
        id IN (
            SELECT student_id 
            FROM public.applications 
            WHERE school_id = public.get_admin_school_id(auth.uid())
        )
    );

-- Update documents table RLS to allow school admins to see documents for their school's applications
CREATE POLICY "School admins can view documents for their school applications" 
    ON public.documents 
    FOR SELECT 
    USING (
        application_id IN (
            SELECT id 
            FROM public.applications 
            WHERE school_id = public.get_admin_school_id(auth.uid())
        )
    );

CREATE POLICY "School admins can update document verification for their school" 
    ON public.documents 
    FOR UPDATE 
    USING (
        application_id IN (
            SELECT id 
            FROM public.applications 
            WHERE school_id = public.get_admin_school_id(auth.uid())
        )
    );

-- Update application_history table RLS
CREATE POLICY "School admins can view application history for their school" 
    ON public.application_history 
    FOR SELECT 
    USING (
        application_id IN (
            SELECT id 
            FROM public.applications 
            WHERE school_id = public.get_admin_school_id(auth.uid())
        )
    );

CREATE POLICY "School admins can insert application history for their school" 
    ON public.application_history 
    FOR INSERT 
    WITH CHECK (
        application_id IN (
            SELECT id 
            FROM public.applications 
            WHERE school_id = public.get_admin_school_id(auth.uid())
        )
    );

-- Create indexes for better performance
CREATE INDEX idx_school_admins_user_id ON public.school_admins(user_id);
CREATE INDEX idx_school_admins_school_id ON public.school_admins(school_id);
CREATE INDEX idx_school_admins_active ON public.school_admins(is_active);
