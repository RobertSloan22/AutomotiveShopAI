import { Tool } from "@langchain/core/tools";
import axios from 'axios';

interface PopularRune {
  rune_id: string;
  rune_name: string;
  price_sats: number;
  floor_price_change: number;
  volume_btc_1h: number;
  volume_btc_24h: number;
  volume_btc_7d: number;
  volume_btc: number;
  sales_cnt_1h: number;
  sales_cnt_24h: number;
  sales_cnt_7d: number;
  sales_cnt: number;
  volume_btc_24h_marketplace_mapping: string;
}

interface RunesResponse {
  code: number;
  message: string;
  data: PopularRune[];
}

interface MarketplaceData {
  volume: string;
}

interface MarketplaceMapping {
  [key: string]: MarketplaceData;
}

export class RunesService extends Tool {
  name = "runes_service";
  description = "Get information about the top 5 popular runes in the last 24 hours";
  private baseUrl = 'http://localhost:3001/api/runes';

  async _call(): Promise<string> {
    try {
      console.log('Fetching popular runes...');
      const response = await axios.get<RunesResponse>(
        `${this.baseUrl}/popular`,
        {
          params: {
            windows: '24h',
            limit: '5'
          }
        }
      );

      console.log('Response:', response.data);

      if (response.data.code !== 0) {
        throw new Error(response.data.message || 'Invalid response from server');
      }

      if (!Array.isArray(response.data.data) || response.data.data.length === 0) {
        return 'No popular runes data available at the moment.';
      }

      const runesData = response.data.data.map(rune => {
        let marketplaceInfo = '';
        try {
          const marketplaces = JSON.parse(rune.volume_btc_24h_marketplace_mapping) as MarketplaceMapping;
          marketplaceInfo = Object.entries(marketplaces)
            .map(([market, data]) => `- ${market}: ${Number(data.volume).toFixed(6)} BTC`)
            .join('\n');
        } catch (e) {
          marketplaceInfo = '- Market data unavailable';
        }

        return `
🔸 Rune: ${rune.rune_name}
💰 Price: ${rune.price_sats.toFixed(8)} sats
📈 24h Price Change: ${(rune.floor_price_change * 100).toFixed(2)}%
📊 Volume (24h): ${rune.volume_btc_24h.toFixed(6)} BTC
🔄 Sales (24h): ${rune.sales_cnt_24h.toLocaleString()}

📍 Market Distribution:
${marketplaceInfo}`;
      }).join('\n\n-------------------\n');

      return `📊 Top 5 Popular Runes (Last 24 Hours):\n${runesData}`;

    } catch (error: unknown) {
      console.error('Error in RunesService:', error);
      
      if (axios.isAxiosError(error)) {
        return `Error fetching popular runes: ${error.response?.data?.message || error.message}`;
      }
      
      if (error instanceof Error) {
        return `Error fetching popular runes: ${error.message}`;
      }
      
      return 'Error fetching popular runes: Unknown error occurred';
    }
  }
} 