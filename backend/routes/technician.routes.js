import express from 'express';
import Technician from '../models/technician.model.js';
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

// Get all technicians
router.get('/', protectRoute, async (req, res) => {
    try {
        const technicians = await Technician.find();
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get technician's schedule
router.get('/:id/schedule', protectRoute, async (req, res) => {
    try {
        const appointments = await Appointment.find({
            technicianId: req.params.id,
            scheduledDate: {
                $gte: new Date()
            }
        }).populate('vehicleId customerId');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new technician
router.post('/', protectRoute, async (req, res) => {
    try {
        const newTechnician = new Technician(req.body);
        await newTechnician.save();
        res.status(201).json(newTechnician);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update technician
router.put('/:id', protectRoute, async (req, res) => {
    try {
        const updatedTechnician = await Technician.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTechnician);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 