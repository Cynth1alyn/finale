"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const jobs_1 = __importDefault(require("./routes/jobs"));
const issues_1 = __importDefault(require("./routes/issues"));
const users_1 = __importDefault(require("./routes/users"));
const equipment_1 = __importDefault(require("./routes/equipment"));
const departments_1 = __importDefault(require("./routes/departments"));
const requests_1 = __importDefault(require("./routes/requests"));
const db_1 = require("./lib/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Logger middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/issues', issues_1.default);
app.use('/api/users', users_1.default);
app.use('/api/equipment', equipment_1.default);
app.use('/api/departments', departments_1.default);
app.use('/api/requests', requests_1.default);
// Base route
app.get('/', (req, res) => {
    res.send('TechJob API is running...');
});
// Error handling middleware
app.use((err, req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});
async function startServer() {
    await (0, db_1.connectDB)();
    await (0, db_1.initializeDatabase)();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
startServer().catch((error) => {
    console.error('Server failed to start:', error);
    process.exit(1);
});
