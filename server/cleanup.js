const pool = require('./db');

async function clearData() {
    try {
        console.log('Clearing test data from users table...');
        await pool.query('SET FOREIGN_KEY_CHECKS = 0');
        await pool.query('TRUNCATE TABLE users');
        await pool.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Successfully cleared all records.');
        process.exit(0);
    } catch (err) {
        console.error('Error clearing data:', err);
        process.exit(1);
    }
}

clearData();
