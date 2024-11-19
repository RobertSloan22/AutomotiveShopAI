import express from 'express';
import Part from '../models/part.model.js';
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

// Get all parts with filters
router.get('/', protectRoute, async (req, res) => {
    try {
        const { category, lowStock, search } = req.query;
        let query = {};

        if (category) query.category = category;
        if (lowStock) query.quantity = { $lte: '$minimumStock' };
        if (search) {
            query.$or = [
                { partNumber: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const parts = await Part.find(query);
        res.json(parts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add new part
router.post('/', protectRoute, async (req, res) => {
    try {
        const newPart = new Part(req.body);
        await newPart.save();
        res.status(201).json(newPart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update part
router.put('/:id', protectRoute, async (req, res) => {
    try {
        const updatedPart = await Part.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedPart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete part
router.delete('/:id', protectRoute, async (req, res) => {
    try {
        await Part.findByIdAndDelete(req.params.id);
        res.json({ message: 'Part deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 