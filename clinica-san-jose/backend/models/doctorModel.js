const db = require('../config/db');

// Obtener todos los doctores
exports.getAllDoctors = (callback) => {
    db.query('SELECT * FROM doctores', (err, results) => {  // Cambié doctors a doctores
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// Agregar un nuevo doctor
exports.addDoctor = (doctor, callback) => {
    const { nombre, especialidad, telefono, correo, fecha_contratacion } = doctor;
    const query = 'INSERT INTO doctores (nombre, especialidad, telefono, correo, fecha_contratacion) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, especialidad, telefono, correo, fecha_contratacion], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// Actualizar información del doctor
exports.updateDoctor = (id, doctor, callback) => {
    const { nombre, especialidad, telefono, correo, fecha_contratacion } = doctor;
    const query = 'UPDATE doctores SET nombre = ?, especialidad = ?, telefono = ?, correo = ?, fecha_contratacion = ? WHERE id = ?';
    db.query(query, [nombre, especialidad, telefono, correo, fecha_contratacion, id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// Eliminar un doctor
exports.deleteDoctor = (id, callback) => {
    const query = 'DELETE FROM doctores WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};
