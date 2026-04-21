const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mysql = require('mysql2/promise');

async function fix() {
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
    };

    console.log('Connecting to database:', dbConfig.database);
    
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Successfully connected.');

        // 1. Add referral_code if missing
        console.log('Checking for referral_code column...');
        const [columns] = await connection.query('SHOW COLUMNS FROM users LIKE "referral_code"');
        
        if (columns.length === 0) {
            console.log('Adding referral_code column to users table...');
            await connection.query('ALTER TABLE users ADD COLUMN referral_code VARCHAR(100)');
            console.log('Column added successfully.');
        } else {
            console.log('referral_code column already exists.');
        }

        // 2. Add other columns that might be missing just in case
        const checkCols = [
            { name: 'custom_id', type: 'VARCHAR(50)' },
            { name: 'email', type: 'VARCHAR(100)' },
            { name: 'date_of_joining', type: 'DATE' }
        ];

        for (const col of checkCols) {
            const [exists] = await connection.query(`SHOW COLUMNS FROM users LIKE "${col.name}"`);
            if (exists.length === 0) {
                console.log(`Adding missing column: ${col.name}`);
                await connection.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
            }
        }

        console.log('Schema update completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('FAILED TO UPDATE SCHEMA:', err);
        process.exit(1);
    } finally {
        if (connection) await connection.end();
    }
}

fix();
