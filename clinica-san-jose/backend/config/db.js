// backend/config/db.js
const mysql = require('mysql');

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Cambia esto según tus credenciales
    password: '123456789',  // Cambia esto según tus credenciales
    database: 'clinica_san_jose'
});

db.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = db;
