const pool = require('./db');
async function check() {
  try {
    const [rows] = await pool.execute('SHOW TABLES');
    console.log('Tables:', rows);
    const [withdrawals] = await pool.execute('SELECT COUNT(*) as count FROM withdrawals');
    console.log('Withdrawals count:', withdrawals[0].count);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}
check();
