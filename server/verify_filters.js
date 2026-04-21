const pool = require('./db');
async function check() {
  try {
    // Test 1: Partial Transaction ID
    const transaction_id = '2345';
    let query1 = 'SELECT transaction_id FROM withdrawals WHERE transaction_id LIKE ?';
    const [rows1] = await pool.execute(query1, [`%${transaction_id.trim()}%`]);
    console.log('Partial Match (2345):', rows1.map(r => r.transaction_id));

    // Test 2: Whitespace User ID
    const user_id = '   CS-003   ';
    let query2 = 'SELECT u.custom_id FROM withdrawals w JOIN users u ON w.user_id = u.id WHERE u.custom_id LIKE ?';
    const [rows2] = await pool.execute(query2, [`%${user_id.trim()}%`]);
    console.log('Whitespace Match (   CS-003   ):', rows2.length > 0 ? 'Success' : 'Failed');

    // Test 3: Partial Amount match
    const amount = '100';
    let query3 = 'SELECT amount FROM withdrawals WHERE CAST(amount AS CHAR) LIKE ?';
    const [rows3] = await pool.execute(query3, [`%${amount.trim()}%`]);
    console.log('Partial Amount Match (100):', rows3.map(r => r.amount));

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}
check();
