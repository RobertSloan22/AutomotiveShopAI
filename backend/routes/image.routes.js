import express from 'express';
import Image from '../models/image.model.js';
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/images', protectRoute, async (req, res) => {
    try {
        const imageData = {
            title: req.body.title,
            imageUrl: req.body.imageUrl,
            thumbnailUrl: req.body.thumbnailUrl,
            source: req.body.source,
            link: req.body.link,
            timestamp: new Date()
        };
        
        const savedImage = await Image.create(imageData);
        res.status(201).json(savedImage);
    } catch (error) {
        console.error('Failed to save image:', error);
        res.status(500).json({ error: 'Failed to save image' });
    }
});

router.get('/images', protectRoute, async (req, res) => {
  try {
    const images = await Image.find().sort({ timestamp: -1 }); // Sort by newest first
    res.json(images);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

export default router; 