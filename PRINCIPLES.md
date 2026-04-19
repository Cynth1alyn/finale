# TechJob Management System Core Principles

This document outlines the architectural and operational principles of the TechJob Management System.

## 🎯 1. Core Concept (แกนหลักของระบบ)

**Centralized IT Service Management (ITSM)**

Every task, problem, equipment, and user is managed through a single centralized system with status tracking and access control.

## 🧩 2. Core Modules (องค์ประกอบหลัก)

1.  **Work Management**: Task Lifecycle Management (Create / Assign / Track).
2.  **Issue / Ticket System**: Incident Management (Report → Ticket → Job).
3.  **Asset Management**: Asset Lifecycle Management (Usage / History).
4.  **User & Role System**: Access Control & Authorization (RBAC).

## 🔄 3. System Flow (หลักการทำงาน)

`User → Issue → Ticket → Job → Assignment → Update → Closure → History`

## 🔐 4. Security Principles (หลักด้านความปลอดภัย)

-   **Authentication**: JWT / Cookie based.
-   **Authorization**: Role-Based Access Control (RBAC).
-   **Data Protection**: No password exposure, secure input validation.
-   **Secure by Design**: Security integrated into every layer.

## ⚙️ 5. Architecture Principles (หลักด้านสถาปัตยกรรม)

**Separation of Concerns (SoC)**
-   **Routes/Controllers**: Handle HTTP requests and responses.
-   **Services**: Implement business logic and workflows.
-   **Repositories**: Manage data persistence and SQL queries.

## ⚡ 6. Performance (หลักด้านประสิทธิภาพ)

-   **Pagination**: Limit data loading per request.
-   **Indexing**: Fast database lookups.
-   **Lazy Loading**: Fetch data only when needed.

## 🧱 7. Data Integrity (หลักด้านข้อมูล)

-   **Transactions**: Ensure atomicity for multi-step operations.
-   **Validation**: Strong typing and input sanitization.
-   **Consistency & Reliability**: Robust error handling.

## 🔐 Role-Based Access Control (RBAC)

| Role | Responsibilities |
| :--- | :--- |
| **Admin** | Full system control, CRUD Users, Full Access to all modules. |
| **Manager** | Team & Task management, View all jobs, Update status. |
| **Technician** | Work on assigned jobs, Update job status, Asset usage. |
| **Staff/User** | Create issues/tickets, View own ticket status. |
