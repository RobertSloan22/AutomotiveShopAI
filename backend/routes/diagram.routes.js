import express from 'express';
import fetch from 'node-fetch';
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/diagram-search', protectRoute, async (req, res) => {
  try {
    const { query, apiKey, cx } = req.body;
    
    if (!query || !apiKey || !cx) {
      return res.status(400).json({
        error: 'Missing required parameters',
        message: 'Query, API key, and Search Engine ID are required'
      });
    }

    console.log('Searching for diagram:', query);

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?` +
      `key=${apiKey}` +
      `&cx=${cx}` +
      `&q=${encodeURIComponent(query)}` +
      `&searchType=image` +
      `&num=1` +
      `&fileType=jpg,png,gif` +
      `&imgSize=large` +
      `&safe=active`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google API Error:', errorText);
      throw new Error(`Google Search API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Google API response received');
    res.json(data);
  } catch (error) {
    console.error('Diagram search proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch diagram',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

router.post('/proxy-image', protectRoute, async (req, res) => {
  try {
    const { url } = req.body;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch image');
    
    const buffer = await response.buffer();
    const contentType = response.headers.get('content-type');
    
    res.setHeader('Content-Type', contentType);
    res.send(buffer);
  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(500).json({ error: 'Failed to proxy image' });
  }
});

export default router; 