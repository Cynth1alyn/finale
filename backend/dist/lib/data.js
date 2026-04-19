"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentHistory = exports.requests = exports.jobs = exports.issues = exports.equipment = exports.users = exports.departments = exports.units = void 0;
const types_1 = require("./types");
exports.units = [
    { unit_id: "UN01", unit_name: "เครื่อง", description: "เครื่องคอมพิวเตอร์/อุปกรณ์หลัก" },
    { unit_id: "UN02", unit_name: "ชิ้น", description: "อุปกรณ์ย่อย/อะไหล่" },
    { unit_id: "UN03", unit_name: "แผ่น", description: "ซอฟต์แวร์/หน้าจอ" },
    { unit_id: "UN04", unit_name: "ชุด", description: "อุปกรณ์ที่มาเป็นเซ็ต" },
];
exports.departments = [
    { dept_id: "D001", dept_name: "IT Infrastructure" },
    { dept_id: "D002", dept_name: "Software Development" },
    { dept_id: "D003", dept_name: "Network & Security" },
    { dept_id: "D004", dept_name: "Technical Support" },
    { dept_id: "D005", dept_name: "Database Administration" },
];
exports.users = [
    { user_id: "U001", firstname: "Admin", lastname: "System", email: "admin@techjob.th", tel: "080-000-0000", role: types_1.Role.ADMIN, password: "$2a$10$TWz9N3Io1I/bkQq2Oic.f.gvUYMJ2/gtUsWuY.sN4znm5I63p2nKO", dept_id: "D001", avatar_color: "#3B82F6" },
    { user_id: "U002", firstname: "ธนาวุฒิ", lastname: "แสงจันทร์", email: "thanawut@techjob.th", tel: "081-234-5678", role: types_1.Role.ADMIN, password: "$2a$10$TWz9N3Io1I/bkQq2Oic.f.gvUYMJ2/gtUsWuY.sN4znm5I63p2nKO", dept_id: "D001", avatar_color: "#3B82F6" },
    { user_id: "U003", firstname: "สุภาพร", lastname: "วงศ์ตระกูล", email: "supaporn@techjob.th", tel: "082-345-6789", role: types_1.Role.MANAGER, password: "$2a$10$TWz9N3Io1I/bkQq2Oic.f.gvUYMJ2/gtUsWuY.sN4znm5I63p2nKO", dept_id: "D002", avatar_color: "#8B5CF6" },
    { user_id: "U004", firstname: "สมชาย", lastname: "ใจดี", email: "technician@techjob.th", tel: "083-456-7890", role: types_1.Role.TECHNICIAN, password: "$2a$10$TWz9N3Io1I/bkQq2Oic.f.gvUYMJ2/gtUsWuY.sN4znm5I63p2nKO", dept_id: "D004", avatar_color: "#F59E0B" },
    { user_id: "U005", firstname: "มานี", lastname: "มีนา", email: "staff@techjob.th", tel: "084-567-8901", role: types_1.Role.STAFF, password: "$2a$10$TWz9N3Io1I/bkQq2Oic.f.gvUYMJ2/gtUsWuY.sN4znm5I63p2nKO", dept_id: "D005", avatar_color: "#10B981" },
];
exports.equipment = [
    { equip_id: "E001", name: "MacBook Pro 14", type_category: "Laptop", total_qty: 10, remain_qty: 5, unit_id: "UN01", dept_id: "D002", status: types_1.EquipmentStatus.OPERATIONAL },
    { equip_id: "E002", name: "Dell UltraSharp 27", type_category: "Monitor", total_qty: 15, remain_qty: 12, unit_id: "UN01", dept_id: "D001", status: types_1.EquipmentStatus.OPERATIONAL },
];
exports.issues = [
    { issue_id: "I001", topic: "Internet ขัดข้องชั้น 4", detail: "Internet ไม่สามารถใช้งานได้บริเวณชั้น 4 ทั้งชั้น ตั้งแต่ 09:00 น.", solution: "Reset Switch", status: types_1.IssueStatus.RESOLVED, report_date: "2026-03-18", reporter_id: "U001" },
];
exports.jobs = [
    { job_id: "J001", job_title: "ติดตั้งระบบ Network ชั้น 3", description: "วางสาย LAN และตั้งค่า Switch", start_date: "2026-03-01", due_date: "2026-03-15", job_priority: types_1.Priority.HIGH, job_status: types_1.JobStatus.DONE, assigned_user_ids: ["U001"] },
];
exports.requests = [
    { req_id: "R001", req_date: "2026-03-10", req_status: types_1.RequestStatus.PENDING, user_id: "U001", items: [{ item_id: "RI001", req_id: "R001", equip_id: "E001", qty: 2 }] }
];
exports.equipmentHistory = [
    { id: "H001", equip_id: "E001", date: "2026-03-20", user_id: "U003", action: 'check-out', notes: 'เบิกไปใช้งานที่ Software Dept.' },
    { id: "H002", equip_id: "E001", date: "2026-03-22", user_id: "U003", action: 'maintenance', notes: 'อัปเดตระบบปฏิบัติการ' },
    { id: "H003", equip_id: "E002", date: "2026-03-15", user_id: "U002", action: 'check-in', notes: 'ส่งคืนหลังเลิกใช้งาน' },
];
