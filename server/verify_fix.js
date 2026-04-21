const http = require('http');

const data = JSON.stringify({
  user_custom_id: 'CS-AUTO-FIX',
  amount: '555.00',
  bank_name: 'Auto Fix Bank',
  currency: 'INR',
  status: 'PENDING'
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/withdrawals',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', body);
    process.exit();
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});

req.write(data);
req.end();
