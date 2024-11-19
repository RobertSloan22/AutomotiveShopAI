import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomer } from '../../context/CustomerContext';

const CustomerModal = ({ isOpen, onClose, customer }) => {
    const navigate = useNavigate();
    const { setSelectedCustomer } = useCustomer();

    const handleScheduleAppointment = () => {
        // Set the customer in context and navigate to appointments
        setSelectedCustomer(customer);
        onClose();
        navigate('/appointments', {
            state: { 
                customerData: {
                    customerName: `${customer.firstName} ${customer.lastName}`,
                    phoneNumber: customer.phoneNumber,
                    email: customer.email
                }
            }
        });
    };

    const handleViewCustomerDetails = () => {
        onClose();
        navigate(`/customers/${customer._id}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full text-white">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Customer Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
                </div>

                {/* Customer Info */}
                <div className="space-y-3 mb-6">
                    <div>
                        <label className="text-gray-400">Name:</label>
                        <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                    </div>
                    <div>
                        <label className="text-gray-400">Email:</label>
                        <p className="font-medium">{customer.email}</p>
                    </div>
                    <div>
                        <label className="text-gray-400">Phone:</label>
                        <p className="font-medium">{customer.phoneNumber}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleScheduleAppointment}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Schedule Appointment
                    </button>
                    <button
                        onClick={handleViewCustomerDetails}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        View Full Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerModal;

