// API integration for TechJob frontend
import type {
  User,
  Department,
  Equipment,
  Issue,
  Job,
  Request,
  Notification,
  DashboardStats,
  LoginRequest,
  LoginResponse,
  Role,
  EquipmentStatus,
  IssueStatus,
  JobStatus,
  RequestStatus,
  Priority
} from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Helper function for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`)
    }

    return data
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// Auth API
export const authAPI = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    return response
  },
}

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiRequest('/dashboard/stats')
    return response.data
  },
}

// Users API
export const usersAPI = {
  getUsers: async (params?: { page?: number; limit?: number; search?: string }): Promise<User[]> => {
    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.search) query.append('search', params.search)

    const response = await apiRequest(`/users?${query}`)
    return response.data
  },

  getUser: async (id: string): Promise<User> => {
    const response = await apiRequest(`/users/${id}`)
    return response.data
  },

  createUser: async (userData: {
    name: string
    email: string
    password: string
    role: Role
    departmentId?: string
  }): Promise<User> => {
    const response = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    return response.data
  },

  updateUser: async (id: string, userData: Partial<{
    name: string
    email: string
    role: Role
    departmentId?: string
    isActive: boolean
  }>): Promise<User> => {
    const response = await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
    return response.data
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    })
  },
}

// Departments API
export const departmentsAPI = {
  getDepartments: async (): Promise<Department[]> => {
    const response = await apiRequest('/departments')
    return response.data
  },

  getDepartment: async (id: string): Promise<Department> => {
    const response = await apiRequest(`/departments/${id}`)
    return response.data
  },

  createDepartment: async (deptData: {
    name: string
    description?: string
  }): Promise<Department> => {
    const response = await apiRequest('/departments', {
      method: 'POST',
      body: JSON.stringify(deptData),
    })
    return response.data
  },

  updateDepartment: async (id: string, deptData: Partial<{
    name: string
    description?: string
  }>): Promise<Department> => {
    const response = await apiRequest(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deptData),
    })
    return response.data
  },

  deleteDepartment: async (id: string): Promise<void> => {
    await apiRequest(`/departments/${id}`, {
      method: 'DELETE',
    })
  },
}

// Equipment API
export const equipmentAPI = {
  getEquipment: async (params?: {
    status?: EquipmentStatus
    departmentId?: string
    type?: string
  }): Promise<Equipment[]> => {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.departmentId) query.append('departmentId', params.departmentId)
    if (params?.type) query.append('type', params.type)

    const response = await apiRequest(`/equipment?${query}`)
    return response.data
  },

  createEquipment: async (equipData: {
    name: string
    type: string
    status?: EquipmentStatus
    location?: string
    departmentId?: string
  }): Promise<Equipment> => {
    const response = await apiRequest('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipData),
    })
    return response.data
  },

  updateEquipment: async (id: string, equipData: Partial<{
    name: string
    type: string
    status: EquipmentStatus
    location?: string
    departmentId?: string
  }>): Promise<Equipment> => {
    const response = await apiRequest(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipData),
    })
    return response.data
  },

  deleteEquipment: async (id: string): Promise<void> => {
    await apiRequest(`/equipment/${id}`, {
      method: 'DELETE',
    })
  },
}

// Issues API
export const issuesAPI = {
  getIssues: async (params?: {
    status?: IssueStatus
    priority?: Priority
    departmentId?: string
  }): Promise<Issue[]> => {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.priority) query.append('priority', params.priority)
    if (params?.departmentId) query.append('departmentId', params.departmentId)

    const response = await apiRequest(`/issues?${query}`)
    return response.data
  },

  getIssue: async (id: string): Promise<Issue> => {
    const response = await apiRequest(`/issues/${id}`)
    return response.data
  },

  createIssue: async (issueData: {
    title: string
    description?: string
    priority?: Priority
    equipmentId?: string
    departmentId?: string
  }): Promise<Issue> => {
    const response = await apiRequest('/issues', {
      method: 'POST',
      body: JSON.stringify(issueData),
    })
    return response.data
  },

  updateIssue: async (id: string, issueData: Partial<{
    title: string
    description?: string
    status: IssueStatus
    priority: Priority
    technicianId?: string
  }>): Promise<Issue> => {
    const response = await apiRequest(`/issues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(issueData),
    })
    return response.data
  },

  deleteIssue: async (id: string): Promise<void> => {
    await apiRequest(`/issues/${id}`, {
      method: 'DELETE',
    })
  },
}

// Jobs API
export const jobsAPI = {
  getJobs: async (params?: {
    status?: JobStatus
    priority?: Priority
    departmentId?: string
  }): Promise<Job[]> => {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.priority) query.append('priority', params.priority)
    if (params?.departmentId) query.append('departmentId', params.departmentId)

    const response = await apiRequest(`/jobs?${query}`)
    return response.data
  },

  getJob: async (id: string): Promise<Job> => {
    const response = await apiRequest(`/jobs/${id}`)
    return response.data
  },

  createJob: async (jobData: {
    title: string
    description?: string
    priority?: Priority
    equipmentId?: string
    technicianId?: string
    departmentId?: string
  }): Promise<Job> => {
    const response = await apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    })
    return response.data
  },

  updateJob: async (id: string, jobData: Partial<{
    title: string
    description?: string
    status: JobStatus
    priority: Priority
    technicianId?: string
  }>): Promise<Job> => {
    const response = await apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    })
    return response.data
  },

  deleteJob: async (id: string): Promise<void> => {
    await apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    })
  },
}

// Requests API
export const requestsAPI = {
  getRequests: async (params?: {
    status?: RequestStatus
    departmentId?: string
  }): Promise<Request[]> => {
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.departmentId) query.append('departmentId', params.departmentId)

    const response = await apiRequest(`/requests?${query}`)
    return response.data
  },

  getRequest: async (id: string): Promise<Request> => {
    const response = await apiRequest(`/requests/${id}`)
    return response.data
  },

  createRequest: async (requestData: {
    title: string
    description?: string
    type: string
    priority?: Priority
    departmentId?: string
  }): Promise<Request> => {
    const response = await apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
    return response.data
  },

  updateRequest: async (id: string, requestData: Partial<{
    title: string
    description?: string
    status: RequestStatus
    priority: Priority
  }>): Promise<Request> => {
    const response = await apiRequest(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    })
    return response.data
  },

  deleteRequest: async (id: string): Promise<void> => {
    await apiRequest(`/requests/${id}`, {
      method: 'DELETE',
    })
  },
}

// Notifications API
export const notificationsAPI = {
  getNotifications: async (): Promise<Notification[]> => {
    const response = await apiRequest('/notifications')
    return response.data
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiRequest('/notifications/unread-count')
    return response.data
  },

  markAsRead: async (id: string): Promise<void> => {
    await apiRequest(`/notifications/${id}/read`, {
      method: 'PATCH',
    })
  },

  markAllAsRead: async (): Promise<void> => {
    await apiRequest('/notifications/read-all', {
      method: 'PATCH',
    })
  },
}

// Export all APIs
export const api = {
  auth: authAPI,
  dashboard: dashboardAPI,
  users: usersAPI,
  departments: departmentsAPI,
  equipment: equipmentAPI,
  issues: issuesAPI,
  jobs: jobsAPI,
  requests: requestsAPI,
  notifications: notificationsAPI,
}