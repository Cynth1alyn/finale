"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
exports.query = query;
exports.execute = execute;
exports.withTransaction = withTransaction;
exports.initializeDatabase = initializeDatabase;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const data_1 = require("./data");
dotenv_1.default.config();
const pool = promise_1.default.createPool({
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
    typeCast: (field, next) => {
        if (field.type === 245) { // JSON
            const value = field.string();
            return value ? JSON.parse(value) : [];
        }
        return next();
    }
});
async function connectDB() {
    try {
        await pool.query('SELECT 1');
        console.log('✅ MySQL connected successfully');
    }
    catch (error) {
        console.error('❌ MySQL connection error:', error);
        process.exit(1);
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function query(sql, params = []) {
    const [rows] = await pool.query(sql, params);
    return rows;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function execute(sql, params = []) {
    const [result] = await pool.execute(sql, params);
    return result;
}
async function withTransaction(callback) {
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    try {
        const result = await callback(connection);
        await connection.commit();
        return result;
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
async function createTables() {
    // Drop tables in reverse order of dependencies
    await query('DROP TABLE IF EXISTS notifications');
    await query('DROP TABLE IF EXISTS requests');
    await query('DROP TABLE IF EXISTS jobs');
    await query('DROP TABLE IF EXISTS issues');
    await query('DROP TABLE IF EXISTS equipment_history');
    await query('DROP TABLE IF EXISTS equipment');
    await query('DROP TABLE IF EXISTS units');
    await query('DROP TABLE IF EXISTS users');
    await query('DROP TABLE IF EXISTS departments');
    // 1. Units
    await query(`CREATE TABLE units (
    unit_id VARCHAR(50) PRIMARY KEY,
    unit_name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
    // 2. Departments
    await query(`CREATE TABLE departments (
    dept_id VARCHAR(50) PRIMARY KEY,
    dept_name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
    // 3. Users
    await query(`CREATE TABLE users (
    user_id VARCHAR(50) PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    tel VARCHAR(50) NOT NULL,
    role VARCHAR(50) DEFAULT 'staff',
    password VARCHAR(255) NULL,
    dept_id VARCHAR(50) NULL,
    avatar_color VARCHAR(50) DEFAULT '#3B82F6',
    last_login DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL,
    INDEX (email),
    INDEX (role)
  )`);
    // 4. Equipment
    await query(`CREATE TABLE equipment (
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
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id) ON DELETE SET NULL,
    FOREIGN KEY (unit_id) REFERENCES units(unit_id) ON DELETE SET NULL,
    INDEX (status),
    CONSTRAINT chk_qty CHECK (remain_qty <= total_qty)
  )`);
    // 5. Equipment History
    await query(`CREATE TABLE equipment_history (
    id VARCHAR(50) PRIMARY KEY,
    equip_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (equip_id) REFERENCES equipment(equip_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  )`);
    // 6. Issues
    await query(`CREATE TABLE issues (
    issue_id VARCHAR(50) PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL,
    solution TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open',
    report_date DATE NOT NULL,
    reporter_id VARCHAR(50) NOT NULL,
    lat DECIMAL(10, 8) NULL,
    lng DECIMAL(11, 8) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(user_id),
    INDEX (status)
  )`);
    // 7. Jobs
    await query(`CREATE TABLE jobs (
    job_id VARCHAR(50) PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    due_date DATE NOT NULL,
    job_priority VARCHAR(50) NOT NULL DEFAULT 'medium',
    job_status VARCHAR(50) NOT NULL DEFAULT 'pending',
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
    FOREIGN KEY (assigned_lead_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX (job_status),
    INDEX (job_priority)
  )`);
    // 8. Requests
    await query(`CREATE TABLE requests (
    req_id VARCHAR(50) PRIMARY KEY,
    req_date DATE NOT NULL,
    req_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    user_id VARCHAR(50) NOT NULL,
    items JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX (req_status)
  )`);
    // 9. Notifications
    await query(`CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_link VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
}
function jsonValue(value) {
    return value == null ? null : JSON.stringify(value);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function seedTableIfEmpty(table, countQuery, rows) {
    const [countRows] = await pool.query(countQuery);
    const count = countRows[0]?.count || 0;
    if (count > 0)
        return;
    for (const row of rows) {
        if (table === 'units') {
            await query('INSERT INTO units (unit_id, unit_name, description) VALUES (?, ?, ?)', [row.unit_id, row.unit_name, row.description || null]);
        }
        else if (table === 'departments') {
            await query('INSERT INTO departments (dept_id, dept_name, description) VALUES (?, ?, ?)', [row.dept_id, row.dept_name, row.description || null]);
        }
        else if (table === 'users') {
            await query('INSERT INTO users (user_id, firstname, lastname, email, tel, role, password, dept_id, avatar_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [row.user_id, row.firstname, row.lastname, row.email, row.tel, row.role, row.password || null, row.dept_id || null, row.avatar_color || null]);
        }
        else if (table === 'equipment') {
            await query('INSERT INTO equipment (equip_id, name, type_category, total_qty, remain_qty, unit_id, dept_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [row.equip_id, row.name, row.type_category || null, row.total_qty, row.remain_qty, row.unit_id || null, row.dept_id || null, row.status || null]);
        }
        else if (table === 'equipment_history') {
            await query('INSERT INTO equipment_history (id, equip_id, date, user_id, action, notes) VALUES (?, ?, ?, ?, ?, ?)', [row.id, row.equip_id, row.date, row.user_id, row.action, row.notes || null]);
        }
        else if (table === 'issues') {
            await query('INSERT INTO issues (issue_id, topic, detail, solution, status, report_date, reporter_id, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [row.issue_id, row.topic, row.detail, row.solution, row.status, row.report_date, row.reporter_id, row.lat ?? null, row.lng ?? null]);
        }
        else if (table === 'jobs') {
            await query('INSERT INTO jobs (job_id, job_title, description, start_date, due_date, job_priority, job_status, assigned_user_ids, lat, lng, customer_name, contact_number, address, landmark, assigned_lead_id, equipment_requests) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [row.job_id, row.job_title, row.description, row.start_date, row.due_date, row.job_priority, row.job_status, jsonValue(row.assigned_user_ids), row.lat ?? null, row.lng ?? null, row.customer_name || null, row.contact_number || null, row.address || null, row.landmark || null, row.assigned_lead_id || null, jsonValue(row.equipment_requests)]);
        }
        else if (table === 'requests') {
            await query('INSERT INTO requests (req_id, req_date, req_status, user_id, items) VALUES (?, ?, ?, ?, ?)', [row.req_id, row.req_date, row.req_status, row.user_id, jsonValue(row.items)]);
        }
    }
}
async function initializeDatabase() {
    await createTables();
    console.log('✅ Tables created/refreshed');
    await seedTableIfEmpty('units', 'SELECT COUNT(*) AS count FROM units', data_1.units);
    await seedTableIfEmpty('departments', 'SELECT COUNT(*) AS count FROM departments', data_1.departments);
    await seedTableIfEmpty('users', 'SELECT COUNT(*) AS count FROM users', data_1.users);
    await seedTableIfEmpty('equipment', 'SELECT COUNT(*) AS count FROM equipment', data_1.equipment);
    await seedTableIfEmpty('equipment_history', 'SELECT COUNT(*) AS count FROM equipment_history', data_1.equipmentHistory);
    await seedTableIfEmpty('issues', 'SELECT COUNT(*) AS count FROM issues', data_1.issues);
    await seedTableIfEmpty('jobs', 'SELECT COUNT(*) AS count FROM jobs', data_1.jobs);
    await seedTableIfEmpty('requests', 'SELECT COUNT(*) AS count FROM requests', data_1.requests);
    console.log('✅ Database seeded successfully');
}
