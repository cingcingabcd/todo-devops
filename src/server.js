const mysql = require('mysql2/promise');
const { createApp } = require('./app');

// Konfigurasi lewat environment variable (lihat .env.example)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'todo',
  password: process.env.DB_PASSWORD || 'todo',
  database: process.env.DB_NAME || 'tododb',
});

const port = Number(process.env.PORT || 3000);
createApp(pool).listen(port, () => console.log('Server berjalan di port ' + port));
