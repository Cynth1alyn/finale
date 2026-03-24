// Shared data store for Backend (Mocking a DB)
import { User, Department, Equipment, Issue, Job, Request } from './types';

export let departments: Department[] = [
  { dept_id: "D001", dept_name: "IT Infrastructure" },
  { dept_id: "D002", dept_name: "Software Development" },
  { dept_id: "D003", dept_name: "Network & Security" },
  { dept_id: "D004", dept_name: "Technical Support" },
  { dept_id: "D005", dept_name: "Database Administration" },
];

export let users: User[] = [
  { user_id: "U001", firstname: "ธนาวุฒิ", lastname: "แสงจันทร์", email: "thanawut@techjob.th", tel: "081-234-5678", role: "admin", dept_id: "D001", avatar_color: "#3B82F6" },
  { user_id: "U002", firstname: "สุภาพร", lastname: "วงศ์ตระกูล", email: "supaporn@techjob.th", tel: "082-345-6789", role: "manager", dept_id: "D002", avatar_color: "#8B5CF6" },
];

export let equipment: Equipment[] = [
  { equip_id: "E001", equip_name: "MacBook Pro 14", brand: "Apple", model: "M2 Pro", serial_no: "SN123456", dept_id: "D002", status: "active", remain_qty: 5 },
  { equip_id: "E002", equip_name: "Dell UltraSharp 27", brand: "Dell", model: "U2723QE", serial_no: "SN789012", dept_id: "D001", status: "active", remain_qty: 12 },
];

export let issues: Issue[] = [
  { issue_id: "I001", topic: "Internet ขัดข้องชั้น 4", detail: "Internet ไม่สามารถใช้งานได้บริเวณชั้น 4 ทั้งชั้น ตั้งแต่ 09:00 น.", solution: "Reset Switch", status: "resolved", report_date: "2026-03-18", reporter_id: "U005" },
];

export let jobs: Job[] = [
  { job_id: "J001", job_title: "ติดตั้งระบบ Network ชั้น 3", description: "วางสาย LAN และตั้งค่า Switch", start_date: "2026-03-01", due_date: "2026-03-15", job_priority: "high", job_status: "done", assigned_user_ids: ["U003"] },
];

export let requests: Request[] = [];
