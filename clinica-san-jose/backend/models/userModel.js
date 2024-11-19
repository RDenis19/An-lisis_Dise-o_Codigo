const db = require('../config/db');

// Función para buscar al usuario por correo
exports.findUserByEmail = (correo) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuarios WHERE correo = ?';
        db.query(query, [correo], (err, results) => {
            if (err) reject(err);
            resolve(results[0]);
        });
    });
};
