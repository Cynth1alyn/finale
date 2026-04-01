"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Priority = exports.RequestStatus = exports.JobStatus = exports.IssueStatus = exports.EquipmentStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["MANAGER"] = "manager";
    Role["TECHNICIAN"] = "technician";
    Role["STAFF"] = "staff";
})(Role || (exports.Role = Role = {}));
var EquipmentStatus;
(function (EquipmentStatus) {
    EquipmentStatus["OPERATIONAL"] = "operational";
    EquipmentStatus["MAINTENANCE"] = "maintenance";
    EquipmentStatus["OUT_OF_ORDER"] = "out-of-order";
    EquipmentStatus["DECOMMISSIONED"] = "decommissioned";
})(EquipmentStatus || (exports.EquipmentStatus = EquipmentStatus = {}));
var IssueStatus;
(function (IssueStatus) {
    IssueStatus["OPEN"] = "open";
    IssueStatus["IN_PROGRESS"] = "in-progress";
    IssueStatus["RESOLVED"] = "resolved";
    IssueStatus["CLOSED"] = "closed";
})(IssueStatus || (exports.IssueStatus = IssueStatus = {}));
var JobStatus;
(function (JobStatus) {
    JobStatus["PENDING"] = "pending";
    JobStatus["IN_PROGRESS"] = "in-progress";
    JobStatus["DONE"] = "done";
    JobStatus["CANCELLED"] = "cancelled";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "pending";
    RequestStatus["APPROVED"] = "approved";
    RequestStatus["REJECTED"] = "rejected";
    RequestStatus["FULFILLED"] = "fulfilled";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var Priority;
(function (Priority) {
    Priority["LOW"] = "low";
    Priority["MEDIUM"] = "medium";
    Priority["HIGH"] = "high";
    Priority["URGENT"] = "urgent";
})(Priority || (exports.Priority = Priority = {}));
