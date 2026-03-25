import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import jobsRoutes from './routes/jobs';
import issuesRoutes from './routes/issues';
import usersRoutes from './routes/users';
import equipmentRoutes from './routes/equipment';
import departmentRoutes from './routes/departments';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logger middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/issues', issuesRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/departments', departmentRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('TechJob API is running...');
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
