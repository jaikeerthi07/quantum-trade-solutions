CREATE DATABASE IF NOT EXISTS quantum_trade;
USE quantum_trade;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    custom_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    dob DATE,
    email VARCHAR(100),
    mobile VARCHAR(15) NOT NULL UNIQUE,
    aadhaar VARCHAR(255) NOT NULL,
    pan VARCHAR(255) NOT NULL,
    referral_code VARCHAR(50),
    date_of_joining DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    deposit_amount DECIMAL(12,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED') DEFAULT 'PENDING',
    confirmation_id VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS confirmations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    investment_id INT NOT NULL,
    agreed_terms BOOLEAN DEFAULT FALSE,
    confirmed_at TIMESTAMP,

    FOREIGN KEY (investment_id) REFERENCES investments(id) ON DELETE CASCADE
);

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
);
