import { User, Department, Equipment, Issue, Job, Request, Role, EquipmentHistory } from './types';

export const departments: Department[] = [
  { dept_id: "D001", dept_name: "IT Infrastructure" },
];

export const users: User[] = [
  { user_id: "U001", firstname: "Admin", lastname: "System", email: "thanawut@techjob.th", tel: "081-234-5678", role: Role.ADMIN, dept_id: "D001", avatar_color: "#3B82F6" },
];

export const equipment: Equipment[] = [];

export const issues: Issue[] = [];

export const jobs: Job[] = [];

export const requests: Request[] = [];

export const equipmentHistory: EquipmentHistory[] = [];
