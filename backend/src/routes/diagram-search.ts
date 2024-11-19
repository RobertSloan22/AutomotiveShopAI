import express from 'express';
const router = express.Router();

router.post('/api/diagram-search', async (req, res) => {
  try {
    const { query, apiKey, cx } = req.body;
    
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?` +
      `key=${apiKey}` +
      `&cx=${cx}` +
      `&q=${encodeURIComponent(query)}` +
      `&searchType=image` +
      `&num=1` +
      `&imgType=clipart,photo` +
      `&fileType=jpg,png,gif` +
      `&imgSize=large` +
      `&safe=active`
    );

    if (!response.ok) {
      throw new Error(`Google Search API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Diagram search proxy error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch diagram',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
});

export default router; 