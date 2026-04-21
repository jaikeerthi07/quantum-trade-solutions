const pool = require('./db');

async function fixSchema() {
    try {
        console.log('Starting schema update...');
        
        // 1. Drop the existing foreign key
        // Note: The constraint name was found to be 'confirmations_ibfk_1' in previous research
        try {
            await pool.execute('ALTER TABLE confirmations DROP FOREIGN KEY confirmations_ibfk_1');
            console.log('Successfully dropped old foreign key.');
        } catch (err) {
            console.warn('Could not drop foreign key (it may have been dropped already):', err.message);
        }

        // 2. Add the foreign key back with ON DELETE CASCADE
        await pool.execute(`
            ALTER TABLE confirmations 
            ADD CONSTRAINT confirmations_ibfk_1 
            FOREIGN KEY (investment_id) 
            REFERENCES investments(id) 
            ON DELETE CASCADE
        `);
        console.log('Successfully added foreign key with ON DELETE CASCADE.');

        console.log('Schema update complete.');
        process.exit(0);
    } catch (err) {
        console.error('FATAL ERROR during schema update:', err);
        process.exit(1);
    }
}

fixSchema();
