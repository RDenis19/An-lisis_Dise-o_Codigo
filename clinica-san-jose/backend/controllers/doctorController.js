const Doctor = require('../models/doctorModel');

// Obtener todos los doctores
exports.getAllDoctors = (req, res) => {
    Doctor.getAllDoctors((err, doctors) => {
        if (err) {
            return res.status(500).json({ message: 'Error al obtener los doctores' });
        }
        res.status(200).json(doctors);
    });
};

// Agregar un nuevo doctor
exports.addDoctor = (req, res) => {
    const doctor = req.body; 
    Doctor.addDoctor(doctor, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al agregar el doctor' });
        }
        res.status(201).json({ message: 'Doctor agregado correctamente' });
    });
};

// Actualizar un doctor
exports.updateDoctor = (req, res) => {
    const id = req.params.id;
    const doctor = req.body;
    Doctor.updateDoctor(id, doctor, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al actualizar el doctor' });
        }
        res.status(200).json({ message: 'Doctor actualizado correctamente' });
    });
};

// Eliminar un doctor
exports.deleteDoctor = (req, res) => {
    const id = req.params.id;
    Doctor.deleteDoctor(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error al eliminar el doctor' });
        }
        res.status(200).json({ message: 'Doctor eliminado correctamente' });
    });
};
