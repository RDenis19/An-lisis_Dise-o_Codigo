const db = require('../database/db');

const User = {
  findByEmail: (correo, callback) => {
    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], callback);
  },
  create: (userData, callback) => {
    const { nombre, correo, contrasena, rol } = userData;
    db.query(
      'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
      [nombre, correo, contrasena, rol],
      callback
    );
  },
};

module.exports = User;