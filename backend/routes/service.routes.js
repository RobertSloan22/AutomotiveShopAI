import express from 'express';
import ServiceRecord from '../models/serviceRecord.model.js';
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Get all service records for a vehicle
router.get('/vehicle/:vehicleId', protectRoute, async (req, res) => {
    try {
        const services = await ServiceRecord.find({ vehicleId: req.params.vehicleId })
            .populate('technician')
            .populate('parts.partId')
            .sort({ serviceDate: -1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new service record
router.post('/', protectRoute, async (req, res) => {
    try {
        const newService = new ServiceRecord(req.body);
        await newService.save();
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update service record
router.put('/:id', protectRoute, async (req, res) => {
    try {
        const updatedService = await ServiceRecord.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 