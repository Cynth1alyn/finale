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
  { dept_id: "D001", dept_name: "IT Infrastructure" },
  { dept_id: "D002", dept_name: "Software Development" },
  { dept_id: "D003", dept_name: "Network & Security" },
  { dept_id: "D004", dept_name: "Technical Support" },
  { dept_id: "D005", dept_name: "Database Administration" },
];

// ─── Users ───────────────────────────────────────────────────────────────────
export const users: User[] = [
  { user_id: "U001", firstname: "ธนาวุฒิ", lastname: "แสงจันทร์", email: "thanawut@techjob.th", tel: "081-234-5678", role: UserRole.ADMIN, dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U002", firstname: "สุภาพร", lastname: "วงศ์ตระกูล", email: "supaporn@techjob.th", tel: "082-345-6789", role: UserRole.MANAGER, dept_id: "D002", avatar_color: "#8B5CF6" },
  { user_id: "U003", firstname: "กิตติพล", lastname: "ประมวลผล", email: "kittipol@techjob.th", tel: "083-456-7890", role: UserRole.TECHNICIAN, dept_id: "D001", avatar_color: "#10B981" },
  { user_id: "U004", firstname: "นันทวัน", lastname: "ดวงดี", email: "nantawan@techjob.th", tel: "084-567-8901", role: UserRole.TECHNICIAN, dept_id: "D004", avatar_color: "#F59E0B" },
  { user_id: "U005", firstname: "ปรีชา", lastname: "มีสุข", email: "preecha@techjob.th", tel: "085-678-9012", role: UserRole.STAFF, dept_id: "D003", avatar_color: "#F43F5E" },
  { user_id: "U006", firstname: "วิภาวดี", lastname: "รักษ์ศิลป์", email: "wipawadee@techjob.th", tel: "086-789-0123", role: UserRole.MANAGER, dept_id: "D003", avatar_color: "#06B6D4" },
  { user_id: "U007", firstname: "ชัยวัฒน์", lastname: "ยิ้มแย้ม", email: "chaiwat@techjob.th", tel: "087-890-1234", role: UserRole.TECHNICIAN, dept_id: "D005", avatar_color: "#EC4899" },
  { user_id: "U008", firstname: "มาลินี", lastname: "สุขใจ", email: "malinee@techjob.th", tel: "088-901-2345", role: UserRole.STAFF, dept_id: "D002", avatar_color: "#14B8A6" },
  { user_id: "U009", firstname: "ภาณุวัฒน์", lastname: "ทองคำ", email: "panuwat@techjob.th", tel: "089-012-3456", role: UserRole.TECHNICIAN, dept_id: "D004", avatar_color: "#F97316" },
  { user_id: "U010", firstname: "รัตนาวลี", lastname: "บุญมา", email: "rattana@techjob.th", tel: "090-123-4567", role: UserRole.STAFF, dept_id: "D001", avatar_color: "#A855F7" },
];

// ─── Jobs ────────────────────────────────────────────────────────────────────
export const jobs: Job[] = [
  { job_id: "J001", job_title: "ติดตั้งระบบ Network ชั้น 3", description: "วางสาย LAN และตั้งค่า Switch สำหรับชั้น 3 อาคาร A", start_date: "2026-03-01", due_date: "2026-03-15", job_priority: Priority.HIGH, job_status: JobStatus.DONE, assigned_user_ids: ["U003", "U009"], lat: 13.7380, lng: 100.5280 },
  { job_id: "J002", job_title: "อัปเกรด Server หลัก", description: "เพิ่ม RAM และเปลี่ยน HDD เป็น SSD สำหรับ Server Production", start_date: "2026-03-10", due_date: "2026-03-20", job_priority: Priority.URGENT, job_status: JobStatus.IN_PROGRESS, assigned_user_ids: ["U003", "U007"], lat: 13.7360, lng: 100.5260 },
  { job_id: "J003", job_title: "ตรวจสอบ Firewall Rules", description: "รีวิวและอัปเดต Firewall rules ตาม Security Policy ล่าสุด", start_date: "2026-04-12", due_date: "2026-04-25", job_priority: Priority.HIGH, job_status: JobStatus.IN_PROGRESS, assigned_user_ids: ["U006"] },
  { job_id: "J004", job_title: "สำรองข้อมูล Database ประจำเดือน", description: "Backup Database ทั้งหมดและทดสอบการ Restore", start_date: "2026-04-14", due_date: "2026-04-15", job_priority: Priority.MEDIUM, job_status: JobStatus.PENDING, assigned_user_ids: ["U007"] },
  { job_id: "J005", job_title: "พัฒนาระบบแจ้งเตือน Email", description: "สร้าง Email notification service สำหรับแจ้งสถานะงาน", start_date: "2026-04-11", due_date: "2026-04-30", job_priority: Priority.MEDIUM, job_status: JobStatus.IN_PROGRESS, assigned_user_ids: ["U002", "U008"] },
  { job_id: "J006", job_title: "แก้ไข Bug ระบบ Login", description: "สืบสวนและแก้ไข Bug ที่ทำให้ Login ล้มเหลวบางครั้ง", start_date: "2026-04-13", due_date: "2026-04-14", job_priority: Priority.URGENT, job_status: JobStatus.DONE, assigned_user_ids: ["U002"] },
  { job_id: "J007", job_title: "ติดตั้ง CCTV อาคาร B", description: "ติดตั้งกล้อง CCTV จำนวน 12 ตัว พร้อมวาง Cable", start_date: "2026-03-22", due_date: "2026-04-05", job_priority: Priority.LOW, job_status: JobStatus.PENDING, assigned_user_ids: ["U004", "U009"] },
  { job_id: "J008", job_title: "อบรม IT Security ให้พนักงาน", description: "จัดอบรม Cybersecurity awareness สำหรับพนักงาน 50 คน", start_date: "2026-04-01", due_date: "2026-04-03", job_priority: Priority.MEDIUM, job_status: JobStatus.PENDING, assigned_user_ids: ["U006", "U001"] },
  { job_id: "J009", job_title: "ซ่อม Printer ชั้น 2", description: "ตรวจสอบและซ่อม Printer HP LaserJet ที่ print ไม่ออก", start_date: "2026-03-15", due_date: "2026-03-16", job_priority: Priority.LOW, job_status: JobStatus.DONE, assigned_user_ids: ["U004"] },
  { job_id: "J010", job_title: "Setup VPN สำหรับ Remote Work", description: "ตั้งค่า VPN Server รองรับพนักงาน Work from Home", start_date: "2026-03-05", due_date: "2026-03-12", job_priority: Priority.HIGH, job_status: JobStatus.DONE, assigned_user_ids: ["U003", "U006"] },
  { job_id: "J011", job_title: "ย้ายข้อมูล Legacy System", description: "Migrate ข้อมูลจากระบบเก่าไปยัง Cloud Storage", start_date: "2026-04-10", due_date: "2026-04-30", job_priority: Priority.HIGH, job_status: JobStatus.PENDING, assigned_user_ids: ["U002", "U007", "U008"] },
  { job_id: "J012", job_title: "ตรวจเช็ค UPS ห้อง Server", description: "ทดสอบ UPS ทุกเครื่องและเปลี่ยน Battery ที่หมดอายุ", start_date: "2026-03-08", due_date: "2026-03-10", job_priority: Priority.MEDIUM, job_status: JobStatus.DONE, assigned_user_ids: ["U003"] },
  { job_id: "J013", job_title: "พัฒนา Dashboard รายงาน", description: "สร้าง Analytics Dashboard แสดงข้อมูล KPI ฝ่าย IT", start_date: "2026-03-25", due_date: "2026-04-15", job_priority: Priority.MEDIUM, job_status: JobStatus.IN_PROGRESS, assigned_user_ids: ["U002", "U008"] },
  { job_id: "J014", job_title: "แก้ไขปัญหา Internet ขัดข้อง", description: "สืบสวนสาเหตุ Internet drop ช่วงเช้าและหาทางแก้ไข", start_date: "2026-03-19", due_date: "2026-03-20", job_priority: Priority.URGENT, job_status: JobStatus.CANCELLED, assigned_user_ids: ["U005", "U006"] },
  { job_id: "J015", job_title: "จัดทำ IT Asset Register", description: "สำรวจและบันทึกรายการ IT Equipment ทั้งหมดในองค์กร", start_date: "2026-03-17", due_date: "2026-03-28", job_priority: Priority.LOW, job_status: JobStatus.IN_PROGRESS, assigned_user_ids: ["U010"] },
];

// ─── Issues ──────────────────────────────────────────────────────────────────
export const issues: Issue[] = [
  { issue_id: "I001", topic: "Internet ขัดข้องชั้น 4", detail: "Internet ไม่สามารถใช้งานได้บริเวณชั้น 4 ทั้งชั้น ตั้งแต่ 09:00 น.", solution: "พบ Switch ชั้น 4 Hang ทำการ Restart แก้ไขได้", status: IssueStatus.RESOLVED, report_date: "2026-03-18", reporter_id: "U005", lat: 13.7400, lng: 100.5290 },
  { issue_id: "I002", topic: "Printer พิมพ์ไม่ได้", detail: "Printer HP LaserJet M404 ชั้น 2 พิมพ์ไม่ออก แสดง Error Paper Jam", solution: "", status: IssueStatus.OPEN, report_date: "2026-04-14", reporter_id: "U010", lat: 13.7350, lng: 100.5250 },
  { issue_id: "I003", topic: "Email ส่งไม่ออก", detail: "ไม่สามารถส่ง Email ออกไปยัง Domain ภายนอกได้ แต่ส่งภายในองค์กรได้ปกติ", solution: "แก้ไข DNS Record MX และ SPF ให้ถูกต้อง", status: IssueStatus.RESOLVED, report_date: "2026-04-10", reporter_id: "U008" },
  { issue_id: "I004", topic: "PC ค้างบ่อย", detail: "คอมพิวเตอร์ของฝ่าย HR ค้างทุก 30 นาที ต้อง Restart บ่อยมาก", solution: "", status: IssueStatus.IN_PROGRESS, report_date: "2026-04-15", reporter_id: "U005" },
  { issue_id: "I005", topic: "ไฟล์ Server เข้าไม่ได้", detail: "ไม่สามารถ Access File Server \\\\fileserver01 ได้ แสดง Access Denied", solution: "แก้ไข Permission ของ AD Group ให้ถูกต้อง", status: IssueStatus.RESOLVED, report_date: "2026-04-12", reporter_id: "U002" },
  { issue_id: "I006", topic: "Wi-Fi สัญญาณอ่อน", detail: "สัญญาณ Wi-Fi ในห้องประชุม B201 อ่อนมาก ใช้ Video Call ไม่ได้", solution: "", status: IssueStatus.OPEN, report_date: "2026-04-13", reporter_id: "U008" },
  { issue_id: "I007", topic: "ระบบ Login ล้มเหลว", detail: "ผู้ใช้บางรายไม่สามารถ Login เข้าระบบได้ แสดง Authentication Error", solution: "Reset Token การ Authentication แก้ไขปัญหาได้", status: IssueStatus.RESOLVED, report_date: "2026-03-18", reporter_id: "U001" },
  { issue_id: "I008", topic: "Projector ไม่แสดงภาพ", detail: "Projector ห้องประชุมใหญ่เสีย ไม่แสดงสัญญาณจาก Laptop", solution: "", status: IssueStatus.OPEN, report_date: "2026-03-21", reporter_id: "U009" },
  { issue_id: "I009", topic: "Database ช้ามาก", detail: "Query ที่เคยใช้เวลา 2 วิ ตอนนี้ใช้เวลา 30+ วิ ทั้งวัน", solution: "เพิ่ม Index และ Optimize Query แก้ปัญหาได้", status: IssueStatus.RESOLVED, report_date: "2026-03-16", reporter_id: "U007" },
  { issue_id: "I010", topic: "VPN ต่อไม่ได้จากบ้าน", detail: "พนักงาน Work From Home 3 คนต่อ VPN ไม่ได้ตั้งแต่เมื่อวาน", solution: "", status: IssueStatus.IN_PROGRESS, report_date: "2026-03-20", reporter_id: "U006" },
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
  { equip_id: "E002", name: "UTP Cable Cat6", type_category: "Network", remain_qty: 8, total_qty: 20, unit_id: "UN04" },
  { equip_id: "E003", name: "Wireless Access Point", type_category: "Network", remain_qty: 5, total_qty: 10, unit_id: "UN01" },
  { equip_id: "E004", name: 'Monitor 24"', type_category: "Hardware", remain_qty: 2, total_qty: 15, unit_id: "UN01" },
  { equip_id: "E005", name: "Keyboard + Mouse Set", type_category: "Hardware", remain_qty: 12, total_qty: 20, unit_id: "UN02" },
  { equip_id: "E006", name: "UPS 1500VA", type_category: "Hardware", remain_qty: 1, total_qty: 6, unit_id: "UN01" },
  { equip_id: "E007", name: "Laptop Lenovo ThinkPad", type_category: "Hardware", remain_qty: 0, total_qty: 8, unit_id: "UN01" },
  { equip_id: "E008", name: "Printer Toner Cartridge", type_category: "Consumable", remain_qty: 6, total_qty: 10, unit_id: "UN03" },
  { equip_id: "E009", name: "Hard Disk 2TB", type_category: "Storage", remain_qty: 4, total_qty: 10, unit_id: "UN01" },
  { equip_id: "E010", name: "SSD 512GB", type_category: "Storage", remain_qty: 7, total_qty: 12, unit_id: "UN01" },
  { equip_id: "E011", name: "RAM DDR4 16GB", type_category: "Hardware", remain_qty: 10, total_qty: 16, unit_id: "UN05" },
  { equip_id: "E012", name: "Fiber Optic Cable", type_category: "Network", remain_qty: 2, total_qty: 5, unit_id: "UN04" },
  { equip_id: "E013", name: "IP Camera", type_category: "Security", remain_qty: 8, total_qty: 12, unit_id: "UN01" },
  { equip_id: "E014", name: "Network Patch Panel", type_category: "Network", remain_qty: 2, total_qty: 4, unit_id: "UN01" },
  { equip_id: "E015", name: "Server Rack 42U", type_category: "Hardware", remain_qty: 1, total_qty: 2, unit_id: "UN01" },
];

// ─── Requests ────────────────────────────────────────────────────────────────
export const requestItems: RequestItem[] = [
  { item_id: "RI001", req_id: "R001", equip_id: "E001", qty: 2 },
  { item_id: "RI002", req_id: "R001", equip_id: "E002", qty: 3 },
  { item_id: "RI003", req_id: "R002", equip_id: "E004", qty: 1 },
  { item_id: "RI004", req_id: "R002", equip_id: "E005", qty: 2 },
  { item_id: "RI005", req_id: "R003", equip_id: "E008", qty: 4 },
  { item_id: "RI006", req_id: "R004", equip_id: "E009", qty: 2 },
  { item_id: "RI007", req_id: "R004", equip_id: "E010", qty: 3 },
  { item_id: "RI008", req_id: "R005", equip_id: "E003", qty: 2 },
  { item_id: "RI009", req_id: "R006", equip_id: "E011", qty: 4 },
  { item_id: "RI010", req_id: "R007", equip_id: "E006", qty: 1 },
  { item_id: "RI011", req_id: "R008", equip_id: "E013", qty: 4 },
];

export const requests: Request[] = [
  { req_id: "R001", req_date: "2026-03-10", req_status: RequestStatus.APPROVED, user_id: "U003" },
  { req_id: "R002", req_date: "2026-03-12", req_status: RequestStatus.FULFILLED, user_id: "U004" },
  { req_id: "R003", req_date: "2026-03-14", req_status: RequestStatus.PENDING, user_id: "U010" },
  { req_id: "R004", req_date: "2026-03-15", req_status: RequestStatus.APPROVED, user_id: "U007" },
  { req_id: "R005", req_date: "2026-03-17", req_status: RequestStatus.PENDING, user_id: "U009" },
  { req_id: "R006", req_date: "2026-03-18", req_status: RequestStatus.PENDING, user_id: "U003" },
  { req_id: "R007", req_date: "2026-03-19", req_status: RequestStatus.REJECTED, user_id: "U005" },
  { req_id: "R008", req_date: "2026-03-20", req_status: RequestStatus.PENDING, user_id: "U004" },
];

// ─── Notifications ─────────────────────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: "N001", title: "มอบหมายงานใหม่", message: "คุณได้รับมอบหมายงาน J015: จัดทำ IT Asset Register", timestamp: new Date().toISOString(), is_read: false, related_link: "/jobs" },
  { id: "N002", title: "ปัญหาได้รับการแก้ไข", message: "ปัญหา I005: ไฟล์ Server เข้าไม่ได้ ได้รับการแก้ไขแล้ว", timestamp: new Date(Date.now() - 3600000).toISOString(), is_read: false, related_link: "/issues/I005" },
  { id: "N003", title: "คำขอถูกอนุมัติ", message: "คำขอเบิกอุปกรณ์ R001 ของคุณได้รับการอนุมัติ", timestamp: new Date(Date.now() - 86400000).toISOString(), is_read: true, related_link: "/requests/R001" },
];

export const equipmentHistory: EquipmentHistory[] = [
  { id: "H001", equip_id: "E001", date: "2026-03-20", user_id: "U001", action: 'check-out', notes: 'เบิกไปใช้งานที่ Software Dept.' },
  { id: "H002", equip_id: "E001", date: "2026-03-22", user_id: "U001", action: 'maintenance', notes: 'อัปเดตระบบปฏิบัติการ' },
  { id: "H003", equip_id: "E002", date: "2026-03-15", user_id: "U002", action: 'check-in', notes: 'ส่งคืนหลังเลิกใช้งาน' },
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
