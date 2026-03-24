export interface User {
  user_id: string;
  firstname: string;
  lastname: string;
  email: string;
  tel: string;
  role: string;
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
  status: string;
  remain_qty: number;
}

export interface Issue {
  issue_id: string;
  topic: string;
  detail: string;
  solution: string;
  status: string;
  report_date: string;
  reporter_id: string;
}

export interface Job {
  job_id: string;
  job_title: string;
  description: string;
  start_date: string;
  due_date: string;
  job_priority: string;
  job_status: string;
  assigned_user_ids: string[];
}

export interface Request {
  req_id: string;
  req_title: string;
  req_status: string;
}
