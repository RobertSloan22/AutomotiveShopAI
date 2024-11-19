async function searchDiagram(query: string) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?` +
        `key=${process.env.REACT_APP_GOOGLE_API_KEY}` +
        `&cx=${process.env.REACT_APP_GOOGLE_CSE_ID}` +
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
      const imageResult = data.items?.[0]?.link;
  
      if (imageResult) {
        return {
          url: imageResult,
          title: data.items[0].title
        };
      }
      
      return null;
    } catch (error) {
      console.error('Diagram search error:', error);
      return null;
    }
  }