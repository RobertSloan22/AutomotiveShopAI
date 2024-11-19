interface MitchellAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface DiagramSearchResult {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  systemName: string;
  vehicleInfo?: {
    year: string;
    make: string;
    model: string;
  };
}

class MitchellService {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    const response = await fetch(`${process.env.REACT_APP_MITCHELL_API_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.REACT_APP_MITCHELL_CLIENT_ID || '',
        client_secret: process.env.REACT_APP_MITCHELL_CLIENT_SECRET || '',
      }),
    });

    const data: MitchellAuthResponse = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
    return this.accessToken;
  }

  async searchDiagrams(params: {
    year?: string;
    make?: string;
    model?: string;
    system?: string;
    component?: string;
    keyword?: string;
  }): Promise<DiagramSearchResult[]> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${process.env.REACT_APP_MITCHELL_API_URL}/diagnostic/diagrams/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    return response.json();
  }

  async getDiagramDetails(diagramId: string): Promise<any> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`${process.env.REACT_APP_MITCHELL_API_URL}/diagnostic/diagrams/${diagramId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.json();
  }
}

export const mitchellService = new MitchellService(); 