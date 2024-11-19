interface RapidAPIImageResult {
    title: string;
    originalImage: {
      url: string;
      height: number;
      width: number;
      size: number;
    };
  }
  
  class RapidAPIService {
    private readonly apiKey = '7624da3beemshc1c601ca1294533p1eb29ejsn6de33431dd8a';
    private readonly apiHost = 'google-images5.p.rapidapi.com';
    private readonly baseUrl = 'https://google-images5.p.rapidapi.com/google/img';
  
    async searchImages(query: string): Promise<RapidAPIImageResult[]> {
      const url = `${this.baseUrl}?q=${encodeURIComponent(query)}&lang=en`;
      
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.apiKey,
          'x-rapidapi-host': this.apiHost
        }
      };
  
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`RapidAPI error: ${response.statusText}`);
        }
        const results = await response.json();
        return results;
      } catch (error) {
        console.error('RapidAPI image search error:', error);
        throw error;
      }
    }
  }
  
  export const rapidAPIService = new RapidAPIService(); 