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
        fetchedEquip
      ] = await Promise.all([
        api.jobs.getJobs(),
        api.users.getUsers(),
        api.departments.getDepartments(),
        api.issues.getIssues(),
        api.requests.getRequests(),
        api.equipment.getEquipment(),
      ]);

      setJobs(fetchedJobs);
      setUsers(fetchedUsers);
      setDepartments(fetchedDepts);
      setIssues(fetchedIssues);
      setRequests(fetchedRequests);
      setEquipment(fetchedEquip);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    }

    try {
      const fetchedNotifs = await api.notifications.getNotifications();
      setNotifications(fetchedNotifs);
    } catch (error) {
      console.warn('Notifications endpoint unavailable or failed:', error);
      setNotifications([]);
    }
  };

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      loadInitialData();
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const saveState = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  // Jobs
  const addJob = async (job: Job) => {
    try {
      const newJob = await api.jobs.createJob(job);
      setJobs(prev => [...prev, newJob]);
    } catch (error) {
      console.error('Failed to add job:', error);
    }
  };
  const updateJob = async (job: Job) => {
    try {
      const updated = await api.jobs.updateJob(job.job_id, job);
      setJobs(prev => prev.map(j => (j.job_id === updated.job_id ? updated : j)));
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };
  const deleteJob = async (id: string) => {
    try {
      await api.jobs.deleteJob(id);
      setJobs(prev => prev.filter(j => j.job_id !== id));
    } catch (error) {
      console.error('Failed to delete job:', error);
    }
  };

  // Users
  const addUser = async (user: User) => {
    try {
      const newUser = await api.users.createUser(user);
      setUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  };
  const updateUser = async (user: User) => {
    try {
      const updated = await api.users.updateUser(user.user_id, user);
      setUsers(prev => prev.map(u => (u.user_id === updated.user_id ? updated : u)));
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };
  const deleteUser = async (id: string) => {
    try {
      await api.users.deleteUser(id);
      setUsers(prev => prev.filter(u => u.user_id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  // Departments
  const addDepartment = async (dept: Department) => {
    try {
      const newDept = await api.departments.createDepartment(dept);
      setDepartments(prev => [...prev, newDept]);
    } catch (error) {
      console.error('Failed to add department:', error);
    }
  };
  const updateDepartment = async (dept: Department) => {
    try {
      const updated = await api.departments.updateDepartment(dept.dept_id, dept);
      setDepartments(prev => prev.map(d => (d.dept_id === updated.dept_id ? updated : d)));
    } catch (error) {
      console.error('Failed to update department:', error);
    }
  };
  const deleteDepartment = async (id: string) => {
    try {
      await api.departments.deleteDepartment(id);
      setDepartments(prev => prev.filter(d => d.dept_id !== id));
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  // Issues
  const addIssue = async (issue: Issue) => {
    try {
      const newIssue = await api.issues.createIssue(issue);
      setIssues(prev => [...prev, newIssue]);
    } catch (error) {
      console.error('Failed to add issue:', error);
    }
  };
  const updateIssue = async (issue: Issue) => {
    try {
      const updated = await api.issues.updateIssue(issue.issue_id, issue);
      setIssues(prev => prev.map(i => (i.issue_id === updated.issue_id ? updated : i)));
    } catch (error) {
      console.error('Failed to update issue:', error);
    }
  };
  const deleteIssue = async (id: string) => {
    try {
      await api.issues.deleteIssue(id);
      setIssues(prev => prev.filter(i => i.issue_id !== id));
    } catch (error) {
      console.error('Failed to delete issue:', error);
    }
  };

  // Requests
  const addRequest = async (req: Request) => {
    try {
      const newReq = await api.requests.createRequest(req);
      setRequests(prev => [...prev, newReq]);
    } catch (error) {
      console.error('Failed to add request:', error);
    }
  };
  const updateRequest = async (req: Request) => {
    try {
      const updated = await api.requests.updateRequest(req.req_id, req);
      setRequests(prev => prev.map(r => (r.req_id === updated.req_id ? updated : r)));
    } catch (error) {
      console.error('Failed to update request:', error);
    }
  };
  const deleteRequest = async (id: string) => {
    try {
      await api.requests.deleteRequest(id);
      setRequests(prev => prev.filter(r => r.req_id !== id));
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  // Equipment
  const addEquipment = async (equip: Equipment) => {
    try {
      const newEquip = await api.equipment.createEquipment(equip);
      setEquipment(prev => [...prev, newEquip]);
    } catch (error) {
      console.error('Failed to add equipment:', error);
    }
  };
  const updateEquipment = async (equip: Equipment) => {
    try {
      const updated = await api.equipment.updateEquipment(equip.equip_id, equip);
      setEquipment(prev => prev.map(e => (e.equip_id === updated.equip_id ? updated : e)));
    } catch (error) {
      console.error('Failed to update equipment:', error);
    }
  };
  const deleteEquipment = async (id: string) => {
    try {
      await api.equipment.deleteEquipment(id);
      setEquipment(prev => prev.filter(e => e.equip_id !== id));
    } catch (error) {
      console.error('Failed to delete equipment:', error);
    }
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
