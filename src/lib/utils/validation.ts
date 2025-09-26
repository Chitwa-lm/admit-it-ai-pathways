// Validation utilities and helper functions

import { z } from 'zod';
import { 
  Province, 
  SchoolType, 
  GradeLevel, 
  ApplicationStatus, 
  DocumentType, 
  UserRole 
} from '@/types/database';
import { 
  PROVINCES, 
  SCHOOL_TYPES, 
  GRADE_LEVELS, 
  APPLICATION_STATUSES, 
  DOCUMENT_TYPES, 
  USER_ROLES,
  FILE_UPLOAD_CONSTRAINTS 
} from '@/lib/constants';

// Base validation schemas
export const provinceSchema = z.enum([
  'central', 'copperbelt', 'eastern', 'luapula', 'lusaka', 
  'muchinga', 'northern', 'north_western', 'southern', 'western'
] as const);

export const schoolTypeSchema = z.enum(['government', 'private', 'trust_grant_aided'] as const);

export const gradeLevelSchema = z.enum([
  'grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6', 'grade_7',
  'grade_8', 'grade_9', 'grade_10', 'grade_11', 'grade_12',
  'form_1', 'form_2', 'form_3', 'form_4', 'form_5'
] as const);

export const applicationStatusSchema = z.enum([
  'draft', 'submitted', 'under_review', 'documents_required', 
  'interview_scheduled', 'approved', 'rejected', 'waitlisted'
] as const);

export const documentTypeSchema = z.enum([
  'birth_certificate', 'grade_7_certificate', 'grade_9_certificate', 
  'grade_12_certificate', 'medical_report', 'passport_photo', 
  'parent_id', 'proof_of_residence', 'recommendation_letter', 'other'
] as const);

export const userRoleSchema = z.enum([
  'applicant', 'parent', 'admissions_officer', 'school_admin', 'system_admin'
] as const);

// Personal Information Schema
export const personalInfoSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters').max(50),
  last_name: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  date_of_birth: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 5 && age <= 25; // Reasonable age range for school applications
  }, 'Invalid date of birth'),
  gender: z.enum(['male', 'female']),
  nationality: z.string().min(2).max(50).default('Zambian'),
  province: provinceSchema,
  district: z.string().min(2).max(50),
  address: z.string().min(10).max(200),
  parent_guardian_info: z.object({
    father_name: z.string().optional(),
    father_occupation: z.string().optional(),
    father_phone: z.string().optional(),
    father_email: z.string().email().optional().or(z.literal('')),
    mother_name: z.string().optional(),
    mother_occupation: z.string().optional(),
    mother_phone: z.string().optional(),
    mother_email: z.string().email().optional().or(z.literal('')),
    guardian_name: z.string().optional(),
    guardian_relationship: z.string().optional(),
    guardian_phone: z.string().optional(),
    guardian_email: z.string().email().optional().or(z.literal('')),
  }),
});

// Academic Record Schema
export const subjectGradeSchema = z.object({
  subject: z.string().min(2).max(50),
  grade: z.string().min(1).max(2),
  points: z.number().min(1).max(9).optional(),
});

export const academicRecordSchema = z.object({
  institution: z.string().min(2).max(100),
  grade_level: z.string().min(1).max(20),
  year: z.number().min(2000).max(new Date().getFullYear()),
  subjects: z.array(subjectGradeSchema).min(1),
  overall_grade: z.string().optional(),
  certificate_number: z.string().optional(),
});

// Essay Schema
export const essaySchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(100).max(2000),
  word_count: z.number().min(100).max(2000),
});

// Activity Schema
export const activitySchema = z.object({
  name: z.string().min(2).max(100),
  type: z.enum(['sport', 'academic', 'community', 'leadership', 'other']),
  description: z.string().min(10).max(500),
  duration: z.string().min(2).max(50),
  achievements: z.array(z.string()).optional(),
});

// Reference Schema
export const referenceSchema = z.object({
  name: z.string().min(2).max(100),
  title: z.string().min(2).max(100),
  organization: z.string().min(2).max(100),
  phone: z.string().min(10).max(15),
  email: z.string().email(),
  relationship: z.string().min(2).max(50),
});

// Emergency Contact Schema
export const emergencyContactSchema = z.object({
  name: z.string().min(2).max(100),
  relationship: z.string().min(2).max(50),
  phone: z.string().min(10).max(15),
  address: z.string().min(10).max(200),
});

// Medical Info Schema
export const medicalInfoSchema = z.object({
  allergies: z.array(z.string()).optional(),
  medications: z.array(z.string()).optional(),
  medical_conditions: z.array(z.string()).optional(),
  doctor_name: z.string().optional(),
  doctor_phone: z.string().optional(),
});

// Complete Application Data Schema
export const applicationDataSchema = z.object({
  personal_info: personalInfoSchema.optional(),
  academic_history: z.array(academicRecordSchema).optional(),
  essays: z.array(essaySchema).optional(),
  extracurriculars: z.array(activitySchema).optional(),
  references: z.array(referenceSchema).optional(),
  emergency_contact: emergencyContactSchema.optional(),
  medical_info: medicalInfoSchema.optional(),
});

// School Schema
export const schoolSchema = z.object({
  name: z.string().min(2).max(100),
  type: schoolTypeSchema,
  province: provinceSchema,
  district: z.string().min(2).max(50),
  address: z.string().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  principal_name: z.string().optional(),
  established_year: z.number().min(1900).max(new Date().getFullYear()).optional(),
  description: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  programs: z.array(z.string()).optional(),
  website_url: z.string().url().optional(),
});

// Available Places Schema
export const availablePlacesSchema = z.object({
  school_id: z.string().uuid(),
  grade_level: gradeLevelSchema,
  total_places: z.number().min(0),
  available_places: z.number().min(0),
  academic_year: z.string().min(4).max(4),
  application_deadline: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  fees: z.number().min(0).optional(),
});

// User Profile Schema
export const userProfileSchema = z.object({
  email: z.string().email(),
  role: userRoleSchema,
  first_name: z.string().min(2).max(50),
  last_name: z.string().min(2).max(50),
  phone_number: z.string().optional(),
  province: provinceSchema.optional(),
  district: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  nationality: z.string().optional(),
});

// File Upload Validation
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size
  if (file.size > FILE_UPLOAD_CONSTRAINTS.maxSize) {
    return {
      isValid: false,
      error: `File size must be less than ${FILE_UPLOAD_CONSTRAINTS.maxSize / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!FILE_UPLOAD_CONSTRAINTS.allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed. Please upload PDF, DOC, DOCX, or image files.',
    };
  }

  // Check file extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!FILE_UPLOAD_CONSTRAINTS.allowedExtensions.includes(extension)) {
    return {
      isValid: false,
      error: 'File extension not allowed.',
    };
  }

  return { isValid: true };
};

// Phone number validation for Zambian numbers
export const validateZambianPhone = (phone: string): boolean => {
  // Zambian phone numbers: +260XXXXXXXXX or 0XXXXXXXXX
  const zambianPhoneRegex = /^(\+260|0)[0-9]{9}$/;
  return zambianPhoneRegex.test(phone.replace(/\s/g, ''));
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Date validation helpers
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

export const calculateAge = (birthDate: string): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Application completeness validation
export const validateApplicationCompleteness = (applicationData: any): {
  isComplete: boolean;
  missingFields: string[];
} => {
  const missingFields: string[] = [];

  if (!applicationData.personal_info) {
    missingFields.push('Personal Information');
  }

  if (!applicationData.academic_history || applicationData.academic_history.length === 0) {
    missingFields.push('Academic History');
  }

  if (!applicationData.emergency_contact) {
    missingFields.push('Emergency Contact');
  }

  // Check for required essays based on grade level
  if (!applicationData.essays || applicationData.essays.length === 0) {
    missingFields.push('Personal Statement/Essays');
  }

  return {
    isComplete: missingFields.length === 0,
    missingFields,
  };
};

// Grade point calculation
export const calculateGPA = (subjects: { grade: string; points?: number }[]): number => {
  if (subjects.length === 0) return 0;
  
  const totalPoints = subjects.reduce((sum, subject) => {
    const points = subject.points || parseInt(subject.grade) || 0;
    return sum + points;
  }, 0);
  
  return totalPoints / subjects.length;
};

// Export all schemas for use in forms
export const validationSchemas = {
  personalInfo: personalInfoSchema,
  academicRecord: academicRecordSchema,
  essay: essaySchema,
  activity: activitySchema,
  reference: referenceSchema,
  emergencyContact: emergencyContactSchema,
  medicalInfo: medicalInfoSchema,
  applicationData: applicationDataSchema,
  school: schoolSchema,
  availablePlaces: availablePlacesSchema,
  userProfile: userProfileSchema,
};