// Constants for the Zambian Admissions Management System

import { Province, SchoolType, GradeLevel, ApplicationStatus, DocumentType, UserRole } from '@/types/database';

// Zambian Provinces
export const PROVINCES: { value: Province; label: string }[] = [
  { value: 'central', label: 'Central Province' },
  { value: 'copperbelt', label: 'Copperbelt Province' },
  { value: 'eastern', label: 'Eastern Province' },
  { value: 'luapula', label: 'Luapula Province' },
  { value: 'lusaka', label: 'Lusaka Province' },
  { value: 'muchinga', label: 'Muchinga Province' },
  { value: 'northern', label: 'Northern Province' },
  { value: 'north_western', label: 'North Western Province' },
  { value: 'southern', label: 'Southern Province' },
  { value: 'western', label: 'Western Province' },
];

// School Types
export const SCHOOL_TYPES: { value: SchoolType; label: string }[] = [
  { value: 'government', label: 'Government School' },
  { value: 'private', label: 'Private School' },
  { value: 'trust_grant_aided', label: 'Trust/Grant Aided School' },
];

// Grade Levels
export const GRADE_LEVELS: { value: GradeLevel; label: string; category: 'primary' | 'secondary' }[] = [
  // Primary Grades
  { value: 'grade_1', label: 'Grade 1', category: 'primary' },
  { value: 'grade_2', label: 'Grade 2', category: 'primary' },
  { value: 'grade_3', label: 'Grade 3', category: 'primary' },
  { value: 'grade_4', label: 'Grade 4', category: 'primary' },
  { value: 'grade_5', label: 'Grade 5', category: 'primary' },
  { value: 'grade_6', label: 'Grade 6', category: 'primary' },
  { value: 'grade_7', label: 'Grade 7', category: 'primary' },
  
  // Secondary Grades
  { value: 'grade_8', label: 'Grade 8', category: 'secondary' },
  { value: 'grade_9', label: 'Grade 9', category: 'secondary' },
  { value: 'grade_10', label: 'Grade 10', category: 'secondary' },
  { value: 'grade_11', label: 'Grade 11', category: 'secondary' },
  { value: 'grade_12', label: 'Grade 12', category: 'secondary' },
  
  // Forms (Alternative naming for secondary)
  { value: 'form_1', label: 'Form 1', category: 'secondary' },
  { value: 'form_2', label: 'Form 2', category: 'secondary' },
  { value: 'form_3', label: 'Form 3', category: 'secondary' },
  { value: 'form_4', label: 'Form 4', category: 'secondary' },
  { value: 'form_5', label: 'Form 5', category: 'secondary' },
];

// Application Statuses
export const APPLICATION_STATUSES: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'submitted', label: 'Submitted', color: 'blue' },
  { value: 'under_review', label: 'Under Review', color: 'yellow' },
  { value: 'documents_required', label: 'Documents Required', color: 'orange' },
  { value: 'interview_scheduled', label: 'Interview Scheduled', color: 'purple' },
  { value: 'approved', label: 'Approved', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'waitlisted', label: 'Waitlisted', color: 'indigo' },
];

// Document Types
export const DOCUMENT_TYPES: { value: DocumentType; label: string; required: boolean }[] = [
  { value: 'birth_certificate', label: 'Birth Certificate', required: true },
  { value: 'grade_7_certificate', label: 'Grade 7 Certificate', required: false },
  { value: 'grade_9_certificate', label: 'Grade 9 Certificate', required: false },
  { value: 'grade_12_certificate', label: 'Grade 12 Certificate', required: false },
  { value: 'medical_report', label: 'Medical Report', required: true },
  { value: 'passport_photo', label: 'Passport Photo', required: true },
  { value: 'parent_id', label: 'Parent/Guardian ID', required: true },
  { value: 'proof_of_residence', label: 'Proof of Residence', required: false },
  { value: 'recommendation_letter', label: 'Recommendation Letter', required: false },
  { value: 'other', label: 'Other Document', required: false },
];

// User Roles
export const USER_ROLES: { value: UserRole; label: string }[] = [
  { value: 'applicant', label: 'Applicant' },
  { value: 'parent', label: 'Parent/Guardian' },
  { value: 'admissions_officer', label: 'Admissions Officer' },
  { value: 'school_admin', label: 'School Administrator' },
  { value: 'system_admin', label: 'System Administrator' },
];

// File Upload Constraints
export const FILE_UPLOAD_CONSTRAINTS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx'],
};

// Academic Years
export const ACADEMIC_YEARS = [
  '2024',
  '2025',
  '2026',
];

// Common Zambian Districts by Province
export const DISTRICTS_BY_PROVINCE: Record<Province, string[]> = {
  central: ['Kabwe', 'Kapiri Mposhi', 'Mkushi', 'Mumbwa', 'Serenje', 'Chibombo', 'Chitambo', 'Itezhi-Tezhi', 'Luano', 'Ngabwe', 'Shibuyunji'],
  copperbelt: ['Kitwe', 'Ndola', 'Mufulira', 'Luanshya', 'Chingola', 'Kalulushi', 'Chililabombwe', 'Lufwanyama', 'Masaiti', 'Mpongwe'],
  eastern: ['Chipata', 'Katete', 'Lundazi', 'Mambwe', 'Nyimba', 'Petauke', 'Chadiza', 'Chama', 'Lumezi', 'Sinda', 'Vubwi'],
  luapula: ['Mansa', 'Kawambwa', 'Nchelenge', 'Samfya', 'Mwense', 'Chienge', 'Chembe', 'Milenge', 'Mwansabombwe'],
  lusaka: ['Lusaka', 'Kafue', 'Luangwa', 'Rufunsa', 'Chongwe', 'Chirundu'],
  muchinga: ['Chinsali', 'Isoka', 'Mpika', 'Nakonde', 'Kanchibiya', 'Lavushimanda', 'Shiwangandu'],
  northern: ['Kasama', 'Mbala', 'Luwingu', 'Mporokoso', 'Kaputa', 'Mungwi', 'Nsama', 'Senga Hill'],
  north_western: ['Solwezi', 'Mwinilunga', 'Kasempa', 'Zambezi', 'Kabompo', 'Chavuma', 'Ikelenge', 'Kalumbila', 'Manyinga', 'Mushindamo'],
  southern: ['Livingstone', 'Choma', 'Mazabuka', 'Monze', 'Kalomo', 'Namwala', 'Itezhi-Tezhi', 'Kazungula', 'Pemba', 'Siavonga', 'Sinazongwe', 'Gwembe', 'Zimba'],
  western: ['Mongu', 'Senanga', 'Kalabo', 'Kaoma', 'Lukulu', 'Shangombo', 'Sesheke', 'Limulunga', 'Luampa', 'Mitete', 'Mwandi', 'Nalolo', 'Nkeyema', 'Sioma'],
};

// Common Zambian Subjects
export const COMMON_SUBJECTS = [
  'English',
  'Mathematics',
  'Science',
  'Social Studies',
  'Religious Education',
  'Zambian Languages',
  'Creative and Technology Studies',
  'Physical Education',
  'Biology',
  'Chemistry',
  'Physics',
  'Geography',
  'History',
  'Civic Education',
  'Computer Studies',
  'Business Studies',
  'Accounting',
  'Economics',
  'Literature',
  'Art',
  'Music',
  'Home Economics',
  'Agriculture',
];

// Grade Scale
export const GRADE_SCALE = [
  { grade: '1', label: 'Distinction (80-100%)', points: 9 },
  { grade: '2', label: 'Merit (70-79%)', points: 8 },
  { grade: '3', label: 'Credit (60-69%)', points: 7 },
  { grade: '4', label: 'Credit (55-59%)', points: 6 },
  { grade: '5', label: 'Credit (50-54%)', points: 5 },
  { grade: '6', label: 'Pass (45-49%)', points: 4 },
  { grade: '7', label: 'Pass (40-44%)', points: 3 },
  { grade: '8', label: 'Pass (35-39%)', points: 2 },
  { grade: '9', label: 'Fail (0-34%)', points: 1 },
];

// Activity Types
export const ACTIVITY_TYPES = [
  { value: 'sport', label: 'Sports' },
  { value: 'academic', label: 'Academic' },
  { value: 'community', label: 'Community Service' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'other', label: 'Other' },
] as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;