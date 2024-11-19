import axios from 'axios';

export const searchDiagrams = async (req, res) => {
  try {
    const { query, type, fileType } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Missing query parameter',
        message: 'Search query is required'
      });
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
      console.error('Missing API credentials:', { 
        hasApiKey: !!GOOGLE_API_KEY, 
        hasSearchEngineId: !!SEARCH_ENGINE_ID 
      });
      return res.status(500).json({
        error: 'Configuration error',
        message: 'Missing Google API credentials'
      });
    }

    const searchUrl = new URL('https://customsearch.googleapis.com/customsearch/v1');
    searchUrl.searchParams.append('key', GOOGLE_API_KEY);
    searchUrl.searchParams.append('cx', SEARCH_ENGINE_ID);
    searchUrl.searchParams.append('q', `${query} diagram`);
    searchUrl.searchParams.append('searchType', 'image');
    searchUrl.searchParams.append('fileType', fileType || 'jpg,png,jpeg,pdf');
    searchUrl.searchParams.append('rights', 'cc_publicdomain,cc_attribute,cc_sharealike');

    console.log('Making request to Google API:', {
      query,
      type,
      fileType,
      url: searchUrl.toString()
    });

    const response = await axios.get(searchUrl.toString());
    
    if (!response.data.items) {
      console.warn('No results found for query:', query);
      return res.json({
        diagrams: [],
        count: 0
      });
    }

    const diagrams = response.data.items.map(item => ({
      url: item.link,
      title: item.title,
      thumbnail: item.image?.thumbnailLink,
      sourceUrl: item.image?.contextLink,
      fileType: item.fileFormat || item.link.split('.').pop()
    }));

    console.log(`Found ${diagrams.length} diagrams for query:`, query);

    return res.json({
      diagrams,
      count: diagrams.length
    });

  } catch (error) {
    console.error('Search controller error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });

    return res.status(500).json({ 
      error: 'Search failed', 
      message: error.response?.data?.error?.message || error.message
    });
  }
}; 