"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }
        if (!roles.includes(user.role)) {
            return res.status(403).json({ success: false, error: 'Access denied: insufficient permissions' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
