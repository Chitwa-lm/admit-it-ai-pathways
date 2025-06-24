
-- Update the schools table to use Zambian geography
ALTER TABLE public.schools 
  DROP COLUMN IF EXISTS district,
  ADD COLUMN province TEXT,
  ADD COLUMN town TEXT;

-- Rename location column to town for clarity
ALTER TABLE public.schools 
  RENAME COLUMN location TO town_temp;

-- Add proper town column and copy data
UPDATE public.schools SET town = town_temp;
ALTER TABLE public.schools DROP COLUMN town_temp;

-- Update existing sample data with Zambian provinces and towns
UPDATE public.schools SET 
  province = 'Lusaka Province',
  town = 'Lusaka'
WHERE name = 'Lincoln Elementary School';

UPDATE public.schools SET 
  province = 'Copperbelt Province', 
  town = 'Kitwe'
WHERE name = 'Washington Middle School';

UPDATE public.schools SET 
  province = 'Lusaka Province',
  town = 'Chilanga' 
WHERE name = 'Roosevelt High School';

UPDATE public.schools SET 
  province = 'Southern Province',
  town = 'Livingstone'
WHERE name = 'St. Marys Academy';

UPDATE public.schools SET 
  province = 'Central Province',
  town = 'Kabwe'
WHERE name = 'Innovation Charter School';

UPDATE public.schools SET 
  province = 'Western Province', 
  town = 'Mongu'
WHERE name = 'Riverside Elementary';

UPDATE public.schools SET 
  province = 'Northern Province',
  town = 'Kasama' 
WHERE name = 'Valley Prep High School';

-- Add more sample schools for different provinces
INSERT INTO public.schools (name, school_type, town, province, description, phone, email, address) VALUES
('Ndola Primary School', 'Public', 'Ndola', 'Copperbelt Province', 'Government primary school serving the Ndola community with quality education.', '+260-212-621234', 'info@ndolaprimary.edu.zm', 'Independence Way, Ndola'),
('Choma Secondary School', 'Public', 'Choma', 'Southern Province', 'Secondary school focused on academic excellence and community development.', '+260-213-220345', 'admin@chomasecondary.edu.zm', 'Main Road, Choma'),
('Solwezi High School', 'Public', 'Solwezi', 'North-Western Province', 'Comprehensive high school serving the mining community of Solwezi.', '+260-218-821456', 'contact@solwezihigh.edu.zm', 'Hospital Road, Solwezi'),
('Chipata Girls School', 'Public', 'Chipata', 'Eastern Province', 'All-girls secondary school promoting female education and empowerment.', '+260-216-221567', 'office@chipatagirlsschool.edu.zm', 'Great East Road, Chipata'),
('Mansa Technical School', 'Public', 'Mansa', 'Luapula Province', 'Technical and vocational training institution preparing students for skilled careers.', '+260-214-821678', 'info@mansatech.edu.zm', 'Lakeshore Drive, Mansa'),
('Kasempa Community School', 'Public', 'Kasempa', 'North-Western Province', 'Community-based school serving rural students with basic education.', '+260-218-851789', 'kasempaschool@gmail.com', 'Village Center, Kasempa'),
('Mbala Secondary School', 'Public', 'Mbala', 'Northern Province', 'Government secondary school in the northern region of Zambia.', '+260-214-451890', 'mbala.secondary@edu.zm', 'Government Road, Mbala'),
('Monze Boys School', 'Private', 'Monze', 'Southern Province', 'Private boarding school for boys with strong academic programs.', '+260-213-261901', 'admissions@monzeboys.edu.zm', 'School Road, Monze');

-- Add corresponding available places for the new schools
INSERT INTO public.available_places (school_id, grade, available_spots, total_spots, application_deadline, academic_year) VALUES
-- Ndola Primary School
((SELECT id FROM public.schools WHERE name = 'Ndola Primary School'), 'Kindergarten', 30, 60, '2024-03-15', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Ndola Primary School'), '1st Grade', 25, 55, '2024-03-15', '2024-2025'),
-- Choma Secondary School  
((SELECT id FROM public.schools WHERE name = 'Choma Secondary School'), '8th Grade', 20, 45, '2024-02-28', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Choma Secondary School'), '9th Grade', 18, 50, '2024-02-28', '2024-2025'),
-- Solwezi High School
((SELECT id FROM public.schools WHERE name = 'Solwezi High School'), '10th Grade', 15, 40, '2024-04-01', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Solwezi High School'), '11th Grade', 12, 35, '2024-04-01', '2024-2025'),
-- Chipata Girls School
((SELECT id FROM public.schools WHERE name = 'Chipata Girls School'), '8th Grade', 22, 40, '2024-03-20', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Chipata Girls School'), '9th Grade', 18, 35, '2024-03-20', '2024-2025'),
-- Mansa Technical School
((SELECT id FROM public.schools WHERE name = 'Mansa Technical School'), '10th Grade', 25, 45, '2024-03-10', '2024-2025'),
((SELECT id FROM public.schools WHERE name = 'Mansa Technical School'), '11th Grade', 20, 40, '2024-03-10', '2024-2025');
