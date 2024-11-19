import express from 'express';
import Appointment from '../models/appointment.model.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Get appointments for a date range
router.get('/', protectRoute, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const appointments = await Appointment.find({
            scheduledDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate('customerId vehicleId technicianId');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create appointment
router.post('/', protectRoute, async (req, res) => {
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update appointment
router.put('/:id', protectRoute, async (req, res) => {
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel appointment
router.delete('/:id', protectRoute, async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        );
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


export default router;
