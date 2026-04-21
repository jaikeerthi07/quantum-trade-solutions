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

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                custom_id VARCHAR(50),
                full_name VARCHAR(100) NOT NULL,
                dob DATE,
                email VARCHAR(100),
                mobile VARCHAR(15) NOT NULL UNIQUE,
                aadhaar VARCHAR(255) NOT NULL,
                pan VARCHAR(255) NOT NULL,
                date_of_joining DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Update existing table if columns are missing
        const columns = ['custom_id', 'email', 'date_of_joining', 'referral_code'];
        for (const col of columns) {
            try {
                await connection.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS ${col} ${col === 'date_of_joining' ? 'DATE' : 'VARCHAR(100)'}`);
            } catch (e) {
                // Ignore if column already exists
            }
        }

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

        await connection.query(`
            CREATE TABLE IF NOT EXISTS withdrawals (
                id INT AUTO_INCREMENT PRIMARY KEY,
                transaction_id VARCHAR(50) NOT NULL UNIQUE,
                user_id INT NOT NULL,
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
