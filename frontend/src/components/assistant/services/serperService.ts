import axios, { AxiosRequestConfig } from 'axios';

// Define the parameters type for the tool
interface MakeRequestParameters {
  query: string;
  config: {
    method?: string;
    maxBodyLength?: number;
    url?: string;
    headers?: {
      'X-API-KEY'?: string;
      'Content-Type'?: string;
    };
    data?: string;
  };
}

// Implement the makeRequestTool function
async function makeRequestTool({ query, config }: MakeRequestParameters): Promise<any> {
  try {
    // Construct the Axios request configuration
    const requestConfig: AxiosRequestConfig = {
      method: config.method || 'GET',
      maxBodyLength: config.maxBodyLength || Infinity,
      url: config.url || 'https://google.serper.dev/search',
      headers: {
        'X-API-KEY': config.headers?.['X-API-KEY'] || 'your-api-key-here',
        'Content-Type': config.headers?.['Content-Type'] || 'application/json',
      },
      data: config.data || JSON.stringify({ q: query }),
    };

    // Make the request
    const response = await axios.request(requestConfig);
    return response.data;
  } catch (error) {
    console.error('Error in makeRequestTool:', error);
    throw error;
  }
}

// Example of adding the tool to the OpenAI real-time client
interface Tool {
  name: string;
  description: string;
  execute: (params: any) => Promise<any>;
}

class Client {
  tools: Tool[] = [];

  addTool(tool: Tool) {
    this.tools.push(tool);d
  }
}

const client = new Client();

client.addTool({
  name: 'make_request',
  description: 'Makes an HTTP request to the Google Serper API to search for a specified query.',
  execute: makeRequestTool,
});

console.log('Tool added:', client.tools);
