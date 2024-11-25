const db = require('../database/db');

const Doctor = {
  getAll: (callback) => {
    db.query('SELECT * FROM doctores', callback);
  },
  create: (doctorData, callback) => {
    const { nombre, especialidad, telefono, correo, direccion } = doctorData;
    db.query(
      'INSERT INTO doctores (nombre, especialidad, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)',
      [nombre, especialidad, telefono, correo, direccion],
      callback
    );
  },
  update: (id, doctorData, callback) => {
    const { nombre, especialidad, telefono, correo, direccion } = doctorData;
    db.query(
      'UPDATE doctores SET nombre = ?, especialidad = ?, telefono = ?, correo = ?, direccion = ? WHERE id = ?',
      [nombre, especialidad, telefono, correo, direccion, id],
      callback
    );
  },
  delete: (id, callback) => {
    db.query('DELETE FROM doctores WHERE id = ?', [id], callback);
  },
};

module.exports = Doctor;