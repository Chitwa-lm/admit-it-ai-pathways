-- Comprehensive seed data for Zambian Admissions Management System

-- Insert schools for all 10 provinces with generic Zambian names
INSERT INTO schools (id, name, type, province, district, address, contact_email, contact_phone, principal_name, established_year, description) VALUES

-- LUSAKA PROVINCE SCHOOLS
('550e8400-e29b-41d4-a716-446655440001', 'Lusaka Central Primary School', 'government', 'lusaka', 'Lusaka', 'Plot 123, Independence Avenue, Lusaka', 'info@lusakacentral.edu.zm', '+260211234567', 'Mrs. Mary Mwanza', 1965, 'Premier government primary school in Lusaka city center.'),
('550e8400-e29b-41d4-a716-446655440002', 'Kabulonga High School', 'government', 'lusaka', 'Lusaka', 'Kabulonga Area, Lusaka', 'admin@kabulongahigh.edu.zm', '+260211234568', 'Mr. John Banda', 1970, 'Well-established secondary school in residential area.'),
('550e8400-e29b-41d4-a716-446655440003', 'Chelstone Academy', 'private', 'lusaka', 'Lusaka', 'Chelstone Township, Lusaka', 'office@chelstoneacademy.edu.zm', '+260211234569', 'Dr. Grace Sikazwe', 1985, 'Private school offering quality education from Grade 1-12.'),
('550e8400-e29b-41d4-a716-446655440004', 'Kafue Basic School', 'government', 'lusaka', 'Kafue', 'Central Kafue, Kafue District', 'info@kafuebasic.edu.zm', '+260211234570', 'Mrs. Patricia Mulenga', 1960, 'Community school serving Kafue district families.'),

-- COPPERBELT PROVINCE SCHOOLS  
('550e8400-e29b-41d4-a716-446655440005', 'Kitwe Central School', 'government', 'copperbelt', 'Kitwe', 'City Center, Kitwe', 'admin@kitwecentral.edu.zm', '+260212345678', 'Mr. Joseph Chanda', 1958, 'Historic school in the heart of Kitwe mining town.'),
('550e8400-e29b-41d4-a716-446655440006', 'Ndola Girls High School', 'government', 'copperbelt', 'Ndola', 'Northrise, Ndola', 'office@ndolagirls.edu.zm', '+260212345679', 'Mrs. Sarah Phiri', 1962, 'Leading girls secondary school in Copperbelt.'),
('550e8400-e29b-41d4-a716-446655440007', 'Mufulira Technical College', 'trust_grant_aided', 'copperbelt', 'Mufulira', 'Mine Township, Mufulira', 'tech@mufuliratech.edu.zm', '+260212345680', 'Mr. David Mwale', 1975, 'Technical education focused on mining industry skills.'),
('550e8400-e29b-41d4-a716-446655440008', 'Chingola Community School', 'government', 'copperbelt', 'Chingola', 'Chingola Township', 'info@chingolacommunity.edu.zm', '+260212345681', 'Mrs. Ruth Kasonde', 1968, 'Community-focused school serving mining families.'),

-- CENTRAL PROVINCE SCHOOLS
('550e8400-e29b-41d4-a716-446655440009', 'Kabwe Boys Secondary', 'government', 'central', 'Kabwe', 'Bwacha, Kabwe', 'admin@kabweboys.edu.zm', '+260215765432', 'Mr. Michael Tembo', 1955, 'Traditional boys secondary school with strong academics.'),
('550e8400-e29b-41d4-a716-446655440010', 'Kapiri Mposhi Primary', 'government', 'central', 'Kapiri Mposhi', 'Central Kapiri Mposhi', 'info@kapiriprimary.edu.zm', '+260215765433', 'Mrs. Agnes Mubanga', 1963, 'Primary school serving railway junction community.'),
('550e8400-e29b-41d4-a716-446655440011', 'Mkushi Agricultural School', 'trust_grant_aided', 'central', 'Mkushi', 'Mkushi Farming Area', 'agri@mkushischool.edu.zm', '+260215765434', 'Mr. Francis Nyirenda', 1978, 'Specialized school focusing on agricultural education.'),

-- EASTERN PROVINCE SCHOOLS
('550e8400-e29b-41d4-a716-446655440012', 'Chipata Central High School', 'government', 'eastern', 'Chipata', 'Kapata, Chipata', 'office@chipatacentral.edu.zm', '+260216654321', 'Mrs. Elizabeth Zulu', 1968, 'Main secondary school serving Eastern Province capital.'),
('550e8400-e29b-41d4-a716-446655440013', 'Katete Basic School', 'government', 'eastern', 'Katete', 'Katete Township', 'info@katetebasic.edu.zm', '+260216654322', 'Mr. Peter Banda', 1972, 'Rural school serving farming communities.'),
('550e8400-e29b-41d4-a716-446655440014', 'Lundazi Girls School', 'government', 'eastern', 'Lundazi', 'Lundazi Boma', 'admin@lundazigirls.edu.zm', '+260216654323', 'Mrs. Joyce Phiri', 1965, 'Girls boarding school in northern Eastern Province.'),

-- SOUTHERN PROVINCE SCHOOLS
('550e8400-e29b-41d4-a716-446655440015', 'Livingstone High School', 'government', 'southern', 'Livingstone', 'Maramba, Livingstone', 'info@livingstonehigh.edu.zm', '+260213456789', 'Mr. Charles Mukuka', 1960, 'Historic school near Victoria Falls.'),
('550e8400-e29b-41d4-a716-446655440016', 'Choma Central School', 'government', 'southern', 'Choma', 'Central Choma', 'admin@chomacentral.edu.zm', '+260213456790', 'Mrs. Margaret Hamoonga', 1958, 'Main school serving Choma district.'),
('550e8400-e29b-41d4-a716-446655440017', 'Mazabuka Sugar Academy', 'private', 'southern', 'Mazabuka', 'Sugar Estate, Mazabuka', 'office@mazabukasugar.edu.zm', '+260213456791', 'Dr. Robert Siameja', 1980, 'Private school serving sugar industry families.'),

-- WESTERN PROVINCE SCHOOLS
('550e8400-e29b-41d4-a716-446655440018', 'Mongu Secondary School', 'government', 'western', 'Mongu', 'Mongu Boma', 'info@mongusecondary.edu.zm', '+260217890123', 'Mr. Godwin Mubita', 1962, 'Main secondary school in Western Province capital.'),
('550e8400-e29b-41d4-a716-446655440019', 'Senanga Basic School', 'government', 'western', 'Senanga', 'Senanga Township', 'admin@senangabasic.edu.zm', '+260217890124', 'Mrs. Nalishebo Muyunda', 1970, 'Community school serving Zambezi floodplain area.'),
('550e8400-e29b-41d4-a716-446655440020', 'Kalabo Mission School', 'trust_grant_aided', 'western', 'Kalabo', 'Kalabo Mission', 'mission@kalabomission.edu.zm', '+260217890125', 'Father John Liswaniso', 1955, 'Mission school with strong community ties.'),

-- NORTHERN PROVINCE SCHOOLS
('550e8400-e29b-41d4-a716-446655440021', 'Kasama Boys High School', 'government', 'northern', 'Kasama', 'Kasama Boma', 'office@kasamaboys.edu.zm', '+260214567890', 'Mr. Emmanuel Mwamba', 1965, 'Premier boys school in Northern Province.'),
('550e8400-e29b-41d4-a716-446655440022', 'Mbala Girls School', 'government', 'northern', 'Mbala', 'Mbala Township', 'info@mbalagirls.edu.zm', '+260214567891', 'Mrs. Catherine Musonda', 1968, 'Girls boarding school near Lake Tanganyika.'),
('550e8400-e29b-41d4-a716-446655440023', 'Luwingu Community School', 'government', 'northern', 'Luwingu', 'Luwingu Boma', 'admin@luwingucommunity.edu.zm', '+260214567892', 'Mr. Patrick Chilufya', 1975, 'Rural community school.'),

-- LUAPULA PROVINCE SCHOOLS
('550e8400-e29b-41d4-a716-446655440024', 'Mansa Central School', 'government', 'luapula', 'Mansa', 'Mansa Boma', 'info@mansacentral.edu.zm', '+260218901234', 'Mrs. Beatrice Kapembwa', 1963, 'Main school in Luapula Province capital.'),
('550e8400-e29b-41d4-a716-446655440025', 'Kawambwa Technical School', 'trust_grant_aided', 'luapula', 'Kawambwa', 'Kawambwa Township', 'tech@kawambwatech.edu.zm', '+260218901235', 'Mr. Moses Chishimba', 1978, 'Technical school focusing on fishing industry.'),
('550e8400-e29b-41d4-a716-446655440026', 'Samfya Basic School', 'government', 'luapula', 'Samfya', 'Samfya Fishing Village', 'office@samfyabasic.edu.zm', '+260218901236', 'Mrs. Charity Mulenga', 1972, 'School serving Lake Bangweulu fishing communities.'),

-- MUCHINGA PROVINCE SCHOOLS
('550e8400-e29b-41d4-a716-446655440027', 'Chinsali High School', 'government', 'muchinga', 'Chinsali', 'Chinsali Boma', 'admin@chinsalihigh.edu.zm', '+260219012345', 'Mr. Andrew Mwelwa', 1970, 'Secondary school in Muchinga Province capital.'),
('550e8400-e29b-41d4-a716-446655440028', 'Isoka Basic School', 'government', 'muchinga', 'Isoka', 'Isoka Township', 'info@isokabasic.edu.zm', '+260219012346', 'Mrs. Esther Mwansa', 1968, 'Primary school serving border community.'),
('550e8400-e29b-41d4-a716-446655440029', 'Mpika Community School', 'government', 'muchinga', 'Mpika', 'Mpika Township', 'office@mpikacommunity.edu.zm', '+260219012347', 'Mr. George Sichone', 1974, 'Community school on Great North Road.'),

-- NORTH WESTERN PROVINCE SCHOOLS
('550e8400-e29b-41d4-a716-446655440030', 'Solwezi Central School', 'government', 'north_western', 'Solwezi', 'Solwezi Boma', 'info@solwezicentral.edu.zm', '+260218123456', 'Mrs. Alice Chinyanta', 1965, 'Main school in mining town of Solwezi.'),
('550e8400-e29b-41d4-a716-446655440031', 'Mwinilunga Mission School', 'trust_grant_aided', 'north_western', 'Mwinilunga', 'Mwinilunga Mission', 'mission@mwinilungamission.edu.zm', '+260218123457', 'Father Paul Chikoti', 1958, 'Historic mission school near Angola border.'),
('550e8400-e29b-41d4-a716-446655440032', 'Zambezi Basic School', 'government', 'north_western', 'Zambezi', 'Zambezi Township', 'admin@zambezibasic.edu.zm', '+260218123458', 'Mr. Vincent Kayombo', 1976, 'School serving remote northwestern community.');

-- Insert comprehensive available places ensuring at least 5 places per grade per province
INSERT INTO available_places (school_id, grade_level, total_places, available_places, academic_year, application_deadline, requirements, fees) VALUES

-- LUSAKA PROVINCE PLACES
-- Lusaka Central Primary School (Primary grades)
('550e8400-e29b-41d4-a716-446655440001', 'grade_1', 40, 15, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440001', 'grade_2', 35, 12, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440001', 'grade_3', 35, 10, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440001', 'grade_4', 35, 8, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440001', 'grade_5', 35, 7, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440001', 'grade_6', 35, 6, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440001', 'grade_7', 35, 5, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00),

-- Kabulonga High School (Secondary grades)
('550e8400-e29b-41d4-a716-446655440002', 'grade_8', 50, 20, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440002', 'grade_9', 45, 18, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440002', 'grade_10', 45, 15, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440002', 'grade_11', 40, 12, '2024', '2024-02-28', ARRAY['Grade 10 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440002', 'grade_12', 40, 10, '2024', '2024-02-28', ARRAY['Grade 11 Results', 'Birth Certificate'], 0.00),

-- Chelstone Academy (All grades - Private)
('550e8400-e29b-41d4-a716-446655440003', 'grade_1', 25, 8, '2024', '2024-03-15', ARRAY['Birth Certificate', 'Medical Report', 'Interview'], 8000.00),
('550e8400-e29b-41d4-a716-446655440003', 'grade_8', 30, 12, '2024', '2024-03-15', ARRAY['Grade 7 Certificate', 'Entrance Test'], 12000.00),
('550e8400-e29b-41d4-a716-446655440003', 'form_1', 25, 8, '2024', '2024-03-15', ARRAY['Grade 9 Certificate', 'Entrance Test'], 15000.00),

-- Kafue Basic School
('550e8400-e29b-41d4-a716-446655440004', 'grade_1', 30, 10, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440004', 'grade_8', 35, 15, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),

-- COPPERBELT PROVINCE PLACES
-- Kitwe Central School
('550e8400-e29b-41d4-a716-446655440005', 'grade_1', 45, 18, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440005', 'grade_2', 40, 15, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440005', 'grade_3', 40, 12, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440005', 'grade_4', 40, 10, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440005', 'grade_5', 40, 8, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440005', 'grade_6', 40, 7, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440005', 'grade_7', 40, 6, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00),

-- Ndola Girls High School
('550e8400-e29b-41d4-a716-446655440006', 'grade_8', 60, 25, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440006', 'grade_9', 55, 20, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440006', 'grade_10', 55, 18, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440006', 'grade_11', 50, 15, '2024', '2024-02-28', ARRAY['Grade 10 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440006', 'grade_12', 50, 12, '2024', '2024-02-28', ARRAY['Grade 11 Results', 'Birth Certificate'], 0.00),

-- Mufulira Technical College
('550e8400-e29b-41d4-a716-446655440007', 'form_1', 40, 15, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Technical Aptitude Test'], 2000.00),
('550e8400-e29b-41d4-a716-446655440007', 'form_2', 35, 12, '2024', '2024-02-28', ARRAY['Form 1 Results', 'Birth Certificate'], 2000.00),
('550e8400-e29b-41d4-a716-446655440007', 'form_3', 35, 10, '2024', '2024-02-28', ARRAY['Form 2 Results', 'Birth Certificate'], 2000.00),

-- Chingola Community School
('550e8400-e29b-41d4-a716-446655440008', 'grade_1', 35, 12, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440008', 'grade_8', 40, 16, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),

-- CENTRAL PROVINCE PLACES
-- Kabwe Boys Secondary
('550e8400-e29b-41d4-a716-446655440009', 'grade_8', 50, 20, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440009', 'grade_9', 45, 18, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440009', 'grade_10', 45, 15, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440009', 'grade_11', 40, 12, '2024', '2024-02-28', ARRAY['Grade 10 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440009', 'grade_12', 40, 10, '2024', '2024-02-28', ARRAY['Grade 11 Results', 'Birth Certificate'], 0.00),

-- Kapiri Mposhi Primary
('550e8400-e29b-41d4-a716-446655440010', 'grade_1', 30, 12, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440010', 'grade_2', 28, 10, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440010', 'grade_3', 28, 8, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440010', 'grade_4', 28, 7, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440010', 'grade_5', 28, 6, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440010', 'grade_6', 28, 5, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440010', 'grade_7', 28, 5, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00),

-- Mkushi Agricultural School
('550e8400-e29b-41d4-a716-446655440011', 'grade_8', 35, 14, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Interest in Agriculture'], 1000.00),
('550e8400-e29b-41d4-a716-446655440011', 'form_1', 30, 12, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Agricultural Background'], 1500.00),

-- EASTERN PROVINCE PLACES
-- Chipata Central High School
('550e8400-e29b-41d4-a716-446655440012', 'grade_8', 55, 22, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440012', 'grade_9', 50, 20, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440012', 'grade_10', 50, 18, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440012', 'grade_11', 45, 15, '2024', '2024-02-28', ARRAY['Grade 10 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440012', 'grade_12', 45, 12, '2024', '2024-02-28', ARRAY['Grade 11 Results', 'Birth Certificate'], 0.00),

-- Katete Basic School
('550e8400-e29b-41d4-a716-446655440013', 'grade_1', 25, 10, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440013', 'grade_2', 25, 8, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440013', 'grade_3', 25, 7, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440013', 'grade_4', 25, 6, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440013', 'grade_5', 25, 5, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440013', 'grade_6', 25, 5, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440013', 'grade_7', 25, 5, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00),

-- Lundazi Girls School
('550e8400-e29b-41d4-a716-446655440014', 'grade_8', 40, 16, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440014', 'grade_9', 35, 14, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440014', 'grade_10', 35, 12, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Birth Certificate'], 0.00),

-- SOUTHERN PROVINCE PLACES
-- Livingstone High School
('550e8400-e29b-41d4-a716-446655440015', 'grade_8', 50, 20, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440015', 'grade_9', 45, 18, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440015', 'grade_10', 45, 15, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440015', 'grade_11', 40, 12, '2024', '2024-02-28', ARRAY['Grade 10 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440015', 'grade_12', 40, 10, '2024', '2024-02-28', ARRAY['Grade 11 Results', 'Birth Certificate'], 0.00),

-- Choma Central School
('550e8400-e29b-41d4-a716-446655440016', 'grade_1', 35, 14, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440016', 'grade_2', 30, 12, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440016', 'grade_3', 30, 10, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440016', 'grade_4', 30, 8, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440016', 'grade_5', 30, 7, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440016', 'grade_6', 30, 6, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440016', 'grade_7', 30, 5, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00),

-- Mazabuka Sugar Academy
('550e8400-e29b-41d4-a716-446655440017', 'grade_1', 20, 8, '2024', '2024-03-15', ARRAY['Birth Certificate', 'Medical Report', 'Parent Employment'], 10000.00),
('550e8400-e29b-41d4-a716-446655440017', 'grade_8', 25, 10, '2024', '2024-03-15', ARRAY['Grade 7 Certificate', 'Entrance Test'], 12000.00),

-- WESTERN PROVINCE PLACES
-- Mongu Secondary School
('550e8400-e29b-41d4-a716-446655440018', 'grade_8', 45, 18, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440018', 'grade_9', 40, 16, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440018', 'grade_10', 40, 14, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440018', 'grade_11', 35, 12, '2024', '2024-02-28', ARRAY['Grade 10 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440018', 'grade_12', 35, 10, '2024', '2024-02-28', ARRAY['Grade 11 Results', 'Birth Certificate'], 0.00),

-- Senanga Basic School
('550e8400-e29b-41d4-a716-446655440019', 'grade_1', 25, 10, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440019', 'grade_2', 25, 8, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440019', 'grade_3', 25, 7, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440019', 'grade_4', 25, 6, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440019', 'grade_5', 25, 5, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440019', 'grade_6', 25, 5, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440019', 'grade_7', 25, 5, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00),

-- Kalabo Mission School
('550e8400-e29b-41d4-a716-446655440020', 'grade_8', 30, 12, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 500.00),
('550e8400-e29b-41d4-a716-446655440020', 'grade_9', 28, 10, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 500.00),

-- NORTHERN PROVINCE PLACES
-- Kasama Boys High School
('550e8400-e29b-41d4-a716-446655440021', 'grade_8', 50, 20, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440021', 'grade_9', 45, 18, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440021', 'grade_10', 45, 15, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440021', 'grade_11', 40, 12, '2024', '2024-02-28', ARRAY['Grade 10 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440021', 'grade_12', 40, 10, '2024', '2024-02-28', ARRAY['Grade 11 Results', 'Birth Certificate'], 0.00),

-- Mbala Girls School
('550e8400-e29b-41d4-a716-446655440022', 'grade_8', 35, 14, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440022', 'grade_9', 30, 12, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440022', 'grade_10', 30, 10, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Birth Certificate'], 0.00),

-- Luwingu Community School
('550e8400-e29b-41d4-a716-446655440023', 'grade_1', 20, 8, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440023', 'grade_2', 20, 7, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440023', 'grade_3', 20, 6, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440023', 'grade_4', 20, 5, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440023', 'grade_5', 20, 5, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440023', 'grade_6', 20, 5, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440023', 'grade_7', 20, 5, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00),

-- LUAPULA PROVINCE PLACES
-- Mansa Central School
('550e8400-e29b-41d4-a716-446655440024', 'grade_1', 30, 12, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440024', 'grade_2', 28, 10, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440024', 'grade_3', 28, 8, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440024', 'grade_4', 28, 7, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440024', 'grade_5', 28, 6, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440024', 'grade_6', 28, 5, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440024', 'grade_7', 28, 5, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440024', 'grade_8', 35, 14, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),

-- Kawambwa Technical School
('550e8400-e29b-41d4-a716-446655440025', 'form_1', 25, 10, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Technical Interest'], 1500.00),
('550e8400-e29b-41d4-a716-446655440025', 'form_2', 22, 8, '2024', '2024-02-28', ARRAY['Form 1 Results', 'Birth Certificate'], 1500.00),

-- Samfya Basic School
('550e8400-e29b-41d4-a716-446655440026', 'grade_1', 25, 10, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440026', 'grade_8', 30, 12, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),

-- MUCHINGA PROVINCE PLACES
-- Chinsali High School
('550e8400-e29b-41d4-a716-446655440027', 'grade_8', 40, 16, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440027', 'grade_9', 35, 14, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440027', 'grade_10', 35, 12, '2024', '2024-02-28', ARRAY['Grade 9 Certificate', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440027', 'grade_11', 30, 10, '2024', '2024-02-28', ARRAY['Grade 10 Results', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440027', 'grade_12', 30, 8, '2024', '2024-02-28', ARRAY['Grade 11 Results', 'Birth Certificate'], 0.00),

-- Isoka Basic School
('550e8400-e29b-41d4-a716-446655440028', 'grade_1', 25, 10, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440028', 'grade_2', 22, 8, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440028', 'grade_3', 22, 7, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440028', 'grade_4', 22, 6, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440028', 'grade_5', 22, 5, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440028', 'grade_6', 22, 5, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440028', 'grade_7', 22, 5, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00),

-- Mpika Community School
('550e8400-e29b-41d4-a716-446655440029', 'grade_1', 20, 8, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440029', 'grade_8', 25, 10, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),

-- NORTH WESTERN PROVINCE PLACES
-- Solwezi Central School
('550e8400-e29b-41d4-a716-446655440030', 'grade_1', 35, 14, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440030', 'grade_2', 30, 12, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440030', 'grade_3', 30, 10, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440030', 'grade_4', 30, 8, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440030', 'grade_5', 30, 7, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440030', 'grade_6', 30, 6, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440030', 'grade_7', 30, 5, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440030', 'grade_8', 35, 14, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 0.00),

-- Mwinilunga Mission School
('550e8400-e29b-41d4-a716-446655440031', 'grade_8', 25, 10, '2024', '2024-02-28', ARRAY['Grade 7 Certificate', 'Birth Certificate'], 800.00),
('550e8400-e29b-41d4-a716-446655440031', 'grade_9', 22, 8, '2024', '2024-02-28', ARRAY['Grade 8 Results', 'Birth Certificate'], 800.00),

-- Zambezi Basic School
('550e8400-e29b-41d4-a716-446655440032', 'grade_1', 20, 8, '2024', '2024-02-28', ARRAY['Birth Certificate', 'Medical Report'], 0.00),
('550e8400-e29b-41d4-a716-446655440032', 'grade_2', 18, 7, '2024', '2024-02-28', ARRAY['Grade 1 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440032', 'grade_3', 18, 6, '2024', '2024-02-28', ARRAY['Grade 2 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440032', 'grade_4', 18, 5, '2024', '2024-02-28', ARRAY['Grade 3 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440032', 'grade_5', 18, 5, '2024', '2024-02-28', ARRAY['Grade 4 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440032', 'grade_6', 18, 5, '2024', '2024-02-28', ARRAY['Grade 5 Report', 'Birth Certificate'], 0.00),
('550e8400-e29b-41d4-a716-446655440032', 'grade_7', 18, 5, '2024', '2024-02-28', ARRAY['Grade 6 Report', 'Birth Certificate'], 0.00);

-- Create some sample user profiles (these would normally be created via auth signup)
-- Note: In production, these would be created through the authentication flow
INSERT INTO user_profiles (id, email, role, first_name, last_name, phone_number, province, district) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@system.zm', 'system_admin', 'System', 'Administrator', '+260977123456', 'lusaka', 'Lusaka'),
('22222222-2222-2222-2222-222222222222', 'principal@lusakahigh.edu.zm', 'school_admin', 'Mary', 'Mwanza', '+260977234567', 'lusaka', 'Lusaka'),
('33333333-3333-3333-3333-333333333333', 'admissions@lusakahigh.edu.zm', 'admissions_officer', 'David', 'Chanda', '+260977345678', 'lusaka', 'Lusaka');

-- Assign school administrators
INSERT INTO school_administrators (school_id, user_id) VALUES
('550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222'), -- Mary Mwanza as Lusaka High School admin
('550e8400-e29b-41d4-a716-446655440001', '33333333-3333-3333-3333-333333333333'); -- David Chanda as admissions officer