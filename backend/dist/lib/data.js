"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentHistory = exports.requests = exports.jobs = exports.issues = exports.equipment = exports.users = exports.departments = void 0;
const types_1 = require("./types");
exports.departments = [
    { dept_id: "D001", dept_name: "IT Infrastructure" },
    { dept_id: "D002", dept_name: "Software Development" },
    { dept_id: "D003", dept_name: "Network & Security" },
    { dept_id: "D004", dept_name: "Technical Support" },
    { dept_id: "D005", dept_name: "Database Administration" },
];
exports.users = [
    { user_id: "U001", firstname: "ธนาวุฒิ", lastname: "แสงจันทร์", email: "thanawut@techjob.th", tel: "081-234-5678", role: types_1.Role.ADMIN, dept_id: "D001", avatar_color: "#3B82F6" },
    { user_id: "U002", firstname: "สุภาพร", lastname: "วงศ์ตระกูล", email: "supaporn@techjob.th", tel: "082-345-6789", role: types_1.Role.MANAGER, dept_id: "D002", avatar_color: "#8B5CF6" },
];
exports.equipment = [
    { equip_id: "E001", equip_name: "MacBook Pro 14", brand: "Apple", model: "M2 Pro", serial_no: "SN123456", dept_id: "D002", status: types_1.EquipmentStatus.ACTIVE, remain_qty: 5 },
    { equip_id: "E002", equip_name: "Dell UltraSharp 27", brand: "Dell", model: "U2723QE", serial_no: "SN789012", dept_id: "D001", status: types_1.EquipmentStatus.ACTIVE, remain_qty: 12 },
];
exports.issues = [
    { issue_id: "I001", topic: "Internet ขัดข้องชั้น 4", detail: "Internet ไม่สามารถใช้งานได้บริเวณชั้น 4 ทั้งชั้น ตั้งแต่ 09:00 น.", solution: "Reset Switch", status: types_1.IssueStatus.RESOLVED, report_date: "2026-03-18", reporter_id: "U005" },
];
exports.jobs = [
    { job_id: "J001", job_title: "ติดตั้งระบบ Network ชั้น 3", description: "วางสาย LAN และตั้งค่า Switch", start_date: "2026-03-01", due_date: "2026-03-15", priority: types_1.Priority.HIGH, job_status: types_1.JobStatus.DONE, assigned_user_ids: ["U003"] },
];
exports.requests = [
    { req_id: "R001", req_title: "ขอเบิกเมาส์และคีย์บอร์ด", req_status: types_1.RequestStatus.PENDING, items: [{ id: "ITM001", name: "Mouse Wireless", quantity: 2, unit: "ชิ้น" }] }
];
exports.equipmentHistory = [
    { id: "H001", equip_id: "E001", date: "2026-03-20", user_id: "U003", action: 'check-out', notes: 'เบิกไปใช้งานที่ Software Dept.' },
    { id: "H002", equip_id: "E001", date: "2026-03-22", user_id: "U003", action: 'maintenance', notes: 'อัปเดตระบบปฏิบัติการ' },
    { id: "H003", equip_id: "E002", date: "2026-03-15", user_id: "U002", action: 'check-in', notes: 'ส่งคืนหลังเลิกใช้งาน' },
];
