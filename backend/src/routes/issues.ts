import { Router } from 'express';
import { issues } from '../lib/data';

const router = Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: issues });
});

router.get('/:id', (req, res) => {
  const issue = issues.find(i => i.issue_id === req.params.id);
  if (!issue) return res.status(404).json({ success: false, error: 'Issue not found' });
  res.json({ success: true, data: issue });
});

router.post('/', (req, res) => {
  const newIssue = { ...req.body, issue_id: 'I' + Date.now() };
  issues.push(newIssue);
  res.status(201).json({ success: true, data: newIssue });
});

router.put('/:id', (req, res) => {
  const index = issues.findIndex(i => i.issue_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Issue not found' });
  issues[index] = { ...issues[index], ...req.body };
  res.json({ success: true, data: issues[index] });
});

router.delete('/:id', (req, res) => {
  const index = issues.findIndex(i => i.issue_id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, error: 'Issue not found' });
  issues.splice(index, 1);
  res.json({ success: true, message: 'Deleted' });
});

export default router;
