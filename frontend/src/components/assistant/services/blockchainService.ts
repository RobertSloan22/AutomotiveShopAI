import { Tool } from "@langchain/core/tools";
import axios from 'axios';

export class BlockchainDataTool extends Tool {
  name = "blockchain_data";
  description = "Get real-time Bitcoin blockchain information";

  async _call(action: string) {
    try {
      const response = await axios.get('https://api.blockchain.com/v3/exchange/tickers/BTC-USD');
      const data = response.data;
      
      switch(action.toLowerCase()) {
        case 'price':
          return `Current Bitcoin price: $${data.last_trade_price}`;
        case 'blocks':
          return `This endpoint doesn't provide block data. Please use 'price' for price information.`;
        case 'transactions':
          return `This endpoint doesn't provide transaction data. Please use 'price' for price information.`;
        case 'hashrate':
          return `This endpoint doesn't provide hashrate data. Please use 'price' for price information.`;
        default:
          return `Available metrics: price`;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return `Error fetching blockchain data: ${error.message}`;
      }
      return 'Error fetching blockchain data: Unknown error occurred';
    }
  }
} 