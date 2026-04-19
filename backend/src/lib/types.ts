export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TECHNICIAN = 'technician',
  USER = 'user',
}

export enum EquipmentStatus {
  OPERATIONAL = 'operational',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out-of-order',
  DECOMMISSIONED = 'decommissioned',
}

export enum IssueStatus {
  OPEN = 'open',
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
  password?: string;
  avatar_color?: string;
  last_login?: string;
  password_changed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Department {
  dept_id: string;
  dept_name: string;
  description?: string;
}

export interface Unit {
  unit_id: string;
  unit_name: string;
  description?: string;
}

export interface Equipment {
  equip_id: string;
  name: string;
  type_category: string;
  total_qty: number;
  remain_qty: number;
  unit_id: string;
  dept_id?: string;
  status?: EquipmentStatus | string;
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
  job_priority: Priority | string;
  job_status: JobStatus | string;
  assigned_user_ids: string[];
  lat?: number;
  lng?: number;
  customer_name?: string;
  contact_number?: string;
  address?: string;
  landmark?: string;
  assigned_lead_id?: string;
  equipment_requests?: { equip_id: string; qty: number }[];
}

export interface RequestItem {
  item_id: string;
  req_id: string;
  equip_id: string;
  qty: number;
}

export interface Request {
  req_id: string;
  req_date: string;
  req_status: RequestStatus | string;
  user_id: string;
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

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  related_link?: string;
}
