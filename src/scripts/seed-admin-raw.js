const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../dev.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
        process.exit(1);
    }
});

const adminId = 'admin_' + Date.now();
const username = 'owner';
// This is the bcrypt hash of "password123" generated earlier
const passwordHash = '$2b$10$nL2c8vGoVhyuwtzVnwwELOi/jsiTGYRZZXDz.s90g.2IIz5AJg1xW';
const timestamp = new Date().toISOString();

const stmt = `INSERT INTO Admin (id, username, passwordHash, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)`;

db.run(stmt, [adminId, username, passwordHash, timestamp, timestamp], function (err) {
    if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            console.log('Admin user already exists.');
        } else {
            console.error('Error inserting admin user:', err.message);
        }
    } else {
        console.log(`Created initial admin user: ${username} (Record ID: ${this.lastID})`);
    }

    db.close((err) => {
        if (err) {
            console.error('Error closing database', err.message);
        }
    });
});
