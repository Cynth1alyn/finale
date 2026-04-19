import { Router } from 'express';
import { DepartmentService } from '../services/DepartmentService';
import { authorizeRoles } from '../middleware/authorize';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const departments = await DepartmentService.getAllDepartments();
    res.json({ success: true, data: departments });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const dept = await DepartmentService.getDepartmentById(req.params.id);
    if (!dept) return res.status(404).json({ success: false, error: 'Department not found' });
    res.json({ success: true, data: dept });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.post('/', authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const id = await DepartmentService.createDepartment(req.body);
    res.status(201).json({ success: true, data: { ...req.body, dept_id: id } });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

router.put('/:id', authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const updated = await DepartmentService.updateDepartment(req.params.id, req.body);
    res.json({ success: true, message: 'Updated successfully', data: updated });
  } catch (error) {
    const status = (error as Error).message.includes('not found') ? 404 : 500;
    res.status(status).json({ success: false, error: String(error) });
  }
});

router.delete('/:id', authorizeRoles('admin', 'manager'), async (req, res) => {
  try {
    const deleted = await DepartmentService.deleteDepartment(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, error: 'Department not found' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

export default router;