"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentService = void 0;
const EquipmentRepository_1 = require("../repositories/EquipmentRepository");
const db_1 = require("../lib/db");
class EquipmentService {
    static async getAllEquipment(params = {}) {
        return await EquipmentRepository_1.EquipmentRepository.findAll(params);
    }
    static async getEquipmentById(id) {
        return await EquipmentRepository_1.EquipmentRepository.findById(id);
    }
    static async getEquipmentHistory(id, limit, offset) {
        return await EquipmentRepository_1.EquipmentRepository.findHistoryByEquipId(id, limit, offset);
    }
    static async createEquipment(data) {
        return await EquipmentRepository_1.EquipmentRepository.create(data);
    }
    static async updateEquipment(id, data) {
        await EquipmentRepository_1.EquipmentRepository.update(id, data);
        return await EquipmentRepository_1.EquipmentRepository.findById(id);
    }
    static async checkoutEquipment(equipId, userId, qty, notes) {
        return await (0, db_1.withTransaction)(async (connection) => {
            const equip = await EquipmentRepository_1.EquipmentRepository.findById(equipId);
            if (!equip)
                throw new Error('Equipment not found');
            if (equip.remain_qty < qty) {
                throw new Error('จำนวนอุปกรณ์ในสต็อกไม่เพียงพอ');
            }
            const newRemainQty = equip.remain_qty - qty;
            // Update equipment remaining quantity
            await EquipmentRepository_1.EquipmentRepository.update(equipId, { remain_qty: newRemainQty }, connection);
            // Add to history
            await EquipmentRepository_1.EquipmentRepository.addHistory({
                equip_id: equipId,
                user_id: userId,
                action: 'check-out',
                notes: notes || `เบิกออก ${qty} ชิ้น`,
                date: new Date().toISOString().slice(0, 10)
            }, connection);
            return { ...equip, remain_qty: newRemainQty };
        });
    }
    static async deleteEquipment(id) {
        return await EquipmentRepository_1.EquipmentRepository.delete(id);
    }
}
exports.EquipmentService = EquipmentService;
