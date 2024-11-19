import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import CustomerDetailsModal from './CustomerDetailsModal';

const CustomerSearch = ({ onCustomerSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const handleSearch = async (value) => {
        setSearchTerm(value);
        if (value.length < 2) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await axiosInstance.get(`/customers/search`, {
                params: { term: value }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Error searching customers');
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setShowDetailsModal(true);
        setSearchResults([]);
        setSearchTerm('');
    };

    const handleCloseModal = () => {
        setShowDetailsModal(false);
        setSelectedCustomer(null);
    };

    const handleEditCustomer = () => {
        if (selectedCustomer && onCustomerSelect) {
            onCustomerSelect(selectedCustomer);
            handleCloseModal();
        }
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search customers..."
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />

            {loading && (
                <div className="absolute right-3 top-3">
                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            )}

            {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((customer) => (
                        <div
                            key={customer._id}
                            onClick={() => handleCustomerClick(customer)}
                            className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0"
                        >
                            <div className="text-white font-medium">
                                {customer.firstName} {customer.lastName}
                            </div>
                            {customer.email && (
                                <div className="text-gray-400 text-sm">{customer.email}</div>
                            )}
                            {customer.phoneNumber && (
                                <div className="text-gray-400 text-sm">{customer.phoneNumber}</div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showDetailsModal && (
                <CustomerDetailsModal
                    customer={selectedCustomer}
                    onClose={handleCloseModal}
                    onEdit={handleEditCustomer}
                />
            )}
        </div>
    );
};

export default CustomerSearch;
