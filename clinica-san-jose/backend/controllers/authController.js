const db = require('../config/db'); // Conexión a la base de datos

// Función para autenticar a los usuarios
const login = (req, res) => {
    const { correo, password } = req.body;

    // Buscar al usuario en la base de datos por correo
    db.query('SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Error en el servidor' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            return;
        }

        const user = results[0];

        // Verificar si la contraseña es correcta (por ahora, se compara directamente)
        if (password !== user.password) {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
            return;
        }

        // Devolver la respuesta con el rol del usuario
        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            rol: user.rol_id === 1 ? 'Administrador' : (user.rol_id === 2 ? 'Doctor' : 'Enfermera'),
        });
    });
};

module.exports = {
    login,
};
