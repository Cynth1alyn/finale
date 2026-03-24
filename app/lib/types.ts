// API Types for TechJob Application

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  EMPLOYEE = 'EMPLOYEE'
}

export enum JobStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum EquipmentStatus {
  OPERATIONAL = 'OPERATIONAL',
  MAINTENANCE = 'MAINTENANCE',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
  DECOMMISSIONED = 'DECOMMISSIONED'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

// User Types
export interface User {
  id: string
  code: string
  name: string
  email: string
  role: Role
  isActive: boolean
  departmentId?: string
  department?: Department
  createdAt: string
  updatedAt: string
}

// Department Types
export interface Department {
  id: string
  code: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  _count?: {
    users: number
    equipment: number
    jobs: number
    issues: number
  }
  users?: User[]
  equipment?: Equipment[]
}

// Equipment Types
export interface Equipment {
  id: string
  code: string
  name: string
  type: string
  status: EquipmentStatus
  location?: string
  departmentId?: string
  department?: Department
  createdAt: string
  updatedAt: string
}

// Issue Types
export interface Issue {
  id: string
  code: string
  title: string
  description?: string
  status: IssueStatus
  priority: Priority
  equipmentId?: string
  equipment?: Equipment
  technicianId?: string
  technician?: User
  creatorId: string
  creator: User
  departmentId?: string
  department?: Department
  createdAt: string
  updatedAt: string
}

// Job Types
export interface Job {
  id: string
  code: string
  title: string
  description?: string
  status: JobStatus
  priority: Priority
  equipmentId?: string
  equipment?: Equipment
  technicianId?: string
  technician?: User
  creatorId: string
  creator: User
  departmentId?: string
  department?: Department
  scheduledDate?: string
  completedDate?: string
  createdAt: string
  updatedAt: string
}

// Request Types
export interface Request {
  id: string
  code: string
  title: string
  description?: string
  type: string
  status: RequestStatus
  priority: Priority
  requesterId: string
  requester: User
  approverId?: string
  approver?: User
  departmentId?: string
  department?: Department
  createdAt: string
  updatedAt: string
}

// Notification Types
export interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  userId: string
  user: User
  relatedId?: string
  relatedType?: string
  createdAt: string
  updatedAt: string
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