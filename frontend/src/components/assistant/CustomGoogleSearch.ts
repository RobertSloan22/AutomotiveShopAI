const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;

class GoogleSearchService {
  async call({ input }: { input: string }) {
    const url = new URL('https://customsearch.googleapis.com/customsearch/v1');
    url.searchParams.append('key', GOOGLE_API_KEY);
    url.searchParams.append('cx', SEARCH_ENGINE_ID);
    url.searchParams.append('q', input);

    try {
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      const data = await response.json();
      return {
        links: data.items?.map((item: any) => item.link) || [],
        title: data.items?.[0]?.title || ''
      };
    } catch (error) {
      console.error('Google Search error:', error);
      throw error;
    }
  }
}

// Create a single instance
const googleSearchService = new GoogleSearchService();

// Export as default
export default googleSearchService;