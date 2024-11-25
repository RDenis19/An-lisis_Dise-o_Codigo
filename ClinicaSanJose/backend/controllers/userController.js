// backend/controllers/userController.js
const db = require('../database/db');

exports.login = (req, res) => {
    const { correo, contrasena } = req.body;

    // Consulta a la base de datos para buscar al usuario por correo
    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
        if (err) {
            console.error('Error al buscar usuario:', err);
            return res.status(500).json({ message: 'Error al buscar usuario.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        const user = results[0];

        // Comparar la contraseña directamente (sin encriptación)
        if (contrasena !== user.contrasena) {
            return res.status(401).json({ message: 'Credenciales incorrectas.' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso.', user });
    });
};
