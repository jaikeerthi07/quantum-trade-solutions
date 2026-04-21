const pool = require('./db');
async function check() {
  try {
    const [rows] = await pool.execute('SELECT w.*, u.full_name FROM withdrawals w JOIN users u ON w.user_id = u.id');
    console.log('Joined Withdrawal Records:', rows.length);
    if (rows.length > 0) {
      console.log('First record:', rows[0]);
    } else {
      const [u] = await pool.execute('SELECT id FROM users');
      console.log('User IDs:', u.map(row => row.id));
      const [w] = await pool.execute('SELECT user_id FROM withdrawals');
      console.log('Withdrawal User IDs:', w.map(row => row.user_id));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}
check();
