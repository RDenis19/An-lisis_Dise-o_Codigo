const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Rutas de autenticación
const doctorRoutes = require('./routes/doctorRoutes'); // Rutas para doctores

const app = express();

// Middleware global
app.use(cors());               // Habilita CORS
app.use(express.json());        // Permite que los datos JSON sean enviados a las rutas
app.use(express.urlencoded({ extended: true })); // Para manejar formularios con datos codificados en URL

// Servir archivos estáticos desde la carpeta 'frontend' sin necesidad de poner 'frontend/' en la URL
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas de la API (para login y doctores)
app.use('/api', authRoutes);            // Rutas de autenticación
app.use('/api/doctors', doctorRoutes);  // Ruta para gestionar doctores

// Ruta principal (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Ruta para servir el dashboard
app.get('/dashboard/*', (req, res) => {
    const filePath = path.join(__dirname, '../frontend/dashboard', req.url.replace('/dashboard', ''));
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error al servir el archivo del dashboard:", err);  // Log el error
            res.status(404).send('Página no encontrada');
        }
    });
});

// Manejo de rutas no encontradas (404)
app.use((req, res) => {
    console.error(`Ruta no encontrada: ${req.originalUrl}`);  // Log de la ruta no encontrada
    res.status(404).send('Ruta no encontrada');
});

// Manejo de errores en el servidor (500)
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err.stack); // Log detallado del error
    res.status(500).send({ message: 'Algo salió mal en el servidor. Intenta nuevamente más tarde.' });
});

// Configuración del puerto
const PORT = process.env.PORT || 3000;  // Usa el puerto que se define en el entorno, o 3000 si no está definido
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
