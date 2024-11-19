const express = require('express');
const OpenAI = require('openai');
const router = express.Router();
import protectRoute from "../middleware/protectRoute.js";

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY
});

router.post('/generate-diagram', protectRoute, async (req, res) => {
  try {
    const { prompt, model, size, quality, n } = req.body;
    console.log('Generating diagram with prompt:', prompt);

    const response = await openai.images.generate({
      model: model || "dall-e-3",
      prompt,
      size: size || "1024x1024",
      quality: quality || "standard",
      n: n || 1,
    });

    res.json(response);
  } catch (error) {
    console.error('DALL-E generation error:', error);
    res.status(500).json({
      error: 'Failed to generate image',
      message: error.message || 'Unknown error occurred'
    });
  }
});

router.get('/', protectRoute, async (req, res) => {
  try {
    res.json({ message: 'Diagram generation route is working' });
  } catch (error) {
    console.error('Diagram generation route error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

module.exports = router; 