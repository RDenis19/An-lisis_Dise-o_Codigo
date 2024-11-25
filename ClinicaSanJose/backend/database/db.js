// backend/database/db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Cambia según tu configuración de MySQL
  password: '123456789', // Cambia según tu configuración de MySQL
  database: 'ClinicaSanJose'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida correctamente.');
});

module.exports = connection;
