# TechJob Management System

TechJob is an end-to-end IT service management solution, providing tools for ticketing, asset tracking, and job assignments.

## 🚀 Getting Started

The application is split into a Next.js (React) frontend and an Express (Node.js) backend, powered by a MySQL database.

### 1. Database Setup
The easiest way to start the database is using Docker. From the project root, start MySQL and phpMyAdmin:
```bash
docker-compose up -d
```
*MySQL will run on port `3306` with the username `techjob` and password `techjob123`. phpMyAdmin is available at `http://localhost:8080`.*

### 2. Backend Setup
Navigate to the `backend` folder to install dependencies and run the API server. Upon the first successful start, the server will automatically seed the initial database elements.
```bash
cd backend
npm install
npm run build
npm run start
```
*The backend server will run on `http://localhost:3001`.*

### 3. Frontend Setup
Open a new terminal and navigate to the project root. Install dependencies and start the Next.js development server:
```bash
npm install
npm run dev
```
*The frontend application will be available at `http://localhost:3000`.*

### ⚙️ Environment Configuration
The frontend connects to the backend API via the `.env.local` configuration layer. 

**Mock Data Mode**: If you wish to run the frontend independently without a database, you can toggle Mock mode:
```env
NEXT_PUBLIC_API_MOCK=true
```
For full database connectivity, ensure this is set to `false`.
