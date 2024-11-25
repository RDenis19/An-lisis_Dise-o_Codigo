// backend/routes/nurseRoutes.js
const express = require('express');
const router = express.Router();
const nurseController = require('../controllers/nurseController');

// Rutas para las enfermeras
router.get('/', nurseController.getNurses);
router.get('/:id', nurseController.getNurseById);
router.post('/', nurseController.createNurse);
router.put('/:id', nurseController.editNurse);
router.delete('/:id', nurseController.deleteNurse);

module.exports = router;
