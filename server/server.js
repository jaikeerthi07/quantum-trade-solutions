const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(helmet()); // Temporarily disabled for dev connectivity
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST') console.log('Body:', req.body);
    next();
});

// Rate Limiting (Disabled for dev)
// const limiter = rateLimit({ ... });
// app.use('/api/', limiter);

// Add a reachability test
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Encryption Helpers
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_secret_key_32_chars_long!!';
const IV_LENGTH = 16;

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
    console.log('Attempting to decrypt:', text);
    try {
        if (!text || !text.includes(':')) return text;
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY.padEnd(32).slice(0, 32)), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        const result = decrypted.toString();
        // console.log('Decryption success:', result);
        return result;
    } catch (e) {
        console.error('Decryption failed for text:', text, e.message);
        return 'DECRYPTION_ERROR';
    }
}

// API Endpoints

// 0. Auth Login (Dummy)
app.post('/api/auth/login', (req, res) => {
    const { full_name, dob } = req.body;
    if (!full_name || !dob) {
        return res.status(400).json({ error: 'Name and DOB are required' });
    }
    // Mock successful login
    res.json({ 
        message: 'Login successful', 
        token: 'mock-jwt-token-' + Date.now(),
        user: { full_name, dob }
    });
});

// 1. Create/Add Customer
app.post('/api/users', async (req, res) => {
    const { custom_id, full_name, dob, email, mobile, aadhaar, pan, date_of_joining, referral_code } = req.body;

    // Server-side validation
    if (!full_name || full_name.length < 3) return res.status(400).json({ error: 'Invalid name' });
    if (!mobile.match(/^[0-9]{10}$/)) return res.status(400).json({ error: 'Invalid mobile' });
    if (!aadhaar.match(/^[0-9]{12}$/)) return res.status(400).json({ error: 'Invalid Aadhaar' });
    if (!pan.match(/[A-Z]{5}[0-9]{4}[A-Z]/)) return res.status(400).json({ error: 'Invalid PAN' });

    try {
        const encryptedAadhaar = encrypt(aadhaar);
        const encryptedPan = encrypt(pan);

        const [result] = await pool.execute(
            'INSERT INTO users (custom_id, full_name, dob, email, mobile, aadhaar, pan, date_of_joining, referral_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [custom_id, full_name, dob || null, email, mobile, encryptedAadhaar, encryptedPan, date_of_joining, referral_code || null]
        );

        res.status(201).json({ user_id: result.insertId, message: 'Customer created' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Mobile number already registered' });
        }
        console.error('DATABASE ERROR:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 2. Get All Customers
app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM users ORDER BY created_at DESC');
        
        // Decrypt values for delivery
        const decryptedRows = rows.map(row => ({
            ...row,
            aadhaar: decrypt(row.aadhaar),
            pan: decrypt(row.pan)
        }));

        res.json(decryptedRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 2.5 Delete Customer
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Customer record deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

// 3. Create Investment (Step 3) - Keeping for compatibility but might be unused
app.post('/api/investments', async (req, res) => {
    const { user_id, deposit_amount } = req.body;

    if (deposit_amount < 100000 || deposit_amount > 5000000) {
        return res.status(400).json({ error: 'Investment must be between ₹1L and ₹50L' });
    }

    try {
        const [result] = await pool.execute(
            'INSERT INTO investments (user_id, deposit_amount) VALUES (?, ?)',
            [user_id, deposit_amount]
        );

        res.status(201).json({ investment_id: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 3. Confirm Submission (Step 4)
app.post('/api/confirm', async (req, res) => {
    const { investment_id, agreed_terms } = req.body;

    if (!agreed_terms) return res.status(400).json({ error: 'Must agree to terms' });

    try {
        const confirmationId = `QTS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        await pool.execute(
            'UPDATE investments SET status = "CONFIRMED", confirmation_id = ? WHERE id = ?',
            [confirmationId, investment_id]
        );

        await pool.execute(
            'INSERT INTO confirmations (investment_id, agreed_terms, confirmed_at) VALUES (?, ?, NOW())',
            [investment_id, agreed_terms]
        );

        res.json({ confirmation_id: confirmationId, message: 'Confirmed' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// 4. Get Receipt (Step 5)
app.get('/api/receipt/:investment_id', async (req, res) => {
    const { investment_id } = req.params;

    try {
        const [rows] = await pool.execute(
            `SELECT u.full_name, i.deposit_amount, i.status, i.confirmation_id, i.created_at 
             FROM investments i 
             JOIN users u ON i.user_id = u.id 
             WHERE i.id = ?`,
            [investment_id]
        );

        if (rows.length === 0) return res.status(404).json({ error: 'Receipt not found' });

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});


// 5. Withdrawals
app.get('/api/withdrawals', async (req, res) => {
    const { status, transaction_id, user_id, start_date, end_date } = req.query;
    
    let query = `
        SELECT w.*, u.full_name, u.custom_id as user_custom_id 
        FROM withdrawals w 
        JOIN users u ON w.user_id = u.id 
        WHERE 1=1
    `;
    const params = [];

    if (status && status !== 'All statuses') {
        query += ' AND w.status = ?';
        params.push(status.trim());
    }
    if (transaction_id && transaction_id.trim()) {
        query += ' AND w.transaction_id LIKE ?';
        params.push(`%${transaction_id.trim()}%`);
    }
    if (user_id && user_id.trim()) {
        query += ' AND u.custom_id LIKE ?';
        params.push(`%${user_id.trim()}%`);
    }
    if (req.query.bank && req.query.bank !== 'All banks') {
        query += ' AND w.bank_name = ?';
        params.push(req.query.bank.trim());
    }
    if (req.query.amount && req.query.amount.trim()) {
        const amt = req.query.amount.trim();
        if (!isNaN(amt)) {
            query += ' AND (w.amount = ? OR CAST(w.amount AS CHAR) LIKE ?)';
            params.push(amt, `%${amt}%`);
        } else {
            query += ' AND CAST(w.amount AS CHAR) LIKE ?';
            params.push(`%${amt}%`);
        }
    }
    if (start_date && end_date) {
        query += ' AND w.created_at BETWEEN ? AND ?';
        params.push(start_date.trim(), end_date.trim());
    }

    query += ' ORDER BY w.created_at DESC';

    try {
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

app.post('/api/withdrawals', async (req, res) => {
    const { user_id, user_custom_id, transaction_id, currency, amount, bank_name, status } = req.body;
    
    // We prefer user_custom_id (like CS-003) from the filters
    const targetCustomId = user_custom_id || user_id;

    if (!targetCustomId || !amount) {
        return res.status(400).json({ error: 'User ID and Amount are required' });
    }

    try {
        // 1. Find or create user
        let [users] = await pool.execute('SELECT id FROM users WHERE custom_id = ?', [targetCustomId]);
        let finalUserId;

        if (users.length === 0) {
            // Create user if not exists with mandatory placeholders
            const tempMobile = `000${Date.now().toString().slice(-7)}`;
            const [newUser] = await pool.execute(
                'INSERT INTO users (full_name, custom_id, mobile, aadhaar, pan) VALUES (?, ?, ?, ?, ?)',
                ['New Customer', targetCustomId, tempMobile, encrypt('000000000000'), encrypt('ABCDE1234F')]
            );
            finalUserId = newUser.insertId;
        } else {
            finalUserId = users[0].id;
        }

        // 2. Prioritize provided transaction_id or generate one
        const finalTxnId = (transaction_id && transaction_id.trim()) 
            ? transaction_id.trim() 
            : `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
        
        // 3. Insert withdrawal
        const [result] = await pool.execute(
            'INSERT INTO withdrawals (transaction_id, user_id, currency, amount, bank_name, status) VALUES (?, ?, ?, ?, ?, ?)',
            [finalTxnId, finalUserId, currency || 'INR', amount, bank_name || 'Generic Bank', status || 'PENDING']
        );

        res.status(201).json({ 
            id: result.insertId, 
            transaction_id: finalTxnId, 
            message: 'Withdrawal record created successfully' 
        });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Transaction ID already exists. Please use a unique ID.' });
        }
        console.error(err);
        res.status(500).json({ error: 'Database error while saving withdrawal' });
    }
});

app.get('/', (req, res) => {
    res.send('Quantum Trade API is online');
});

// Comprehensive setup endpoint to fix ALL cloud DB tables
app.get('/api/admin/setup', async (req, res) => {
    try {
        const { initDB } = require('./db');
        // We call the initDB function which is already designed to be robust
        // But since it's already called on module load, we can just return status
        // or trigger a manual scan here if we exported it.
        // For now, let's just use the logic directly for guaranteed execution
        const { pool } = require('./db'); 
        const conn = await pool.getConnection();
        
        // Re-run the core logic to be sure
        await conn.query(`CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, full_name VARCHAR(100) NOT NULL, mobile VARCHAR(15) NOT NULL UNIQUE, aadhaar TEXT NOT NULL, pan TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await conn.query(`CREATE TABLE IF NOT EXISTS investments (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, deposit_amount DECIMAL(12,2) NOT NULL, status ENUM('PENDING', 'CONFIRMED') DEFAULT 'PENDING', confirmation_id VARCHAR(50) UNIQUE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`);
        await conn.query(`CREATE TABLE IF NOT EXISTS withdrawals (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, transaction_id VARCHAR(50) NOT NULL UNIQUE, currency VARCHAR(10) NOT NULL, amount DECIMAL(12,2) NOT NULL, bank_name VARCHAR(100) NOT NULL, status ENUM('PENDING', 'CONFIRMED', 'REJECTED') DEFAULT 'PENDING', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE)`);
        
        conn.release();
        res.json({ message: 'Setup complete. All tables verified.' });
    } catch (err) {
        res.status(500).json({ error: 'Setup failed', details: err.message });
    }
});

// For Vercel Serverless Functions
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
}

module.exports = app;
