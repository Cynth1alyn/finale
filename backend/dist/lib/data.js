"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.equipmentHistory = exports.requests = exports.jobs = exports.issues = exports.equipment = exports.users = exports.departments = void 0;
const types_1 = require("./types");
exports.departments = [
    { dept_id: "D001", dept_name: "IT Infrastructure" },
];
exports.users = [
    { user_id: "U001", firstname: "Admin", lastname: "System", email: "thanawut@techjob.th", tel: "081-234-5678", role: types_1.Role.ADMIN, dept_id: "D001", avatar_color: "#3B82F6" },
];
exports.equipment = [];
exports.issues = [];
exports.jobs = [];
exports.requests = [];
exports.equipmentHistory = [];
