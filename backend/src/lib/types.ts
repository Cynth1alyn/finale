export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TECHNICIAN = 'technician',
  USER = 'user',
}

export enum EquipmentStatus {
  ACTIVE = 'active',
  MAINTENANCE = 'maintenance',
  RETIRED = 'retired',
  BROKEN = 'broken',
}

export enum IssueStatus {
  OPEN = 'open',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export enum JobStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled',
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
  role: Role | string;
  dept_id: string;
  avatar_color?: string;
}

export interface Department {
  dept_id: string;
  dept_name: string;
}

export interface Equipment {
  equip_id: string;
  equip_name: string;
  brand: string;
  model: string;
  serial_no: string;
  dept_id: string;
  status: EquipmentStatus | string;
  remain_qty: number;
}

export interface Issue {
  issue_id: string;
  topic: string;
  detail: string;
  solution: string;
  status: IssueStatus | string;
  report_date: string;
  reporter_id: string;
  lat?: number;
  lng?: number;
}

export interface Job {
  job_id: string;
  job_title: string;
  description: string;
  start_date: string;
  due_date: string;
  priority: Priority | string;
  job_status: JobStatus | string;
  assigned_user_ids: string[];
}

export interface RequestItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export interface Request {
  req_id: string;
  req_title: string;
  req_status: RequestStatus | string;
  items?: RequestItem[];
}

export interface EquipmentHistory {
  id: string;
  equip_id: string;
  date: string;
  user_id: string;
  action: 'check-out' | 'check-in' | 'maintenance' | 'repair' | 'retired' | string;
  notes: string;
}
