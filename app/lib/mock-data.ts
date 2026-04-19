// Mock data for all TechJob entities

import { 
  Role as UserRole, 
  JobStatus, 
  Priority, 
  IssueStatus, 
  RequestStatus,
  User,
  Department,
  Job,
  Issue,
  Unit,
  Equipment,
  Request,
  RequestItem,
  Notification,
  EquipmentHistory
} from './types';

// ─── Departments ─────────────────────────────────────────────────────────────
export const departments: Department[] = [
  { dept_id: "D000", dept_name: "Admin", description: "Administration and Management" },
  { dept_id: "D001", dept_name: "IT Infrastructure" },
  { dept_id: "D002", dept_name: "Software Development" },
  { dept_id: "D003", dept_name: "Network & Security" },
  { dept_id: "D004", dept_name: "Technical Support" },
  { dept_id: "D005", dept_name: "Database Administration" },
];

// ─── Users ───────────────────────────────────────────────────────────────────
export const users: User[] = [
  // Admins (3)
  { user_id: "U001", firstname: "สมพงษ์", lastname: "แอดมินใจดี", email: "admin1@techjob.th", tel: "080-000-0001", role: UserRole.ADMIN, dept_id: "D000", avatar_color: "#3B82F6" },
  { user_id: "U002", firstname: "วิภา", lastname: "เก่งจัดการ", email: "admin2@techjob.th", tel: "080-000-0002", role: UserRole.ADMIN, dept_id: "D000", avatar_color: "#8B5CF6" },
  { user_id: "U003", firstname: "ชัยยศ", lastname: "สายคุม", email: "admin3@techjob.th", tel: "080-000-0003", role: UserRole.ADMIN, dept_id: "D000", avatar_color: "#10B981" },

  // Managers (10)
  { user_id: "U004", firstname: "สมาน", lastname: "คุมไอที", email: "manager_infra1@techjob.th", tel: "081-001-0001", role: UserRole.MANAGER, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U005", firstname: "วารุณี", lastname: "แม่ทัพไอที", email: "manager_infra2@techjob.th", tel: "081-001-0002", role: UserRole.MANAGER, dept_id: "D001", avatar_color: "#8B5CF6" },
  { user_id: "U006", firstname: "ธงชัย", lastname: "นำโค้ด", email: "manager_soft1@techjob.th", tel: "081-002-0001", role: UserRole.MANAGER, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U007", firstname: "มนตรี", lastname: "คุมโปรเจกต์", email: "manager_soft2@techjob.th", tel: "081-002-0002", role: UserRole.MANAGER, dept_id: "D002", avatar_color: "#10B981" },
  { user_id: "U008", firstname: "วิรุฬห์", lastname: "กันเน็ต", email: "manager_net1@techjob.th", tel: "081-003-0001", role: UserRole.MANAGER, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U009", firstname: "กาญจนา", lastname: "ตรวจสาย", email: "manager_net2@techjob.th", tel: "081-003-0002", role: UserRole.MANAGER, dept_id: "D003", avatar_color: "#06B6D4" },
  { user_id: "U010", firstname: "เกรียงศักดิ์", lastname: "ซ่อมเก่ง", email: "manager_supp1@techjob.th", tel: "081-004-0001", role: UserRole.MANAGER, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U011", firstname: "ปราณี", lastname: "ซัพพอร์ตดี", email: "manager_supp2@techjob.th", tel: "081-004-0002", role: UserRole.MANAGER, dept_id: "D004", avatar_color: "#6366F1" },
  { user_id: "U012", firstname: "สมเกียรติ", lastname: "วางฐานข้อมูล", email: "manager_db1@techjob.th", tel: "081-005-0001", role: UserRole.MANAGER, dept_id: "D005", avatar_color: "#14B8A6" },
  { user_id: "U013", firstname: "นงลักษณ์", lastname: "คุมคลาวด์", email: "manager_db2@techjob.th", tel: "081-005-0002", role: UserRole.MANAGER, dept_id: "D005", avatar_color: "#F97316" },

  // Technicians (25)
  { user_id: "U014", firstname: "ชัย", lastname: "ไอที", email: "tech_infra1@techjob.th", tel: "082-001-0001", role: UserRole.TECHNICIAN, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U015", firstname: "เอก", lastname: "อินฟรา", email: "tech_infra2@techjob.th", tel: "082-001-0002", role: UserRole.TECHNICIAN, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U016", firstname: "ยุทธ", lastname: "สายเคเบิล", email: "tech_infra3@techjob.th", tel: "082-001-0003", role: UserRole.TECHNICIAN, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U017", firstname: "ดนัย", lastname: "ฮาร์ดแวร์", email: "tech_infra4@techjob.th", tel: "082-001-0004", role: UserRole.TECHNICIAN, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U018", firstname: "ภานุ", lastname: "เซิร์ฟเวอร์", email: "tech_infra5@techjob.th", tel: "082-001-0005", role: UserRole.TECHNICIAN, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U019", firstname: "พีระ", lastname: "นักเขียนโค้ด", email: "tech_soft1@techjob.th", tel: "082-002-0001", role: UserRole.TECHNICIAN, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U020", firstname: "นารี", lastname: "สายเทพ", email: "tech_soft2@techjob.th", tel: "082-002-0002", role: UserRole.TECHNICIAN, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U021", firstname: "ประวิทย์", lastname: "บั๊กเคลียร์", email: "tech_soft3@techjob.th", tel: "082-002-0003", role: UserRole.TECHNICIAN, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U022", firstname: "มาโนช", lastname: "สายรัน", email: "tech_soft4@techjob.th", tel: "082-002-0004", role: UserRole.TECHNICIAN, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U023", firstname: "วิภาดา", lastname: "อัลกอริทึม", email: "tech_soft5@techjob.th", tel: "082-002-0005", role: UserRole.TECHNICIAN, dept_id: "D002", avatar_color: "#F59E0B" },
  { user_id: "U024", firstname: "กวี", lastname: "เน็ตเซฟ", email: "tech_net1@techjob.th", tel: "082-003-0001", role: UserRole.TECHNICIAN, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U025", firstname: "อำนาจ", lastname: "เราเต้อ", email: "tech_net2@techjob.th", tel: "082-003-0002", role: UserRole.TECHNICIAN, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U026", firstname: "รุ่งนภา", lastname: "ไฟร์วอลล์", email: "tech_net3@techjob.th", tel: "082-003-0003", role: UserRole.TECHNICIAN, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U027", firstname: "สาโรจน์", lastname: "เชื่อมต่อ", email: "tech_net4@techjob.th", tel: "082-003-0004", role: UserRole.TECHNICIAN, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U028", firstname: "จิตรา", lastname: "อินเทอร์เน็ต", email: "tech_net5@techjob.th", tel: "082-003-0005", role: UserRole.TECHNICIAN, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U029", firstname: "วรวุฒิ", lastname: "สายซ่อม", email: "tech_supp1@techjob.th", tel: "082-004-0001", role: UserRole.TECHNICIAN, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U030", firstname: "อนันต์", lastname: "ฟิกซ์อิท", email: "tech_supp2@techjob.th", tel: "082-004-0002", role: UserRole.TECHNICIAN, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U031", firstname: "สุรชัย", lastname: "แฮนด์ดี้", email: "tech_supp3@techjob.th", tel: "082-004-0003", role: UserRole.TECHNICIAN, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U032", firstname: "อุบล", lastname: "ดูแลไว", email: "tech_supp4@techjob.th", tel: "082-004-0004", role: UserRole.TECHNICIAN, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U033", firstname: "บุญเลิศ", lastname: "ช่วยเหลือ", email: "tech_supp5@techjob.th", tel: "082-004-0005", role: UserRole.TECHNICIAN, dept_id: "D004", avatar_color: "#EC4899" },
  { user_id: "U034", firstname: "สิทธิ์", lastname: "สายคิวรี่", email: "tech_db1@techjob.th", tel: "082-005-0001", role: UserRole.TECHNICIAN, dept_id: "D005", avatar_color: "#14B8A6" },
  { user_id: "U035", firstname: "มณี", lastname: "อินเด็กซ์", email: "tech_db2@techjob.th", tel: "082-005-0002", role: UserRole.TECHNICIAN, dept_id: "D005", avatar_color: "#14B8A6" },
  { user_id: "U036", firstname: "วิทยา", lastname: "แบ็กอัป", email: "tech_db3@techjob.th", tel: "082-005-0003", role: UserRole.TECHNICIAN, dept_id: "D005", avatar_color: "#14B8A6" },
  { user_id: "U037", firstname: "นที", lastname: "ฐานแน่น", email: "tech_db4@techjob.th", tel: "082-005-0004", role: UserRole.TECHNICIAN, dept_id: "D005", avatar_color: "#14B8A6" },
  { user_id: "U038", firstname: "สมศรี", lastname: "รีคัฟเวอรี", email: "tech_db5@techjob.th", tel: "082-005-0005", role: UserRole.TECHNICIAN, dept_id: "D005", avatar_color: "#14B8A6" },
];

// ─── Jobs ────────────────────────────────────────────────────────────────────
export const jobs: Job[] = [
  { job_id: "J001", job_title: "ติดตั้งระบบ Network ชั้น 3", description: "วางสาย LAN และตั้งค่า Switch สำหรับชั้น 3 อาคาร A", start_date: "2026-03-01", due_date: "2026-03-15", job_priority: Priority.HIGH, job_status: JobStatus.DONE, assigned_user_ids: ["U014", "U015"], lat: 13.7380, lng: 100.5280 },
  { job_id: "J002", job_title: "อัปเกรด Server หลัก", description: "เพิ่ม RAM และเปลี่ยน HDD เป็น SSD สำหรับ Server Production", start_date: "2026-03-10", due_date: "2026-03-20", job_priority: Priority.URGENT, job_status: JobStatus.IN_PROGRESS, assigned_user_ids: ["U014", "U024"], lat: 13.7360, lng: 100.5260 },
];

// ─── Issues ──────────────────────────────────────────────────────────────────
export const issues: Issue[] = [
  { issue_id: "I001", topic: "Internet ขัดข้องชั้น 4", detail: "Internet ไม่สามารถใช้งานได้บริเวณชั้น 4 ทั้งชั้น ตั้งแต่ 09:00 น.", solution: "พบ Switch ชั้น 4 Hang ทำการ Restart แก้ไขได้", status: IssueStatus.RESOLVED, report_date: "2026-03-18", reporter_id: "U014", lat: 13.7400, lng: 100.5290 },
];

// ─── Units ───────────────────────────────────────────────────────────────────
export const units: Unit[] = [
  { unit_id: "UN01", unit_name: "เครื่อง" },
  { unit_id: "UN02", unit_name: "ชุด" },
  { unit_id: "UN03", unit_name: "กล่อง" },
  { unit_id: "UN04", unit_name: "ม้วน" },
  { unit_id: "UN05", unit_name: "อัน" },
];

// ─── Equipment ───────────────────────────────────────────────────────────────
export const equipment: Equipment[] = [
  { equip_id: "E001", name: "Network Switch 24-Port", type_category: "Network", remain_qty: 3, total_qty: 5, unit_id: "UN01" },
];

// ─── Requests ────────────────────────────────────────────────────────────────
export const requestItems: RequestItem[] = [
  { item_id: "RI001", req_id: "R001", equip_id: "E001", qty: 2 },
];

export const requests: Request[] = [
  { req_id: "R001", req_date: "2026-03-10", req_status: RequestStatus.APPROVED, user_id: "U014" },
];

// ─── Notifications ─────────────────────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: "N001", title: "มอบหมายงานใหม่", message: "คุณได้รับมอบหมายงาน J001: ติดตั้งระบบ Network ชั้น 3", timestamp: new Date().toISOString(), is_read: false, related_link: "/jobs" },
];

export const equipmentHistory: EquipmentHistory[] = [
  { id: "H001", equip_id: "E001", date: "2026-03-20", user_id: "U014", action: 'check-out', notes: 'เบิกไปใช้งานที่ IT Dept.' },
];

// ─── Helper functions ─────────────────────────────────────────────────────────
export function getUserById(id: string) {
  return users.find(u => u.user_id === id);
}
export function getDeptById(id: string) {
  return departments.find(d => d.dept_id === id);
}
export function getEquipById(id: string) {
  return equipment.find(e => e.equip_id === id);
}
export function getUnitById(id: string) {
  return units.find(u => u.unit_id === id);
}
export function getItemsByReqId(rid: string) {
  return requestItems.filter(i => i.req_id === rid);
}
export function getUserFullName(id: string) {
  const u = getUserById(id);
  return u ? `${u.firstname} ${u.lastname}` : "—";
}
export function getUserInitials(id: string) {
  const u = getUserById(id);
  return u ? `${u.firstname[0]}${u.lastname[0]}` : "?";
}
export function getUsersInDept(deptId: string) {
  return users.filter(u => u.dept_id === deptId);
}
