import { Tool } from "@langchain/core/tools";
import { z } from "zod";
import axiosInstance from '../../../utils/axiosConfig';

interface ServiceHistoryEntry {
  date: string;
  invoice: string;
  serviceType: string;
  amount: number;
  _id: string;
}

interface VehicleEntry {
  _id: string;
  year: number;
  make: string;
  model: string;
  vin: string;
  mileage: number;
}

interface CustomerEntry {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  zipCode: string;
  preferredContact: string;
}

export class CustomerDataTool extends Tool {
  name = "customer_data";
  description = "Access and manage customer information. Can search, create, and view customer details.";

  schema = z.object({
    input: z.string()
  }).transform((obj) => obj.input);

  async _call(input: string): Promise<string> {
    try {
      const { action, params } = JSON.parse(input);
      console.log('🔧 Customer Data Tool Called:', { action, params });

      switch (action.toLowerCase()) {
        case 'search':
          if (!params.searchTerm?.trim()) {
            return "Please provide a search term";
          }
          console.log('📝 Executing search with params:', params);
          const searchResponse = await axiosInstance.get('/customers/search', {
            params: { term: params.searchTerm.trim() }
          });
          console.log('🔍 Search Response:', searchResponse.data);
          return this.formatCustomerData(searchResponse.data);

        case 'details':
          if (!params.customerId) {
            return "Please provide a customer ID";
          }
          const detailsResponse = await axiosInstance.get(`/customers/${params.customerId}`);
          return this.formatCustomerData(detailsResponse.data);

        case 'vehicles':
          if (!params.customerId) {
            return "Please provide a customer ID";
          }
          const vehiclesResponse = await axiosInstance.get(`/customers/${params.customerId}/vehicles`);
          return this.formatVehicleData(vehiclesResponse.data);

        case 'history':
          if (!params.customerId) {
            return "Please provide a customer ID";
          }
          const historyResponse = await axiosInstance.get(`/customers/${params.customerId}/invoices`);
          return this.formatServiceHistory(historyResponse.data);

        case 'create':
          console.log('📝 Starting customer creation process');
          try {
            // Validate required fields
            if (!params.firstName || !params.lastName) {
              throw new Error('First name and last name are required');
            }

            // Format the request body
            const customerData = {
              customerData: {
                firstName: params.firstName,
                lastName: params.lastName,
                email: params.email || '',
                phoneNumber: params.phoneNumber || '',
                address: params.address || '',
                city: params.city || '',
                zipCode: params.zipCode || '',
                notes: params.notes || ''
              },
              vehicleData: {}
            };

            console.log('📦 Formatted request data:', customerData);

            const createResponse = await axiosInstance.post('/customers', customerData);
            console.log('✅ Customer creation successful:', createResponse.data);
            
            const customer = createResponse.data.customer || createResponse.data;
            return this.formatCustomerData(customer);

          } catch (error) {
            console.error('❌ Customer creation error:', {
              error,
              params,
              message: error.message
            });
            throw error;
          }

        default:
          return "Available actions: search (by name), details (by ID), vehicles (by ID), history (by ID), create (by name)";
      }
    } catch (error) {
      console.error('Error in CustomerDataTool:', error);
      return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
    }
  }

  private formatCustomerData(customer: CustomerEntry): string {
    return `Customer: ${customer.firstName} ${customer.lastName}
Email: ${customer.email}
Phone: ${customer.phoneNumber}
Address: ${customer.address}, ${customer.city} ${customer.zipCode}
Preferred Contact: ${customer.preferredContact}`;
  }

  private formatServiceHistory(history: ServiceHistoryEntry[]): string {
    return history.map(entry => 
      `Date: ${entry.date}\nInvoice: ${entry.invoice}\nService: ${entry.serviceType}\nAmount: $${entry.amount}`
    ).join('\n\n');
  }

  private formatVehicleData(vehicles: VehicleEntry[]): string {
    return vehicles.map(vehicle => 
      `${vehicle.year} ${vehicle.make} ${vehicle.model}\nVIN: ${vehicle.vin}\nMileage: ${vehicle.mileage}`
    ).join('\n\n');
  }
}

