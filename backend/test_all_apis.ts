import jwt from 'jsonwebtoken';
import http from 'http';

const JWT_SECRET = 'your-secret-key';
const token = jwt.sign(
  { user_id: 'U004', email: 'manager_infra1@techjob.th', role: 'manager' },
  JWT_SECRET,
  { expiresIn: '24h' }
);

function makeReq(path: string) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api' + path,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    };
    http.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ path, status: res.statusCode, data: data.substring(0, 100) }));
    }).end();
  });
}

async function run() {
  console.log(await makeReq('/jobs'));
  console.log(await makeReq('/issues'));
  console.log(await makeReq('/requests'));
  console.log(await makeReq('/equipment'));
  console.log(await makeReq('/users'));
}
run();
