import mysql, { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import dotenv from 'dotenv';
import {
  departments,
  users,
  equipment,
  issues,
  jobs,
  requests,
  equipmentHistory,
  units
} from './data';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'techjob',
  password: process.env.DB_PASSWORD || 'techjob123',
  database: process.env.DB_DATABASE || 'techjob',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
  dateStrings: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeCast: (field: any, next: () => void) => {
    if (field.type === 245) { // JSON
      const value = field.string();
      return value ? JSON.parse(value) : [];
    }
    return next();
  }
});

export async function connectDB() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ MySQL connected successfully');
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    process.exit(1);
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query<T = RowDataPacket>(sql: string, params: any[] = []) {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function execute(sql: string, params: any[] = []): Promise<ResultSetHeader> {
  const [result] = await pool.execute<ResultSetHeader>(sql, params);
  return result;
}

export async function withTransaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function dropTables() {
  await query('SET FOREIGN_KEY_CHECKS = 0');
  const tables = [
    'notifications',
    'requests',
    'jobs',
    'issues',
    'equipment_history',
    'equipment',
    'users',
    'units',
    'departments'
  ];
  for (const table of tables) {
    await query(`DROP TABLE IF EXISTS ${table}`);
  }
  await query('SET FOREIGN_KEY_CHECKS = 1');
}

async function createTables() {
  // 1. Departments
  await query(`CREATE TABLE IF NOT EXISTS departments (
    dept_id VARCHAR(50) PRIMARY KEY,
    dept_name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_dept_name (dept_name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  // 2. Units
  await query(`CREATE TABLE IF NOT EXISTS units (
    unit_id VARCHAR(50) PRIMARY KEY,
    unit_name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_unit_name (unit_name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  // 3. Users
  await query(`CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(50) PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    tel VARCHAR(50) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff',
    password VARCHAR(255) NULL,
    dept_id VARCHAR(50) NULL,
    avatar_color VARCHAR(50) DEFAULT '#3B82F6',
    last_login TIMESTAMP NULL,
    password_changed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_user_email (email),
    INDEX idx_user_role (role),
    CONSTRAINT fk_user_dept FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  // 4. Equipment
  await query(`CREATE TABLE IF NOT EXISTS equipment (
    equip_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_category VARCHAR(100) NULL,
    total_qty INT NOT NULL DEFAULT 0,
    remain_qty INT NOT NULL DEFAULT 0,
    unit_id VARCHAR(50) NULL,
    dept_id VARCHAR(50) NULL,
    status VARCHAR(50) DEFAULT 'operational',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_equip_status (status),
    CONSTRAINT fk_equip_unit FOREIGN KEY (unit_id) REFERENCES units(unit_id) ON DELETE SET NULL,
    CONSTRAINT fk_equip_dept FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  // 5. Equipment History
  await query(`CREATE TABLE IF NOT EXISTS equipment_history (
    id VARCHAR(50) PRIMARY KEY,
    equip_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hist_equip FOREIGN KEY (equip_id) REFERENCES equipment(equip_id) ON DELETE CASCADE,
    CONSTRAINT fk_hist_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  // 6. Issues
  await query(`CREATE TABLE IF NOT EXISTS issues (
    issue_id VARCHAR(50) PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL,
    solution TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    report_date DATE NOT NULL,
    reporter_id VARCHAR(50) NOT NULL,
    lat DECIMAL(10, 8) NULL,
    lng DECIMAL(11, 8) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_issue_status (status),
    CONSTRAINT fk_issue_reporter FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE RESTRICT
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  // 7. Jobs
  await query(`CREATE TABLE IF NOT EXISTS jobs (
    job_id VARCHAR(50) PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    job_priority VARCHAR(50) DEFAULT 'medium',
    job_status VARCHAR(50) DEFAULT 'pending',
    assigned_user_ids JSON NULL,
    lat DECIMAL(10, 8) NULL,
    lng DECIMAL(11, 8) NULL,
    customer_name VARCHAR(255) NULL,
    contact_number VARCHAR(50) NULL,
    address TEXT NULL,
    landmark TEXT NULL,
    assigned_lead_id VARCHAR(50) NULL,
    equipment_requests JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_job_status (job_status),
    INDEX idx_job_priority (job_priority),
    CONSTRAINT fk_job_lead FOREIGN KEY (assigned_lead_id) REFERENCES users(user_id) ON DELETE SET NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  // 8. Requests
  await query(`CREATE TABLE IF NOT EXISTS requests (
    req_id VARCHAR(50) PRIMARY KEY,
    req_date DATE NOT NULL,
    req_status VARCHAR(50) DEFAULT 'pending',
    user_id VARCHAR(50) NOT NULL,
    items JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_req_status (req_status),
    CONSTRAINT fk_req_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

  // 9. Notifications
  await query(`CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_link VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
}

function jsonValue(value: unknown) {
  return value == null ? null : JSON.stringify(value);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedTableIfEmpty(table: string, countQuery: string, rows: any[]) {
  const [countRows] = await pool.query<RowDataPacket[]>(countQuery);
  const count = countRows[0]?.count || 0;
  if (count > 0) return;

  for (const row of rows) {
    if (table === 'departments') {
      await query('INSERT INTO departments (dept_id, dept_name, description) VALUES (?, ?, ?)', [row.dept_id, row.dept_name, row.description || null]);
    } else if (table === 'users') {
      await query('INSERT INTO users (user_id, firstname, lastname, email, tel, role, password, dept_id, avatar_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [row.user_id, row.firstname, row.lastname, row.email, row.tel, row.role, row.password || null, row.dept_id || null, row.avatar_color || null]);
    } else if (table === 'equipment') {
      await query('INSERT INTO equipment (equip_id, name, type_category, total_qty, remain_qty, unit_id, dept_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [row.equip_id, row.name, row.type_category || null, row.total_qty, row.remain_qty, row.unit_id || null, row.dept_id || null, row.status || null]);
    } else if (table === 'equipment_history') {
      await query('INSERT INTO equipment_history (id, equip_id, date, user_id, action, notes) VALUES (?, ?, ?, ?, ?, ?)', [row.id, row.equip_id, row.date, row.user_id, row.action, row.notes || null]);
    } else if (table === 'issues') {
      await query('INSERT INTO issues (issue_id, topic, detail, solution, status, report_date, reporter_id, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [row.issue_id, row.topic, row.detail, row.solution, row.status, row.report_date, row.reporter_id, row.lat ?? null, row.lng ?? null]);
    } else if (table === 'jobs') {
      await query('INSERT INTO jobs (job_id, job_title, description, start_date, due_date, job_priority, job_status, assigned_user_ids, lat, lng, customer_name, contact_number, address, landmark, assigned_lead_id, equipment_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [row.job_id, row.job_title, row.description, row.start_date, row.due_date, row.job_priority, row.job_status, jsonValue(row.assigned_user_ids), row.lat ?? null, row.lng ?? null, row.customer_name || null, row.contact_number || null, row.address || null, row.landmark || null, row.assigned_lead_id || null, jsonValue(row.equipment_requests)]);
    } else if (table === 'units') {
      await query('INSERT INTO units (unit_id, unit_name, description) VALUES (?, ?, ?)', [row.unit_id, row.unit_name, row.description || null]);
    } else if (table === 'requests') {
      await query('INSERT INTO requests (req_id, req_date, req_status, user_id, items) VALUES (?, ?, ?, ?, ?)', [row.req_id, row.req_date, row.req_status, row.user_id, jsonValue(row.items)]);
    }
  }
}

export async function initializeDatabase() {
  await dropTables(); // Always recreate for now as requested
  await createTables();
  await seedTableIfEmpty('departments', 'SELECT COUNT(*) AS count FROM departments', departments);
  await seedTableIfEmpty('units', 'SELECT COUNT(*) AS count FROM units', units);
  await seedTableIfEmpty('users', 'SELECT COUNT(*) AS count FROM users', users);
  await seedTableIfEmpty('equipment', 'SELECT COUNT(*) AS count FROM equipment', equipment);
  await seedTableIfEmpty('equipment_history', 'SELECT COUNT(*) AS count FROM equipment_history', equipmentHistory);
  await seedTableIfEmpty('issues', 'SELECT COUNT(*) AS count FROM issues', issues);
  await seedTableIfEmpty('jobs', 'SELECT COUNT(*) AS count FROM jobs', jobs);
  await seedTableIfEmpty('requests', 'SELECT COUNT(*) AS count FROM requests', requests);
  console.log('✅ Database initialized and seeded successfully');
}

