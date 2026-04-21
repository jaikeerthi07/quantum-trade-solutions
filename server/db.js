const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
};

const database = process.env.DB_NAME;

// Cloud-optimized Pool configuration
const pool = mysql.createPool({
    ...dbConfig,
    database: database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    // Add SSL support for cloud providers (Aiven, Railway, etc.)
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});

// Test connection and create tables if they don't exist
async function initDB() {
    if (!dbConfig.host) return;
    try {
        const connection = await pool.getConnection();
        console.log(`Connected to MySQL database: ${database}`);

        // 1. Users Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                mobile VARCHAR(15) NOT NULL UNIQUE,
                aadhaar TEXT NOT NULL,
                pan TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Update Users Columns
        const userCols = [
            { name: 'custom_id', type: 'VARCHAR(100)' },
            { name: 'email', type: 'VARCHAR(100)' },
            { name: 'date_of_joining', type: 'DATE' },
            { name: 'referral_code', type: 'VARCHAR(100)' },
            { name: 'dob', type: 'DATE' }
        ];

        for (const col of userCols) {
            try {
                await connection.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
            } catch (e) {
                if (e.errno !== 1060) console.warn(`Notice: Column ${col.name} failed:`, e.message);
            }
        }

        // 2. Investments Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS investments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                deposit_amount DECIMAL(12,2) NOT NULL,
                status ENUM('PENDING', 'CONFIRMED') DEFAULT 'PENDING',
                confirmation_id VARCHAR(50) UNIQUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        // 3. Withdrawals Table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS withdrawals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                transaction_id VARCHAR(50) NOT NULL UNIQUE,
                currency VARCHAR(10) NOT NULL,
                amount DECIMAL(12,2) NOT NULL,
                bank_name VARCHAR(100) NOT NULL,
                status ENUM('PENDING', 'CONFIRMED', 'REJECTED') DEFAULT 'PENDING',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('Database tables verified/created.');
        connection.release();
    } catch (err) {
        console.error('Error connecting to database:', err);
    }
}

initDB();

module.exports = pool;
