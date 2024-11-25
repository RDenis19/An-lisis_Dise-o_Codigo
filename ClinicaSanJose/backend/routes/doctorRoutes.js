// backend/routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Rutas para los doctores
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctorById); // Ruta para obtener un doctor específico
router.post('/', doctorController.createDoctor);
router.put('/:id', doctorController.editDoctor);
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;
