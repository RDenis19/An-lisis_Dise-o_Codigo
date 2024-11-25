const db = require('../database/db');

const Nurse = {
  getAll: (callback) => {
    db.query('SELECT * FROM enfermeras', callback);
  },
  create: (nurseData, callback) => {
    const { nombre, telefono, correo, direccion } = nurseData;
    db.query(
      'INSERT INTO enfermeras (nombre, telefono, correo, direccion) VALUES (?, ?, ?, ?)',
      [nombre, telefono, correo, direccion],
      callback
    );
  },
  update: (id, nurseData, callback) => {
    const { nombre, telefono, correo, direccion } = nurseData;
    db.query(
      'UPDATE enfermeras SET nombre = ?, telefono = ?, correo = ?, direccion = ? WHERE id = ?',
      [nombre, telefono, correo, direccion, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.query('DELETE FROM enfermeras WHERE id = ?', [id], callback);
  },
};

module.exports = Nurse;