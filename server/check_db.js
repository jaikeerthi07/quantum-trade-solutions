const pool = require('./db');

async function check() {
    try {
        const [rows] = await pool.execute('SELECT * FROM users');
        console.log('RECORDS IN users TABLE:', rows.length);
        rows.forEach(r => console.log(`- ID: ${r.id}, Name: ${r.full_name}, CustomID: ${r.custom_id}`));
        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

check();
