import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerDetailsModal = ({ customer, onClose, onEdit }) => {
    const navigate = useNavigate();

    if (!customer) return null;

    const handleEdit = () => {
        navigate(`/customers/${customer._id}/edit`);
        
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">
                        Customer Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-400">Name</label>
                            <p className="text-white font-medium">
                                {customer.firstName} {customer.lastName}
                            </p>
                        </div>
                        <div>
                            <label className="text-gray-400">Email</label>
                            <p className="text-white">{customer.email || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-gray-400">Phone</label>
                            <p className="text-white">{customer.phoneNumber || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-gray-400">Address</label>
                            <p className="text-white">{customer.address || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-gray-400">City</label>
                            <p className="text-white">{customer.city || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-gray-400">Zip Code</label>
                            <p className="text-white">{customer.zipCode || 'Not provided'}</p>
                        </div>
                        <div>
                            <label className="text-gray-400">Vehicle</label>
                            <p className="text-white">
                                {customer.vehicles && customer.vehicles.length > 0 ? `${customer.vehicles[0].year} ${customer.vehicles[0].make} ${customer.vehicles[0].model}` : 'Not provided'}
                            </p>
                        </div>
                    </div>

                    {customer.notes && (
                        <div>
                            <label className="text-gray-400">Notes</label>
                            <p className="text-white">{customer.notes}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                    <button
                        onClick={handleEdit}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Edit Customer
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsModal; 