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
  EquipmentStatus,
  IssueStatus,
  JobStatus,
  RequestStatus,
  Priority,
  EquipmentHistory
} from './types'

import * as mockData from './mock-data'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
const USE_MOCK = process.env.NEXT_PUBLIC_API_MOCK === 'true' || false

// Mutable mock storage for persistence within session
let mockJobs = [...mockData.jobs];
let mockUsers = [...mockData.users];
let mockDepartments = [...mockData.departments];
let mockIssues = [...mockData.issues];
let mockRequests = [...mockData.requests];
let mockNotifications = [...mockData.notifications];

// Helper function for API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config: RequestInit = {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
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
    if (USE_MOCK) {
      const user = mockData.users.find(u => u.email === credentials.email)
      if (user) {
        return {
          success: true,
          data: {
            user: user as User,
            token: 'mock-token-' + Date.now()
          }
        }
      }
      throw new Error('Invalid credentials (Mock Mode)')
    }

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
    if (USE_MOCK) {
      return {
        totalUsers: mockData.users.length,
        activeJobs: mockData.jobs.filter(j => j.job_status === 'in-progress').length,
        openIssues: mockData.issues.filter(i => i.status === 'open').length,
        totalEquipment: mockData.equipment.length,
        totalDepartments: mockData.departments.length,
        pendingRequests: mockData.requests.filter(r => r.req_status === 'pending').length,
      }
    }
    const response = await apiRequest('/dashboard/stats')
    return response.data
  },
}

// Users API
export const usersAPI = {
  getUsers: async (params?: { page?: number; limit?: number; offset?: number; search?: string }): Promise<User[]> => {
    if (USE_MOCK) {
      let filtered = [...mockData.users]
      if (params?.search) {
        const s = params.search.toLowerCase()
        filtered = filtered.filter(u =>
          u.firstname.toLowerCase().includes(s) ||
          u.lastname.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s)
        )
      }
      return filtered as User[]
    }

    const query = new URLSearchParams()
    if (params?.page) query.append('page', params.page.toString())
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.offset !== undefined) query.append('offset', params.offset.toString())
    if (params?.search) query.append('search', params.search)

    const response = await apiRequest(`/users?${query}`)
    return response.data
  },

  getUser: async (id: string): Promise<User> => {
    if (USE_MOCK) {
      const user = mockData.users.find(u => u.user_id === id)
      if (!user) throw new Error('User not found')
      return user as User
    }
    const response = await apiRequest(`/users/${id}`)
    return response.data
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    if (USE_MOCK) {
      const newUser = {
        ...userData,
        user_id: userData.user_id || 'U' + Math.floor(Math.random() * 1000),
        avatar_color: userData.avatar_color || '#3B82F6'
      } as User;
      mockUsers.push(newUser);
      return newUser;
    }
    const response = await apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    return response.data
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    if (USE_MOCK) {
      mockUsers = mockUsers.map(u => u.user_id === id ? { ...u, ...userData } as User : u);
      return mockUsers.find(u => u.user_id === id)!;
    }
    const response = await apiRequest(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
    return response.data
  },

  deleteUser: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      mockUsers = mockUsers.filter(u => u.user_id !== id);
      return;
    }
    await apiRequest(`/users/${id}`, {
      method: 'DELETE',
    })
  },
}

// Departments API
export const departmentsAPI = {
  getDepartments: async (): Promise<Department[]> => {
    if (USE_MOCK) return mockData.departments as Department[]
    const response = await apiRequest('/departments')
    return response.data
  },

  getDepartment: async (id: string): Promise<Department> => {
    if (USE_MOCK) {
      const d = mockData.departments.find(d => d.dept_id === id)
      if (!d) throw new Error('Department not found')
      return d as Department
    }
    const response = await apiRequest(`/departments/${id}`)
    return response.data
  },

  createDepartment: async (deptData: Partial<Department>): Promise<Department> => {
    if (USE_MOCK) return { dept_id: 'D' + Date.now(), ...deptData } as Department
    const response = await apiRequest('/departments', {
      method: 'POST',
      body: JSON.stringify(deptData),
    })
    return response.data
  },

  updateDepartment: async (id: string, deptData: Partial<Department>): Promise<Department> => {
    if (USE_MOCK) return { dept_id: id, ...deptData } as Department
    const response = await apiRequest(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deptData),
    })
    return response.data
  },

  deleteDepartment: async (id: string): Promise<void> => {
    if (USE_MOCK) return
    await apiRequest(`/departments/${id}`, {
      method: 'DELETE',
    })
  },
}

// Equipment API
export const equipmentAPI = {
  getEquipment: async (params?: {
    status?: EquipmentStatus
    dept_id?: string
    type?: string
    limit?: number
    offset?: number
  }): Promise<Equipment[]> => {
    if (USE_MOCK) {
      let filtered = [...mockData.equipment]
      if (params?.dept_id) filtered = filtered.filter(e => e.dept_id === params.dept_id)
      return filtered as Equipment[]
    }
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.dept_id) query.append('dept_id', params.dept_id)
    if (params?.type) query.append('type', params.type)
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.offset !== undefined) query.append('offset', params.offset.toString())

    const response = await apiRequest(`/equipment?${query}`)
    return response.data
  },

  createEquipment: async (equipData: Partial<Equipment>): Promise<Equipment> => {
    if (USE_MOCK) return { equip_id: 'E' + Date.now(), ...equipData } as Equipment
    const response = await apiRequest('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipData),
    })
    return response.data
  },

  updateEquipment: async (id: string, equipData: Partial<Equipment>): Promise<Equipment> => {
    if (USE_MOCK) return { equip_id: id, ...equipData } as Equipment
    const response = await apiRequest(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipData),
    })
    return response.data
  },
  
  checkOutEquipment: async (id: string, data: { user_id: string; qty: number; notes: string }): Promise<Equipment> => {
    if (USE_MOCK) {
      const equip = mockData.equipment.find(e => e.equip_id === id);
      if (!equip) throw new Error('Equipment not found');
      if (equip.remain_qty < data.qty) throw new Error('สต็อกไม่เพียงพอ');
      const updated = { ...equip, remain_qty: equip.remain_qty - data.qty } as Equipment;
      // In mock mode, we just return the updated equipment
      // Note: mockData arrays are usually read-only in this context, but this works for UI simulation
      return updated;
    }
    const response = await apiRequest(`/equipment/${id}/checkout`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data;
  },

  getEquipmentHistory: async (id: string): Promise<EquipmentHistory[]> => {
    if (USE_MOCK) {
      return mockData.equipmentHistory.filter(h => h.equip_id === id) as EquipmentHistory[]
    }
    const response = await apiRequest(`/equipment/${id}/history`)
    return response.data
  },

  deleteEquipment: async (id: string): Promise<void> => {
    if (USE_MOCK) return
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
    dept_id?: string
    limit?: number
    offset?: number
  }): Promise<Issue[]> => {
    if (USE_MOCK) return mockData.issues as Issue[]
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.priority) query.append('priority', params.priority)
    if (params?.dept_id) query.append('dept_id', params.dept_id)
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.offset !== undefined) query.append('offset', params.offset.toString())

    const response = await apiRequest(`/issues?${query}`)
    return response.data
  },

  getIssue: async (id: string): Promise<Issue> => {
    if (USE_MOCK) {
      const issue = mockData.issues.find(i => i.issue_id === id)
      if (!issue) throw new Error('Issue not found')
      return issue as Issue
    }
    const response = await apiRequest(`/issues/${id}`)
    return response.data
  },

  createIssue: async (issueData: Partial<Issue>): Promise<Issue> => {
    if (USE_MOCK) return { issue_id: 'I' + Date.now(), ...issueData } as Issue
    const response = await apiRequest('/issues', {
      method: 'POST',
      body: JSON.stringify(issueData),
    })
    return response.data
  },

  updateIssue: async (id: string, issueData: Partial<Issue>): Promise<Issue> => {
    if (USE_MOCK) return { issue_id: id, ...issueData } as Issue
    const response = await apiRequest(`/issues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(issueData),
    })
    return response.data
  },

  deleteIssue: async (id: string): Promise<void> => {
    if (USE_MOCK) return
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
    dept_id?: string
    limit?: number
    offset?: number
  }): Promise<Job[]> => {
    if (USE_MOCK) {
      let filtered = [...mockJobs]
      const tokenUserStr = typeof window !== 'undefined' ? localStorage.getItem('techjob_user') : null;
      if (tokenUserStr) {
        const user = JSON.parse(tokenUserStr);
        if (user.role !== 'admin') {
          filtered = filtered.filter(j => 
            j.assigned_lead_id === user.user_id || 
            (Array.isArray(j.assigned_user_ids) && j.assigned_user_ids.includes(user.user_id))
          );
        }
      }
      return filtered as Job[]
    }
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.priority) query.append('priority', params.priority)
    if (params?.dept_id) query.append('dept_id', params.dept_id)
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.offset !== undefined) query.append('offset', params.offset.toString())

    const response = await apiRequest(`/jobs?${query}`)
    return response.data
  },

  getJob: async (id: string): Promise<Job> => {
    if (USE_MOCK) {
      const job = mockData.jobs.find(j => j.job_id === id)
      if (!job) throw new Error('Job not found')
      return job as Job
    }
    const response = await apiRequest(`/jobs/${id}`)
    return response.data
  },

  createJob: async (jobData: Partial<Job>): Promise<Job> => {
    if (USE_MOCK) {
      const newJob = { 
        job_id: 'J' + Date.now(), 
        assigned_user_ids: [],
        ...jobData 
      } as Job;
      mockJobs.push(newJob);
      return newJob;
    }
    const response = await apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    })
    return response.data
  },

  updateJob: async (id: string, jobData: Partial<Job>): Promise<Job> => {
    if (USE_MOCK) {
      mockJobs = mockJobs.map(j => j.job_id === id ? { ...j, ...jobData } as Job : j);
      return mockJobs.find(j => j.job_id === id)!;
    }
    const response = await apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    })
    return response.data
  },

  deleteJob: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      mockJobs = mockJobs.filter(j => j.job_id !== id);
      return;
    }
    await apiRequest(`/jobs/${id}`, {
      method: 'DELETE',
    })
  },
}

// Requests API
export const requestsAPI = {
  getRequests: async (params?: {
    status?: RequestStatus
    dept_id?: string
    limit?: number
    offset?: number
  }): Promise<Request[]> => {
    if (USE_MOCK) return mockData.requests as Request[]
    const query = new URLSearchParams()
    if (params?.status) query.append('status', params.status)
    if (params?.dept_id) query.append('dept_id', params.dept_id)
    if (params?.limit) query.append('limit', params.limit.toString())
    if (params?.offset !== undefined) query.append('offset', params.offset.toString())

    const response = await apiRequest(`/requests?${query}`)
    return response.data
  },

  getRequest: async (id: string): Promise<Request> => {
    if (USE_MOCK) {
      const r = mockData.requests.find(r => r.req_id === id)
      if (!r) throw new Error('Request not found')
      return r as Request
    }
    const response = await apiRequest(`/requests/${id}`)
    return response.data
  },

  createRequest: async (requestData: Partial<Request>): Promise<Request> => {
    if (USE_MOCK) return { req_id: 'R' + Date.now(), ...requestData } as Request
    const response = await apiRequest('/requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    })
    return response.data
  },

  updateRequest: async (id: string, requestData: Partial<Request>): Promise<Request> => {
    if (USE_MOCK) return { req_id: id, ...requestData } as Request
    const response = await apiRequest(`/requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    })
    return response.data
  },

  deleteRequest: async (id: string): Promise<void> => {
    if (USE_MOCK) return
    await apiRequest(`/requests/${id}`, {
      method: 'DELETE',
    })
  },
}

// Notifications API
export const notificationsAPI = {
  getNotifications: async (): Promise<Notification[]> => {
    if (USE_MOCK) return mockData.notifications as Notification[]
    const response = await apiRequest('/notifications')
    return response.data
  },

  getUnreadCount: async (): Promise<number> => {
    if (USE_MOCK) return mockData.notifications.filter(n => !n.is_read).length
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