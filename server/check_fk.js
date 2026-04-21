const pool = require('./db');

async function checkFK() {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                TABLE_NAME, 
                COLUMN_NAME, 
                CONSTRAINT_NAME, 
                REFERENCED_TABLE_NAME, 
                REFERENCED_COLUMN_NAME 
            FROM 
                INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE 
                REFERENCED_TABLE_SCHEMA = 'quantum_trade' 
                AND TABLE_NAME = 'confirmations'
        `);
        console.log('FK CONSTRAINTS ON confirmations:', JSON.stringify(rows, null, 2));

        const [createTable] = await pool.execute('SHOW CREATE TABLE confirmations');
        console.log('CREATE TABLE confirmations:', createTable[0]['Create Table']);

        process.exit(0);
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
}

checkFK();
