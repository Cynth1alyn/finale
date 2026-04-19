-- Reset Departments and Users to requested structure
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE users;
TRUNCATE TABLE departments;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Departments
INSERT INTO departments (dept_id, dept_name, description) VALUES
('D000', 'Admin', 'Administration and Management'),
('D001', 'IT Infrastructure', 'IT Infrastructure and Core Services'),
('D002', 'Software Development', 'Software and Web Development'),
('D003', 'Network & Security', 'Network Infrastructure and Cybersecurity'),
('D004', 'Technical Support', 'Technical support and hardware maintenance'),
('D005', 'Database Administration', 'Database design and optimization');

-- 2. Users (38 Total)
-- Admin Password Hash for 'password123'
SET @pwd = '$2a$10$TWz9N3Io1I/bkQq2Oic.f.gvUYMJ2/gtUsWuY.sN4znm5I63p2nKO';

-- Admins (3)
INSERT INTO users (user_id, firstname, lastname, email, tel, role, password, dept_id, avatar_color) VALUES
('U001', 'สมพงษ์', 'แอดมินใจดี', 'admin1@techjob.th', '080-000-0001', 'admin', @pwd, 'D000', '#3B82F6'),
('U002', 'วิภา', 'เก่งจัดการ', 'admin2@techjob.th', '080-000-0002', 'admin', @pwd, 'D000', '#8B5CF6'),
('U003', 'ชัยยศ', 'สายคุม', 'admin3@techjob.th', '080-000-0003', 'admin', @pwd, 'D000', '#10B981');

-- Managers (10)
INSERT INTO users (user_id, firstname, lastname, email, tel, role, password, dept_id, avatar_color) VALUES
('U004', 'สมาน', 'คุมไอที', 'manager_infra1@techjob.th', '081-001-0001', 'manager', @pwd, 'D001', '#3B82F6'),
('U005', 'วารุณี', 'แม่ทัพไอที', 'manager_infra2@techjob.th', '081-001-0002', 'manager', @pwd, 'D001', '#8B5CF6'),
('U006', 'ธงชัย', 'นำโค้ด', 'manager_soft1@techjob.th', '081-002-0001', 'manager', @pwd, 'D002', '#F59E0B'),
('U007', 'มนตรี', 'คุมโปรเจกต์', 'manager_soft2@techjob.th', '081-002-0002', 'manager', @pwd, 'D002', '#10B981'),
('U008', 'วิรุฬห์', 'กันเน็ต', 'manager_net1@techjob.th', '081-003-0001', 'manager', @pwd, 'D003', '#F43F5E'),
('U009', 'กาญจนา', 'ตรวจสาย', 'manager_net2@techjob.th', '081-003-0002', 'manager', @pwd, 'D003', '#06B6D4'),
('U010', 'เกรียงศักดิ์', 'ซ่อมเก่ง', 'manager_supp1@techjob.th', '081-004-0001', 'manager', @pwd, 'D004', '#EC4899'),
('U011', 'ปราณี', 'ซัพพอร์ตดี', 'manager_supp2@techjob.th', '081-004-0002', 'manager', @pwd, 'D004', '#6366F1'),
('U012', 'สมเกียรติ', 'วางฐานข้อมูล', 'manager_db1@techjob.th', '081-005-0001', 'manager', @pwd, 'D005', '#14B8A6'),
('U013', 'นงลักษณ์', 'คุมคลาวด์', 'manager_db2@techjob.th', '081-005-0002', 'manager', @pwd, 'D005', '#F97316');

-- Technicians (25)
INSERT INTO users (user_id, firstname, lastname, email, tel, role, password, dept_id, avatar_color) VALUES
('U014', 'ชัย', 'ไอที', 'tech_infra1@techjob.th', '082-001-0001', 'technician', @pwd, 'D001', '#3B82F6'),
('U015', 'เอก', 'อินฟรา', 'tech_infra2@techjob.th', '082-001-0002', 'technician', @pwd, 'D001', '#3B82F6'),
('U016', 'ยุทธ', 'สายเคเบิล', 'tech_infra3@techjob.th', '082-001-0003', 'technician', @pwd, 'D001', '#3B82F6'),
('U017', 'ดนัย', 'ฮาร์ดแวร์', 'tech_infra4@techjob.th', '082-001-0004', 'technician', @pwd, 'D001', '#3B82F6'),
('U018', 'ภานุ', 'เซิร์ฟเวอร์', 'tech_infra5@techjob.th', '082-001-0005', 'technician', @pwd, 'D001', '#3B82F6'),
-- D002
('U019', 'พีระ', 'นักเขียนโค้ด', 'tech_soft1@techjob.th', '082-002-0001', 'technician', @pwd, 'D002', '#F59E0B'),
('U020', 'นารี', 'สายเทพ', 'tech_soft2@techjob.th', '082-002-0002', 'technician', @pwd, 'D002', '#F59E0B'),
('U021', 'ประวิทย์', 'บั๊กเคลียร์', 'tech_soft3@techjob.th', '082-002-0003', 'technician', @pwd, 'D002', '#F59E0B'),
('U022', 'มาโนช', 'สายรัน', 'tech_soft4@techjob.th', '082-002-0004', 'technician', @pwd, 'D002', '#F59E0B'),
('U023', 'วิภาดา', 'อัลกอริทึม', 'tech_soft5@techjob.th', '082-002-0005', 'technician', @pwd, 'D002', '#F59E0B'),
-- D003
('U024', 'กวี', 'เน็ตเซฟ', 'tech_net1@techjob.th', '082-003-0001', 'technician', @pwd, 'D003', '#F43F5E'),
('U025', 'อำนาจ', 'เราเต้อ', 'tech_net2@techjob.th', '082-003-0002', 'technician', @pwd, 'D003', '#F43F5E'),
('U026', 'รุ่งนภา', 'ไฟร์วอลล์', 'tech_net3@techjob.th', '082-003-0003', 'technician', @pwd, 'D003', '#F43F5E'),
('U027', 'สาโรจน์', 'เชื่อมต่อ', 'tech_net4@techjob.th', '082-003-0004', 'technician', @pwd, 'D003', '#F43F5E'),
('U028', 'จิตรา', 'อินเทอร์เน็ต', 'tech_net5@techjob.th', '082-003-0005', 'technician', @pwd, 'D003', '#F43F5E'),
-- D004
('U029', 'วรวุฒิ', 'สายซ่อม', 'tech_supp1@techjob.th', '082-004-0001', 'technician', @pwd, 'D004', '#EC4899'),
('U030', 'อนันต์', 'ฟิกซ์อิท', 'tech_supp2@techjob.th', '082-004-0002', 'technician', @pwd, 'D004', '#EC4899'),
('U031', 'สุรชัย', 'แฮนด์ดี้', 'tech_supp3@techjob.th', '082-004-0003', 'technician', @pwd, 'D004', '#EC4899'),
('U032', 'อุบล', 'ดูแลไว', 'tech_supp4@techjob.th', '082-004-0004', 'technician', @pwd, 'D004', '#EC4899'),
('U033', 'บุญเลิศ', 'ช่วยเหลือ', 'tech_supp5@techjob.th', '082-004-0005', 'technician', @pwd, 'D004', '#EC4899'),
-- D005
('U034', 'สิทธิ์', 'สายคิวรี่', 'tech_db1@techjob.th', '082-005-0001', 'technician', @pwd, 'D005', '#14B8A6'),
('U035', 'มณี', 'อินเด็กซ์', 'tech_db2@techjob.th', '082-005-0002', 'technician', @pwd, 'D005', '#14B8A6'),
('U036', 'วิทยา', 'แบ็กอัป', 'tech_db3@techjob.th', '082-005-0003', 'technician', @pwd, 'D005', '#14B8A6'),
('U037', 'นที', 'ฐานแน่น', 'tech_db4@techjob.th', '082-005-0004', 'technician', @pwd, 'D005', '#14B8A6'),
('U038', 'สมศรี', 'รีคัฟเวอรี', 'tech_db5@techjob.th', '082-005-0005', 'technician', @pwd, 'D005', '#14B8A6');
