// API Types for TechJob Application

export enum Role {
  ADMIN = 'admin',
  MANAGER = 'manager',
  TECHNICIAN = 'technician'
}

export enum JobStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in-progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export enum EquipmentStatus {
  OPERATIONAL = 'operational',
  MAINTENANCE = 'maintenance',
  OUT_OF_ORDER = 'out-of-order',
  DECOMMISSIONED = 'decommissioned'
}

export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

// User Types
export interface User {
  user_id: string
  firstname: string
  lastname: string
  email: string
  tel: string
  role: Role
  dept_id: string
  avatar_color: string
}

// Department Types
export interface Department {
  dept_id: string
  dept_name: string
  description?: string
}

// Equipment Types
export interface Equipment {
  equip_id: string
  name: string
  type_category: string
  remain_qty: number
  total_qty: number
  unit_id: string
  dept_id?: string
}

// Issue Types
export interface Issue {
  issue_id: string
  topic: string
  detail: string
  solution: string
  status: IssueStatus
  report_date: string
  reporter_id: string
  lat?: number
  lng?: number
}

// Job Types
export interface Job {
  job_id: string
  job_title: string
  description: string
  start_date: string
  due_date: string
  job_priority: Priority
  job_status: JobStatus
  assigned_user_ids: string[]
  lat?: number
  lng?: number
  customer_name?: string
  contact_number?: string
  address?: string
  landmark?: string
  assigned_lead_id?: string
  equipment_requests?: { equip_id: string; qty: number }[]
}

// Request Types
export interface RequestItem {
  item_id: string
  req_id: string
  equip_id: string
  qty: number
}

export interface Request {
  req_id: string
  req_date: string
  req_status: RequestStatus
  user_id: string
  items?: RequestItem[]
}

// Unit Types
export interface Unit {
  unit_id: string
  unit_name: string
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  timestamp: string
  is_read: boolean
  related_link?: string
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number
  activeJobs: number
  openIssues: number
  totalEquipment: number
  totalDepartments: number
  pendingRequests: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
  message?: string
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
}

// Pagination Types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Filter Types
export interface UserFilters {
  role?: Role
  departmentId?: string
  isActive?: boolean
  search?: string
}

export interface EquipmentFilters {
  status?: EquipmentStatus
  departmentId?: string
  type?: string
}

export interface IssueFilters {
  status?: IssueStatus
  priority?: Priority
  departmentId?: string
  technicianId?: string
}

export interface JobFilters {
  status?: JobStatus
  priority?: Priority
  departmentId?: string
  technicianId?: string
}

export interface RequestFilters {
  status?: RequestStatus
  priority?: Priority
  departmentId?: string
}

export interface EquipmentHistory {
  id: string;
  equip_id: string;
  date: string;
  user_id: string;
  action: 'check-out' | 'check-in' | 'maintenance' | 'repair' | 'retired' | string;
  notes: string;
}