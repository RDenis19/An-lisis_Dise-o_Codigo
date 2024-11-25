// backend/controllers/nurseController.js
const connection = require('../database/db');

// Obtener todas las enfermeras
exports.getNurses = (req, res) => {
    const query = 'SELECT e.*, u.contrasena FROM enfermeras e INNER JOIN usuarios u ON e.usuario_id = u.id';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener enfermeras:', err);
            return res.status(500).json({ message: 'Error al obtener enfermeras' });
        }
        res.status(200).json(results);
    });
};

// Obtener una enfermera específica
exports.getNurseById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT e.*, u.contrasena FROM enfermeras e INNER JOIN usuarios u ON e.usuario_id = u.id WHERE e.id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener la enfermera:', err);
            return res.status(500).json({ message: 'Error al obtener la enfermera' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Enfermera no encontrada' });
        }
        res.status(200).json(result[0]);
    });
};

// Crear enfermera (y usuario correspondiente)
exports.createNurse = (req, res) => {
    const { nombre, telefono, correo, direccion, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Primero crear el usuario
    const createUserQuery = `
        INSERT INTO usuarios (nombre, correo, contrasena, rol)
        VALUES (?, ?, ?, 'enfermera')`;

    connection.query(createUserQuery, [nombre, correo, contrasena], (err, userResult) => {
        if (err) {
            console.error('Error al crear el usuario:', err);
            return res.status(500).json({ message: 'Error al crear el usuario' });
        }

        // Luego crear la enfermera con el ID del usuario recién creado
        const usuarioId = userResult.insertId;
        const createNurseQuery = `
            INSERT INTO enfermeras (nombre, telefono, correo, direccion, usuario_id)
            VALUES (?, ?, ?, ?, ?)`;

        connection.query(createNurseQuery, [nombre, telefono, correo, direccion, usuarioId], (err, nurseResult) => {
            if (err) {
                console.error('Error al crear la enfermera:', err);
                return res.status(500).json({ message: 'Error al crear la enfermera' });
            }
            res.status(201).json({ message: 'Enfermera creada correctamente' });
        });
    });
};

// Editar enfermera
exports.editNurse = (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, correo, direccion, contrasena } = req.body;

    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Primero, actualizar los datos del usuario (incluyendo la contraseña)
    const updateUserQuery = `
        UPDATE usuarios 
        SET nombre = ?, correo = ?, contrasena = ? 
        WHERE id = (SELECT usuario_id FROM enfermeras WHERE id = ?)`;

    connection.query(updateUserQuery, [nombre, correo, contrasena, id], (err, userResult) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }

        // Luego, actualizar los datos de la enfermera
        const updateNurseQuery = `
            UPDATE enfermeras 
            SET nombre = ?, telefono = ?, correo = ?, direccion = ?
            WHERE id = ?`;

        connection.query(updateNurseQuery, [nombre, telefono, correo, direccion, id], (err, result) => {
            if (err) {
                console.error('Error al editar la enfermera:', err);
                return res.status(500).json({ message: 'Error al editar la enfermera' });
            }
            res.status(200).json({ message: 'Enfermera editada correctamente' });
        });
    });
};

// Eliminar enfermera
exports.deleteNurse = (req, res) => {
    const { id } = req.params;

    // Primero eliminar el usuario relacionado
    const getUserIdQuery = `SELECT usuario_id FROM enfermeras WHERE id = ?`;
    connection.query(getUserIdQuery, [id], (err, result) => {
        if (err || result.length === 0) {
            console.error('Error al buscar el usuario relacionado:', err);
            return res.status(500).json({ message: 'Error al buscar el usuario relacionado' });
        }

        const usuarioId = result[0].usuario_id;

        const deleteNurseQuery = `DELETE FROM enfermeras WHERE id = ?`;
        connection.query(deleteNurseQuery, [id], (err, nurseResult) => {
            if (err) {
                console.error('Error al eliminar la enfermera:', err);
                return res.status(500).json({ message: 'Error al eliminar la enfermera' });
            }

            const deleteUserQuery = `DELETE FROM usuarios WHERE id = ?`;
            connection.query(deleteUserQuery, [usuarioId], (err, userResult) => {
                if (err) {
                    console.error('Error al eliminar el usuario:', err);
                    return res.status(500).json({ message: 'Error al eliminar el usuario' });
                }
                res.status(200).json({ message: 'Enfermera y usuario eliminados correctamente' });
            });
        });
    });
};
