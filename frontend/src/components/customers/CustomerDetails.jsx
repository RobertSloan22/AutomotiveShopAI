import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';
import axios from 'axios';

const CustomerDetails = ({ customer, onClose }) => {
    const navigate = useNavigate();
    const { selectCustomerAndVehicle } = useCustomer();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`/api/customers/${customer._id}/invoices`);
                setInvoices(response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [customer._id]);

    const handleCreateInvoice = () => {
        navigate('/invoices/new', { 
            state: { customerId: customer._id } 
        });
        onClose();
    };

    const handleScheduleAppointment = () => {
        navigate('/appointments', {
            state: { 
                customerData: {
                    customerName: `${customer.firstName} ${customer.lastName}`,
                    phoneNumber: customer.phoneNumber,
                    email: customer.email
                }
            }
        });
        onClose();
    };

    const handleViewFullDetails = () => {
        navigate(`/customers/${customer._id}`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {customer.firstName} {customer.lastName}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                    <button
                        onClick={handleCreateInvoice}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Create Invoice
                    </button>
                    <button
                        onClick={handleScheduleAppointment}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    >
                        Schedule Appointment
                    </button>
                    <button
                        onClick={handleViewFullDetails}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                    >
                        View Full Details
                    </button>
                </div>

                {loading ? (
                    <div className="text-white text-center py-4">Loading invoices...</div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
                        {invoices.length === 0 ? (
                            <p className="text-gray-400">No invoices found</p>
                        ) : (
                            invoices.map(invoice => (
                                <div key={invoice._id} className="bg-gray-700 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="text-white">
                                                {invoice.vehicle.year} {invoice.vehicle.make} {invoice.vehicle.model}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Invoice #{invoice.invoiceNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
                                        <p>VIN: {invoice.vehicle.vin}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDetails; 