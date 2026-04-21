const pool = require('./db');
async function check() {
  try {
    const status = 'CONFIRMED';
    const transaction_id = '234567890';
    const user_id = 'CS-003';
    const bank = 'State Bank of India';
    const amount = '300';
    
    let query = `
        SELECT w.*, u.full_name, u.custom_id as user_custom_id 
        FROM withdrawals w 
        JOIN users u ON w.user_id = u.id 
        WHERE 1=1
    `;
    const params = [];
    if (status) { query += ' AND w.status = ?'; params.push(status); }
    if (transaction_id) { query += ' AND w.transaction_id LIKE ?'; params.push(`%${transaction_id}%`); }
    if (user_id) { query += ' AND u.custom_id LIKE ?'; params.push(`%${user_id}%`); }
    if (bank) { query += ' AND w.bank_name = ?'; params.push(bank); }
    if (amount) { query += ' AND w.amount = ?'; params.push(amount); }

    const [rows] = await pool.execute(query, params);
    console.log('Found:', rows.length);
    console.log('Rows:', rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}
check();
