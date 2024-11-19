import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CustomerDetails = () => {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                // Fetch customer details
                const customerResponse = await axios.get(`/customers/${id}`);
                setCustomer(customerResponse.data);

                // Fetch customer's invoices
                const invoicesResponse = await axios.get(`/api/customers/${id}/invoices`);
                setInvoices(invoicesResponse.data);

                // Fetch customer's vehicles
                const vehiclesResponse = await axios.get(`/api/customers/${id}/vehicles`);
                setVehicles(vehiclesResponse.data);
            } catch (error) {
                console.error('Error fetching customer data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerData();
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
    );

    if (!customer) return (
        <div className="text-center text-white mt-8">
            Customer not found
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Customer Info */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                    {customer.firstName} {customer.lastName}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-gray-400">Email</p>
                        <p className="text-white">{customer.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Phone</p>
                        <p className="text-white">{customer.phoneNumber}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Address</p>
                        <p className="text-white">{customer.address}</p>
                    </div>
                </div>
            </div>

            {/* Vehicles Section */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Vehicles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicles.map(vehicle => (
                        <div key={vehicle._id} className="bg-gray-700 p-4 rounded-lg">
                            <p className="text-white font-medium">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </p>
                            <p className="text-gray-400">VIN: {vehicle.vin}</p>
                            <p className="text-gray-400">Mileage: {vehicle.mileage}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service History */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Service History</h3>
                <div className="space-y-4">
                    {invoices.map(invoice => (
                        <div key={invoice._id} className="bg-gray-700 p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-white font-medium">
                                        Invoice #{invoice.invoiceNumber}
                                    </p>
                                    <p className="text-gray-400">
                                        {new Date(invoice.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="text-white font-medium">
                                    ${invoice.total}
                                </p>
                            </div>
                            <div className="mt-2">
                                <p className="text-gray-400">{invoice.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails; 