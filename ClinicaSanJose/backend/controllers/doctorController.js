// backend/controllers/doctorController.js
const connection = require('../database/db');

// Obtener todos los doctores
exports.getDoctors = (req, res) => {
    const query = 'SELECT d.*, u.contrasena FROM doctores d INNER JOIN usuarios u ON d.usuario_id = u.id';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener doctores:', err);
            return res.status(500).json({ message: 'Error al obtener doctores' });
        }
        res.status(200).json(results);
    });
};

// Obtener un doctor específico
exports.getDoctorById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT d.*, u.contrasena FROM doctores d INNER JOIN usuarios u ON d.usuario_id = u.id WHERE d.id = ?';
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al obtener el doctor:', err);
            return res.status(500).json({ message: 'Error al obtener el doctor' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Doctor no encontrado' });
        }
        res.status(200).json(result[0]);
    });
};

// Crear doctor (y usuario correspondiente)
exports.createDoctor = (req, res) => {
    const { nombre, especialidad, telefono, correo, direccion, contrasena } = req.body;

    if (!nombre || !especialidad || !correo || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Primero crear el usuario
    const createUserQuery = `
        INSERT INTO usuarios (nombre, correo, contrasena, rol)
        VALUES (?, ?, ?, 'doctor')`;

    connection.query(createUserQuery, [nombre, correo, contrasena], (err, userResult) => {
        if (err) {
            console.error('Error al crear el usuario:', err);
            return res.status(500).json({ message: 'Error al crear el usuario' });
        }

        // Luego crear el doctor con el ID del usuario recién creado
        const usuarioId = userResult.insertId;
        const createDoctorQuery = `
            INSERT INTO doctores (nombre, especialidad, telefono, correo, direccion, usuario_id)
            VALUES (?, ?, ?, ?, ?, ?)`;

        connection.query(createDoctorQuery, [nombre, especialidad, telefono, correo, direccion, usuarioId], (err, doctorResult) => {
            if (err) {
                console.error('Error al crear el doctor:', err);
                return res.status(500).json({ message: 'Error al crear el doctor' });
            }
            res.status(201).json({ message: 'Doctor creado correctamente' });
        });
    });
};

// Editar doctor
exports.editDoctor = (req, res) => {
    const { id } = req.params;
    const { nombre, especialidad, telefono, correo, direccion, contrasena } = req.body;

    if (!nombre || !especialidad || !correo || !contrasena) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Primero, actualizar los datos del usuario (incluyendo la contraseña)
    const updateUserQuery = `
        UPDATE usuarios 
        SET nombre = ?, correo = ?, contrasena = ? 
        WHERE id = (SELECT usuario_id FROM doctores WHERE id = ?)`;

    connection.query(updateUserQuery, [nombre, correo, contrasena, id], (err, userResult) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }

        // Luego, actualizar los datos del doctor
        const updateDoctorQuery = `
            UPDATE doctores 
            SET nombre = ?, especialidad = ?, telefono = ?, correo = ?, direccion = ?
            WHERE id = ?`;

        connection.query(updateDoctorQuery, [nombre, especialidad, telefono, correo, direccion, id], (err, result) => {
            if (err) {
                console.error('Error al editar el doctor:', err);
                return res.status(500).json({ message: 'Error al editar el doctor' });
            }
            res.status(200).json({ message: 'Doctor editado correctamente' });
        });
    });
};

// Eliminar doctor
exports.deleteDoctor = (req, res) => {
    const { id } = req.params;

    // Primero eliminar el usuario relacionado
    const getUserIdQuery = `SELECT usuario_id FROM doctores WHERE id = ?`;
    connection.query(getUserIdQuery, [id], (err, result) => {
        if (err || result.length === 0) {
            console.error('Error al buscar el usuario relacionado:', err);
            return res.status(500).json({ message: 'Error al buscar el usuario relacionado' });
        }

        const usuarioId = result[0].usuario_id;

        const deleteDoctorQuery = `DELETE FROM doctores WHERE id = ?`;
        connection.query(deleteDoctorQuery, [id], (err, doctorResult) => {
            if (err) {
                console.error('Error al eliminar el doctor:', err);
                return res.status(500).json({ message: 'Error al eliminar el doctor' });
            }

            const deleteUserQuery = `DELETE FROM usuarios WHERE id = ?`;
            connection.query(deleteUserQuery, [usuarioId], (err, userResult) => {
                if (err) {
                    console.error('Error al eliminar el usuario:', err);
                    return res.status(500).json({ message: 'Error al eliminar el usuario' });
                }
                res.status(200).json({ message: 'Doctor y usuario eliminados correctamente' });
            });
        });
    });
};
