// Import Axios instance
import axiosInstance from '../../../utils/axiosConfig';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_ENGINE_ID;

interface SearchResult {
  link: string;
  title: string;
  mime?: string;
  fileFormat?: string;
  image?: {
    contextLink: string;
    thumbnailLink?: string;
  };
}

export class GoogleSearchService {
  static readonly toolDefinition = {
    name: "searchImages",
    description: "Search for automotive diagrams and images",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query for the diagram"
        },
        type: {
          type: "string",
          description: "The type of diagram (e.g., parts, wiring, repair)",
          enum: ["parts", "wiring", "repair", "general"]
        }
      },
      required: ["query"]
    }
  };

  /**
   * Perform a Google Custom Search API request for diagrams
   * @param {Object} params - Search parameters
   * @param {string} params.query - Search query
   * @param {string} [params.type] - Diagram type
   * @returns {Promise<{ diagrams: SearchResult[]; count: number }>}
   */
  async call({ query, type = 'parts' }: { query: string; type?: string }) {
    try {
      // Construct search query
      const searchQuery = `${query} ${type} diagram`;
      
      // Perform Google Search API request
      const response = await axiosInstance.get(
        `https://www.googleapis.com/customsearch/v1`, {
          params: {
            key: GOOGLE_API_KEY,
            cx: SEARCH_ENGINE_ID,
            q: searchQuery,
            fileType: 'jpg,png,jpeg,pdf',
            searchType: 'image',
            num: 10 // Number of results to fetch
          }
        }
      );

      const items = response.data.items || [];
      return {
        diagrams: items.map((item: any) => ({
          link: item.link,
          title: item.title,
          image: item.image || undefined
        })),
        count: response.data.searchInformation?.totalResults || 0
      };
    } catch (error) {
      console.error('Google Search API error:', error);
      throw new Error('Failed to search for diagrams.');
    }
  }
}
