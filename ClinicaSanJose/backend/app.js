const express = require('express');
const cors = require('cors'); // Importar cors
const path = require('path');
const doctorRoutes = require('./routes/doctorRoutes');
const nurseRoutes = require('./routes/nurseRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors()); // Middleware para permitir solicitudes CORS desde cualquier origen
app.use(express.json()); // Middleware para parsear JSON

// Definir rutas
app.use('/api/doctores', doctorRoutes);
app.use('/api/enfermeras', nurseRoutes);
app.use('/api/usuarios', userRoutes);

// Configurar archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta para la página de inicio (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

// Ruta para el dashboard (admin_dashboard.html)
app.get('/admin_dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/admin_dashboard.html'));
});

// Ruta para gestión de doctores (manage_doctors.html)
app.get('/manage_doctors.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/manage_doctors.html'));
});

// Ruta para gestión de enfermeras (manage_nurses.html)
app.get('/manage_nurses.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/manage_nurses.html'));
});

module.exports = app;