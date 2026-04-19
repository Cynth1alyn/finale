import jwt from 'jsonwebtoken';
import http from 'http';

const JWT_SECRET = 'your-secret-key';
const token = jwt.sign(
  { user_id: 'U004', email: 'manager_infra1@techjob.th', role: 'manager' },
  JWT_SECRET,
  { expiresIn: '24h' }
);

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/jobs',
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data));
});
req.on('error', e => console.error(e));
req.end();
