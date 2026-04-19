import { User, Department, Equipment, Issue, Job, Request, Role, EquipmentStatus, IssueStatus, JobStatus, RequestStatus, Priority, EquipmentHistory, Unit, Notification } from './types';

export const departments: Department[] = [
  { dept_id: "D000", dept_name: "Admin", description: "Administration and Management" },
  { dept_id: "D001", dept_name: "IT Infrastructure" },
  { dept_id: "D002", dept_name: "Software Development" },
  { dept_id: "D003", dept_name: "Network & Security" },
  { dept_id: "D004", dept_name: "Technical Support", description: "Technical support and hardware maintenance" },
  { dept_id: "D005", dept_name: "Database Administration", description: "Database design and optimization" },
];

export const units: Unit[] = [
  { unit_id: "UN01", unit_name: "ชิ้น", description: "หน่วยนับเป็นชิ้น" },
  { unit_id: "UN02", unit_name: "เครื่อง", description: "หน่วยนับเป็นเครื่อง" },
  { unit_id: "UN03", unit_name: "ชุด", description: "หน่วยนับเป็นชุด" },
  { unit_id: "UN04", unit_name: "อัน", description: "หน่วยนับเป็นอัน" },
];

const pwdHash = "$2a$10$TWz9N3Io1I/bkQq2Oic.f.gvUYMJ2/gtUsWuY.sN4znm5I63p2nKO"; // password123

export const users: User[] = [
  // Admins (3)
  { user_id: "U001", firstname: "สมพงษ์", lastname: "แอดมินใจดี", email: "admin1@techjob.th", tel: "080-000-0001", role: Role.ADMIN, password: pwdHash, dept_id: "D000", avatar_color: "#3B82F6" },
  { user_id: "U002", firstname: "วิภา", lastname: "เก่งจัดการ", email: "admin2@techjob.th", tel: "080-000-0002", role: Role.ADMIN, password: pwdHash, dept_id: "D000", avatar_color: "#8B5CF6" },
  { user_id: "U003", firstname: "ชัยยศ", lastname: "สายคุม", email: "admin3@techjob.th", tel: "080-000-0003", role: Role.ADMIN, password: pwdHash, dept_id: "D000", avatar_color: "#10B981" },

  // Managers (10) - 2 per technical dept
  { user_id: "U004", firstname: "สมาน", lastname: "คุมไอที", email: "manager_infra1@techjob.th", tel: "081-001-0001", role: Role.MANAGER, password: pwdHash, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U005", firstname: "วารุณี", lastname: "แม่ทัพไอที", email: "manager_infra2@techjob.th", tel: "081-001-0002", role: Role.MANAGER, password: pwdHash, dept_id: "D001", avatar_color: "#8B5CF6" },
  { user_id: "U006", firstname: "ธงชัย", lastname: "นำโค้ด", email: "manager_soft1@techjob.th", tel: "081-002-0001", role: Role.MANAGER, password: pwdHash, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U007", firstname: "มนตรี", lastname: "คุมโปรเจกต์", email: "manager_soft2@techjob.th", tel: "081-002-0002", role: Role.MANAGER, password: pwdHash, dept_id: "D002", avatar_color: "#10B981" },
  { user_id: "U008", firstname: "วิรุฬห์", lastname: "กันเน็ต", email: "manager_net1@techjob.th", tel: "081-003-0001", role: Role.MANAGER, password: pwdHash, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U009", firstname: "กาญจนา", lastname: "ตรวจสาย", email: "manager_net2@techjob.th", tel: "081-003-0002", role: Role.MANAGER, password: pwdHash, dept_id: "D003", avatar_color: "#06B6D4" },
  { user_id: "U010", firstname: "เกรียงศักดิ์", lastname: "ซ่อมเก่ง", email: "manager_supp1@techjob.th", tel: "081-004-0001", role: Role.MANAGER, password: pwdHash, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U011", firstname: "ปราณี", lastname: "ซัพพอร์ตดี", email: "manager_supp2@techjob.th", tel: "081-004-0002", role: Role.MANAGER, password: pwdHash, dept_id: "D004", avatar_color: "#6366F1" },
  { user_id: "U012", firstname: "สมเกียรติ", lastname: "วางฐานข้อมูล", email: "manager_db1@techjob.th", tel: "081-005-0001", role: Role.MANAGER, password: pwdHash, dept_id: "D005", avatar_color: "#14B8A6" },
  { user_id: "U013", firstname: "นงลักษณ์", lastname: "คุมคลาวด์", email: "manager_db2@techjob.th", tel: "081-005-0002", role: Role.MANAGER, password: pwdHash, dept_id: "D005", avatar_color: "#F97316" },

  // Technicians (25) - 5 per technical dept
  // D001
  { user_id: "U014", firstname: "ชัย", lastname: "ไอที", email: "tech_infra1@techjob.th", tel: "082-001-0001", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U015", firstname: "เอก", lastname: "อินฟรา", email: "tech_infra2@techjob.th", tel: "082-001-0002", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U016", firstname: "ยุทธ", lastname: "สายเคเบิล", email: "tech_infra3@techjob.th", tel: "082-001-0003", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U017", firstname: "ดนัย", lastname: "ฮาร์ดแวร์", email: "tech_infra4@techjob.th", tel: "082-001-0004", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U018", firstname: "ภานุ", lastname: "เซิร์ฟเวอร์", email: "tech_infra5@techjob.th", tel: "082-001-0005", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D001", avatar_color: "#3B82F6" },
  // D002
  { user_id: "U019", firstname: "พีระ", lastname: "นักเขียนโค้ด", email: "tech_soft1@techjob.th", tel: "082-002-0001", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U020", firstname: "นารี", lastname: "สายเทพ", email: "tech_soft2@techjob.th", tel: "082-002-0002", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U021", firstname: "ประวิทย์", lastname: "บั๊กเคลียร์", email: "tech_soft3@techjob.th", tel: "082-002-0003", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U022", firstname: "มาโนช", lastname: "สายรัน", email: "tech_soft4@techjob.th", tel: "082-002-0004", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U023", firstname: "วิภาดา", lastname: "อัลกอริทึม", email: "tech_soft5@techjob.th", tel: "082-002-0005", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D002", avatar_color: "#F59E0B" },
  // D003
  { user_id: "U024", firstname: "กวี", lastname: "เน็ตเซฟ", email: "tech_net1@techjob.th", tel: "082-003-0001", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U025", firstname: "อำนาจ", lastname: "เราเต้อ", email: "tech_net2@techjob.th", tel: "082-003-0002", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U026", firstname: "รุ่งนภา", lastname: "ไฟร์วอลล์", email: "tech_net3@techjob.th", tel: "082-003-0003", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U027", firstname: "สาโรจน์", lastname: "เชื่อมต่อ", email: "tech_net4@techjob.th", tel: "082-003-0004", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U028", firstname: "จิตรา", lastname: "อินเทอร์เน็ต", email: "tech_net5@techjob.th", tel: "082-003-0005", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D003", avatar_color: "#F43F5E" },
  // D004
  { user_id: "U029", firstname: "วรวุฒิ", lastname: "สายซ่อม", email: "tech_supp1@techjob.th", tel: "082-004-0001", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U030", firstname: "อนันต์", lastname: "ฟิกซ์อิท", email: "tech_supp2@techjob.th", tel: "082-004-0002", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U031", firstname: "สุรชัย", lastname: "แฮนด์ดี้", email: "tech_supp3@techjob.th", tel: "082-004-0003", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U032", firstname: "อุบล", lastname: "ดูแลไว", email: "tech_supp4@techjob.th", tel: "082-004-0004", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U033", firstname: "บุญเลิศ", lastname: "ช่วยเหลือ", email: "tech_supp5@techjob.th", tel: "082-004-0005", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D004", avatar_color: "#EC4899" },
  // D005
  { user_id: "U034", firstname: "สิทธิ์", lastname: "สายคิวรี่", email: "tech_db1@techjob.th", tel: "082-005-0001", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D005", avatar_color: "#14B8A6" },
  { user_id: "U035", firstname: "มณี", lastname: "อินเด็กซ์", email: "tech_db2@techjob.th", tel: "082-005-0002", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D005", avatar_color: "#14B8A6" },
  { user_id: "U036", firstname: "วิทยา", lastname: "แบ็กอัป", email: "tech_db3@techjob.th", tel: "082-005-0003", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D005", avatar_color: "#14B8A6" },
  { user_id: "U037", firstname: "นที", lastname: "ฐานแน่น", email: "tech_db4@techjob.th", tel: "082-005-0004", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D005", avatar_color: "#14B8A6" },
  { user_id: "U038", firstname: "สมศรี", lastname: "รีคัฟเวอรี", email: "tech_db5@techjob.th", tel: "082-005-0005", role: Role.TECHNICIAN, password: pwdHash, dept_id: "D005", avatar_color: "#14B8A6" },
];

export const equipment: Equipment[] = [
  { equip_id: "E001", name: "MacBook Pro 14", type_category: "Laptop", total_qty: 10, remain_qty: 5, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E002", name: "Dell UltraSharp 27", type_category: "Monitor", total_qty: 15, remain_qty: 12, unit_id: "UN02", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E003", name: "Logitech MX Master 3", type_category: "Mouse", total_qty: 30, remain_qty: 25, unit_id: "UN01", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E004", name: "Keychron K8", type_category: "Keyboard", total_qty: 20, remain_qty: 18, unit_id: "UN01", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E005", name: "Cisco Catalyst 2960", type_category: "Network Switch", total_qty: 5, remain_qty: 5, unit_id: "UN02", dept_id: "D003", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E006", name: "HP LaserJet ProM404", type_category: "Printer", total_qty: 8, remain_qty: 7, unit_id: "UN02", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E007", name: "Dell PowerEdge R740", type_category: "Server", total_qty: 3, remain_qty: 3, unit_id: "UN02", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E008", name: "Lenovo ThinkPad X1", type_category: "Laptop", total_qty: 15, remain_qty: 10, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E009", name: "Ubiquiti UniFi AP", type_category: "Access Point", total_qty: 25, remain_qty: 20, unit_id: "UN02", dept_id: "D003", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E010", name: "Epson EcoTank L3150", type_category: "Printer", total_qty: 10, remain_qty: 8, unit_id: "UN02", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E011", name: "Asus ROG Strix", type_category: "Laptop", total_qty: 5, remain_qty: 5, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E012", name: "Samsung Odyssey G7", type_category: "Monitor", total_qty: 12, remain_qty: 10, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E013", name: "Razer DeathAdder V2", type_category: "Mouse", total_qty: 25, remain_qty: 20, unit_id: "UN01", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E014", name: "Corsair K95 RGB", type_category: "Keyboard", total_qty: 15, remain_qty: 12, unit_id: "UN01", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E015", name: "Fortinet FortiGate", type_category: "Firewall", total_qty: 4, remain_qty: 4, unit_id: "UN02", dept_id: "D003", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E016", name: "Zebra ZD420", type_category: "Barcode Printer", total_qty: 10, remain_qty: 9, unit_id: "UN02", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E017", name: "HPE ProLiant DL380", type_category: "Server", total_qty: 5, remain_qty: 5, unit_id: "UN02", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E018", name: "Microtik RouterBoard", type_category: "Router", total_qty: 10, remain_qty: 8, unit_id: "UN02", dept_id: "D003", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E019", name: "APC Smart-UPS", type_category: "UPS", total_qty: 20, remain_qty: 18, unit_id: "UN02", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E020", name: "Synology DiskStation", type_category: "NAS", total_qty: 6, remain_qty: 6, unit_id: "UN02", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E021", name: "Apple iPad Pro", type_category: "Tablet", total_qty: 15, remain_qty: 14, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E022", name: "Microsoft Surface Pro", type_category: "Tablet", total_qty: 10, remain_qty: 8, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E023", name: "Logitech Brio 4K", type_category: "Webcam", total_qty: 30, remain_qty: 28, unit_id: "UN01", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E024", name: "Jabra Speak 710", type_category: "Speakerphone", total_qty: 12, remain_qty: 10, unit_id: "UN01", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E025", name: "Sony WH-1000XM4", type_category: "Headset", total_qty: 20, remain_qty: 18, unit_id: "UN01", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E026", name: "LG 27GN950-B", type_category: "Monitor", total_qty: 10, remain_qty: 10, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E027", name: "BenQ PD2700U", type_category: "Monitor", total_qty: 8, remain_qty: 7, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E028", name: "Ergotron Monitor Arm", type_category: "Accessory", total_qty: 40, remain_qty: 35, unit_id: "UN01", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E029", name: "Secretlab Titan", type_category: "Chair", total_qty: 50, remain_qty: 45, unit_id: "UN01", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E030", name: "IKEA Bekant Desk", type_category: "Desk", total_qty: 50, remain_qty: 48, unit_id: "UN01", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E031", name: "Netgear Nighthawk", type_category: "Router", total_qty: 5, remain_qty: 5, unit_id: "UN02", dept_id: "D003", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E032", name: "Crucial MX500 1TB", type_category: "Storage", total_qty: 40, remain_qty: 38, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E033", name: "Samsung 970 EVO", type_category: "Storage", total_qty: 30, remain_qty: 28, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E034", name: "Kingston 16GB DDR4", type_category: "Memory", total_qty: 60, remain_qty: 55, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E035", name: "Corsair Vengeance 32GB", type_category: "Memory", total_qty: 40, remain_qty: 40, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E036", name: "Intel Core i7-12700K", type_category: "Processor", total_qty: 15, remain_qty: 15, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E037", name: "AMD Ryzen 9 5900X", type_category: "Processor", total_qty: 10, remain_qty: 9, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E038", name: "NVIDIA RTX 3080", type_category: "Graphics Card", total_qty: 8, remain_qty: 7, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E039", name: "ASUS TUF Gaming Board", type_category: "Motherboard", total_qty: 12, remain_qty: 10, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E040", name: "Seasonic Focus 750W", type_category: "Power Supply", total_qty: 20, remain_qty: 19, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E041", name: "Noctua NH-D15", type_category: "Cooler", total_qty: 15, remain_qty: 14, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E042", name: "APC Back-UPS 600", type_category: "UPS", total_qty: 25, remain_qty: 24, unit_id: "UN02", dept_id: "D001", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E043", name: "TP-Link 24-Port Switch", type_category: "Network Switch", total_qty: 8, remain_qty: 8, unit_id: "UN02", dept_id: "D003", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E044", name: "Cat6 Ethernet Cable", type_category: "Cable", total_qty: 10, remain_qty: 9, unit_id: "UN01", dept_id: "D003", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E045", name: "HDMI Cable 2m", type_category: "Cable", total_qty: 100, remain_qty: 95, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E046", name: "DisplayPort Cable 2m", type_category: "Cable", total_qty: 50, remain_qty: 48, unit_id: "UN01", dept_id: "D004", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E047", name: "Google Pixel 7a", type_category: "Smartphone", total_qty: 10, remain_qty: 10, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E048", name: "iPhone 14 Pro", type_category: "Smartphone", total_qty: 5, remain_qty: 5, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E049", name: "Wacom Intuos Pro", type_category: "Drawing Tablet", total_qty: 4, remain_qty: 4, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E050", name: "Raspberry Pi 4", type_category: "Microcomputer", total_qty: 20, remain_qty: 18, unit_id: "UN02", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E051", name: "Arduino Uno R3", type_category: "Microcontroller", total_qty: 30, remain_qty: 30, unit_id: "UN01", dept_id: "D002", status: EquipmentStatus.OPERATIONAL },
  { equip_id: "E052", name: "Fluke 115 Multimeter", type_category: "Tool", total_qty: 5, remain_qty: 5, unit_id: "UN02", dept_id: "D004", status: EquipmentStatus.OPERATIONAL }
];

export const issues: Issue[] = [
  { issue_id: "I001", topic: "Internet ขัดข้องชั้น 4", detail: "Internet ไม่สามารถใช้งานได้บริเวณชั้น 4 ทั้งชั้น ตั้งแต่ 09:00 น.", solution: "Reset Switch", status: IssueStatus.RESOLVED, report_date: "2026-03-18", reporter_id: "U014" },
];

export const jobs: Job[] = [
  { 
    job_id: "J001", 
    job_title: "ติดตั้งระบบ Network ชั้น 3", 
    description: "วางสาย LAN และตั้งค่า Switch อาคาร A", 
    start_date: "2026-03-01", 
    due_date: "2026-03-15", 
    job_priority: Priority.HIGH, 
    job_status: JobStatus.DONE, 
    assigned_lead_id: "U004",
    assigned_user_ids: ["U014", "U015"] 
  },
  { 
    job_id: "J002", 
    job_title: "ซ่อมแซม Server ห้อง Data Center", 
    description: "ตรวจสอบระบบระบายความร้อน และเปลี่ยน HDD", 
    start_date: "2026-04-01", 
    due_date: "2026-04-05", 
    job_priority: Priority.URGENT, 
    job_status: JobStatus.IN_PROGRESS, 
    assigned_lead_id: "U004",
    assigned_user_ids: ["U016"] 
  },
  { 
    job_id: "J003", 
    job_title: "ตรวจสอบความปลอดภัยประตู", 
    description: "ทดสอบการเข้าถึงด้วย Keycard", 
    start_date: "2026-04-10", 
    due_date: "2026-04-12", 
    job_priority: Priority.LOW, 
    job_status: JobStatus.PENDING, 
    assigned_lead_id: "U001",
    assigned_user_ids: ["U014"] 
  },
];

export const requests: Request[] = [
  { req_id: "R001", req_date: "2026-03-10", req_status: RequestStatus.PENDING, user_id: "U001", items: [{ item_id: "RI001", req_id: "R001", equip_id: "E001", qty: 2 }] }
];

export const equipmentHistory: EquipmentHistory[] = [
  { id: "H001", equip_id: "E001", date: "2026-03-20", user_id: "U014", action: 'check-out', notes: 'เบิกไปใช้งานที่ IT Dept.' },
  { id: "H002", equip_id: "E001", date: "2026-03-22", user_id: "U014", action: 'maintenance', notes: 'อัปเดตระบบปฏิบัติการ' },
  { id: "H003", equip_id: "E002", date: "2026-03-15", user_id: "U004", action: 'check-in', notes: 'ส่งคืนหลังเลิกใช้งาน' },
];

export const notifications: Notification[] = [];
