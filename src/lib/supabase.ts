// Supabase client configuration

import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

// Helper function to get user profile
export const getUserProfile = async (userId?: string) => {
  const id = userId || (await getCurrentUser())?.id;
  if (!id) throw new Error('No user ID provided');

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
};

// Helper function to check user role
export const getUserRole = async (userId?: string) => {
  const profile = await getUserProfile(userId);
  return profile.role;
};

// Helper function to check if user is admin for a school
export const isSchoolAdmin = async (schoolId: string, userId?: string) => {
  const id = userId || (await getCurrentUser())?.id;
  if (!id) return false;

  const { data } = await supabase.rpc('is_school_admin', {
    school_id: schoolId,
    user_id: id,
  });

  return data || false;
};

// Helper function to create notification
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  applicationId?: string,
  type: string = 'info'
) => {
  const { data, error } = await supabase.rpc('create_notification', {
    p_user_id: userId,
    p_application_id: applicationId,
    p_title: title,
    p_message: message,
    p_type: type,
  });

  if (error) throw error;
  return data;
};

// Helper function to create audit log
export const createAuditLog = async (
  action: string,
  tableName: string,
  recordId?: string,
  oldValues?: Record<string, any>,
  newValues?: Record<string, any>
) => {
  const { data, error } = await supabase.rpc('create_audit_log', {
    p_action: action,
    p_table_name: tableName,
    p_record_id: recordId,
    p_old_values: oldValues,
    p_new_values: newValues,
  });

  if (error) throw error;
  return data;
};

// Real-time subscription helpers
export const subscribeToApplicationUpdates = (
  applicationId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`application-${applicationId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'applications',
        filter: `id=eq.${applicationId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToNotifications = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel(`notifications-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

// File upload helpers
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<string> => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;
  return data.path;
};

export const getFileUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};

// Database query helpers
export const getSchools = async (filters?: {
  province?: string;
  type?: string;
  search?: string;
}) => {
  let query = supabase
    .from('schools')
    .select(`
      *,
      available_places (
        id,
        grade_level,
        total_places,
        available_places,
        academic_year,
        application_deadline,
        fees
      )
    `);

  if (filters?.province) {
    query = query.eq('province', filters.province);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query.order('name');

  if (error) throw error;
  return data;
};

export const getApplications = async (filters?: {
  applicantId?: string;
  schoolId?: string;
  status?: string;
}) => {
  let query = supabase
    .from('applications')
    .select(`
      *,
      schools (
        id,
        name,
        type,
        province,
        district
      ),
      user_profiles!applications_applicant_id_fkey (
        id,
        first_name,
        last_name,
        email
      )
    `);

  if (filters?.applicantId) {
    query = query.eq('applicant_id', filters.applicantId);
  }

  if (filters?.schoolId) {
    query = query.eq('school_id', filters.schoolId);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getApplicationDocuments = async (applicationId: string) => {
  const { data, error } = await supabase
    .from('application_documents')
    .select('*')
    .eq('application_id', applicationId)
    .order('uploaded_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getApplicationStatusHistory = async (applicationId: string) => {
  const { data, error } = await supabase
    .from('application_status_history')
    .select(`
      *,
      user_profiles!application_status_history_changed_by_fkey (
        first_name,
        last_name
      )
    `)
    .eq('application_id', applicationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const getNotifications = async (userId: string, unreadOnly: boolean = false) => {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId);

  if (unreadOnly) {
    query = query.is('read_at', null);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId);

  if (error) throw error;
};