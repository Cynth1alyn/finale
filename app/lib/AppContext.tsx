'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api } from './api';
import { 
  Job, User, Department, Issue, Request, Equipment, Unit, Notification, Role
} from './types';

interface AppContextType {
  jobs: Job[];
  users: User[];
  departments: Department[];
  issues: Issue[];
  requests: Request[];
  equipment: Equipment[];
  units: Unit[];
  notifications: Notification[];

  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (id: string) => void;

  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;

  addDepartment: (dept: Department) => void;
  updateDepartment: (dept: Department) => void;
  deleteDepartment: (id: string) => void;

  addIssue: (issue: Issue) => void;
  updateIssue: (issue: Issue) => void;
  deleteIssue: (id: string) => void;

  addRequest: (req: Request) => void;
  updateRequest: (req: Request) => void;
  deleteRequest: (id: string) => void;

  addEquipment: (equip: Equipment) => void;
  updateEquipment: (equip: Equipment) => void;
  deleteEquipment: (id: string) => void;

  addNotification: (notif: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

    const loadInitialData = async () => {
      try {
        const [
          fetchedJobs, 
          fetchedUsers, 
          fetchedDepts, 
          fetchedIssues, 
          fetchedRequests, 
          fetchedEquip,
          fetchedNotifs
        ] = await Promise.all([
          api.jobs.getJobs(),
          api.users.getUsers(),
          api.departments.getDepartments(),
          api.issues.getIssues(),
          api.requests.getRequests(),
          api.equipment.getEquipment(),
          api.notifications.getNotifications()
        ]);

        setJobs(fetchedJobs);
        setUsers(fetchedUsers);
        setDepartments(fetchedDepts);
        setIssues(fetchedIssues);
        setRequests(fetchedRequests);
        setEquipment(fetchedEquip);
        setNotifications(fetchedNotifs);
      } catch (error) {
        console.error('Failed to load initial data:', error);
      }
    };

    loadInitialData();

  const saveState = (key: string, value: any) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Jobs
  const addJob = (job: Job) => {
    const next = [...jobs, job];
    setJobs(next);
    saveState('app_jobs', next);
  };
  const updateJob = (job: Job) => {
    const next = jobs.map(j => (j.job_id === job.job_id ? job : j));
    setJobs(next);
    saveState('app_jobs', next);
  };
  const deleteJob = (id: string) => {
    const next = jobs.filter(j => j.job_id !== id);
    setJobs(next);
    saveState('app_jobs', next);
  };

  // Users
  const addUser = (user: User) => {
    const next = [...users, user];
    setUsers(next);
    saveState('app_users', next);
  };
  const updateUser = (user: User) => {
    const next = users.map(u => (u.user_id === user.user_id ? user : u));
    setUsers(next);
    saveState('app_users', next);
  };
  const deleteUser = (id: string) => {
    const next = users.filter(u => u.user_id !== id);
    setUsers(next);
    saveState('app_users', next);
  };

  // Departments
  const addDepartment = (dept: Department) => {
    const next = [...departments, dept];
    setDepartments(next);
    saveState('app_departments', next);
  };
  const updateDepartment = (dept: Department) => {
    const next = departments.map(d => (d.dept_id === dept.dept_id ? dept : d));
    setDepartments(next);
    saveState('app_departments', next);
  };
  const deleteDepartment = (id: string) => {
    const next = departments.filter(d => d.dept_id !== id);
    setDepartments(next);
    saveState('app_departments', next);
  };

  // Issues
  const addIssue = (issue: Issue) => {
    const next = [...issues, issue];
    setIssues(next);
    saveState('app_issues', next);
  };
  const updateIssue = (issue: Issue) => {
    const next = issues.map(i => (i.issue_id === issue.issue_id ? issue : i));
    setIssues(next);
    saveState('app_issues', next);
  };
  const deleteIssue = (id: string) => {
    const next = issues.filter(i => i.issue_id !== id);
    setIssues(next);
    saveState('app_issues', next);
  };

  // Requests
  const addRequest = (req: Request) => {
    const next = [...requests, req];
    setRequests(next);
    saveState('app_requests', next);
  };
  const updateRequest = (req: Request) => {
    const next = requests.map(r => (r.req_id === req.req_id ? req : r));
    setRequests(next);
    saveState('app_requests', next);
  };
  const deleteRequest = (id: string) => {
    const next = requests.filter(r => r.req_id !== id);
    setRequests(next);
    saveState('app_requests', next);
  };

  // Equipment
  const addEquipment = (equip: Equipment) => {
    const next = [...equipment, equip];
    setEquipment(next);
    saveState('app_equipment', next);
  };
  const updateEquipment = (equip: Equipment) => {
    const next = equipment.map(e => (e.equip_id === equip.equip_id ? equip : e));
    setEquipment(next);
    saveState('app_equipment', next);
  };
  const deleteEquipment = (id: string) => {
    const next = equipment.filter(e => e.equip_id !== id);
    setEquipment(next);
    saveState('app_equipment', next);
  };

  // Notifications
  const addNotification = (notif: Notification) => {
    const next = [notif, ...notifications];
    setNotifications(next);
    saveState('app_notifications', next);
  };
  const markNotificationAsRead = (id: string) => {
    const next = notifications.map(n => n.id === id ? { ...n, is_read: true } : n);
    setNotifications(next);
    saveState('app_notifications', next);
  };
  const markAllNotificationsAsRead = () => {
    const next = notifications.map(n => ({ ...n, is_read: true }));
    setNotifications(next);
    saveState('app_notifications', next);
  };

  return (
    <AppContext.Provider value={{
      jobs, users, departments, issues, requests, equipment, units, notifications,
      addJob, updateJob, deleteJob,
      addUser, updateUser, deleteUser,
      addDepartment, updateDepartment, deleteDepartment,
      addIssue, updateIssue, deleteIssue,
      addRequest, updateRequest, deleteRequest,
      addEquipment, updateEquipment, deleteEquipment,
      addNotification, markNotificationAsRead, markAllNotificationsAsRead
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
