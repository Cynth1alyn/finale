import { EquipmentRepository } from '../repositories/EquipmentRepository';
import { withTransaction } from '../lib/db';
import { Equipment, EquipmentHistory } from '../lib/types';

export class EquipmentService {
  static async getAllEquipment(params: { limit?: number; offset?: number; status?: string; dept_id?: string } = {}) {
    return await EquipmentRepository.findAll(params);
  }

  static async getEquipmentById(id: string) {
    return await EquipmentRepository.findById(id);
  }

  static async getEquipmentHistory(id: string, limit?: number, offset?: number) {
    return await EquipmentRepository.findHistoryByEquipId(id, limit, offset);
  }

  static async createEquipment(data: Partial<Equipment>) {
    return await EquipmentRepository.create(data);
  }

  static async updateEquipment(id: string, data: Partial<Equipment>) {
    await EquipmentRepository.update(id, data);
    return await EquipmentRepository.findById(id);
  }

  static async checkoutEquipment(equipId: string, userId: string, qty: number, notes?: string) {
    return await withTransaction(async (connection) => {
      const equip = await EquipmentRepository.findById(equipId);
      if (!equip) throw new Error('Equipment not found');

      if (equip.remain_qty < qty) {
        throw new Error('จำนวนอุปกรณ์ในสต็อกไม่เพียงพอ');
      }

      const newRemainQty = equip.remain_qty - qty;
      
      // Update equipment remaining quantity
      await EquipmentRepository.update(equipId, { remain_qty: newRemainQty }, connection);

      // Add to history
      await EquipmentRepository.addHistory({
        equip_id: equipId,
        user_id: userId,
        action: 'check-out',
        notes: notes || `เบิกออก ${qty} ชิ้น`,
        date: new Date().toISOString().slice(0, 10)
      }, connection);

      return { ...equip, remain_qty: newRemainQty };
    });
  }

  static async deleteEquipment(id: string) {
    return await EquipmentRepository.delete(id);
  }
}
