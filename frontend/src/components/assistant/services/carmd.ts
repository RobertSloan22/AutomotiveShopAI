interface CarMDDiagnosticInfo {
  code: string;
  description: string;
  repair: {
    repair: string;
    parts?: Array<{
      part_name: string;
      part_number?: string;
    }>;
    labor_hours?: number;
    repair_difficulty?: number;
  };
  probability?: number;
  technical_description?: string;
}

interface CarMDDiagramResult {
  imageUrl?: string;
  title?: string;
  source?: string;
}

class CarMDService {
  private baseUrl = 'http://api.carmd.com/v3.0';
  private getHeaders(): HeadersInit {
    return {
      'content-type': 'application/json',
      'authorization': process.env.REACT_APP_CARMD_AUTH_TOKEN || '',
      'partner-token': process.env.REACT_APP_CARMD_PARTNER_TOKEN || '',
    };
  }

  async getDiagnostics(vin: string, code: string): Promise<CarMDDiagnosticInfo> {
    const response = await fetch(`${this.baseUrl}/diagnostic`, {
      method: 'GET',
      headers: this.getHeaders(),
      body: JSON.stringify({
        vin,
        code,
      }),
    });

    if (!response.ok) {
      throw new Error(`CarMD API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getMaintenanceSchedule(vin: string, mileage: number): Promise<any> {
    const response = await fetch(`${this.baseUrl}/maint`, {
      method: 'GET',
      headers: this.getHeaders(),
      body: JSON.stringify({
        vin,
        mileage,
      }),
    });

    if (!response.ok) {
      throw new Error(`CarMD API error: ${response.statusText}`);
    }

    return response.json();
  }

  async decodeVin(vin: string): Promise<any> {
    const url = new URL(`${this.baseUrl}/decode`);
    url.searchParams.append('vin', vin);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`CarMD API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getDiagrams(searchQuery: string, params?: {
    year?: string;
    make?: string;
    model?: string;
  }): Promise<CarMDDiagramResult> {
    try {
      // Try CarMD's technician endpoint
      const response = await fetch(`${this.baseUrl}/technician/diagrams`, {
        method: 'GET',
        headers: this.getHeaders(),
        body: JSON.stringify({
          query: searchQuery,
          ...params
        }),
      });

      if (!response.ok) {
        throw new Error('CarMD diagram search failed');
      }

      const data = await response.json();
      if (data.diagrams?.[0]?.url) {
        return {
          imageUrl: data.diagrams[0].url,
          title: data.diagrams[0].title,
          source: 'CarMD'
        };
      }

      throw new Error('No diagrams found');
    } catch (error) {
      throw new Error('Diagram search failed');
    }
  }
}

export const carmdService = new CarMDService(); 