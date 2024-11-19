const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Obtener todos los doctores
router.get('/', doctorController.getAllDoctors);

// Agregar un nuevo doctor
router.post('/', doctorController.addDoctor);

// Actualizar un doctor
router.put('/:id', doctorController.updateDoctor);

// Eliminar un doctor
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;
