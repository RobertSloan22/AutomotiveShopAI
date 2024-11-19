import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import NewCustomerForm from '../../components/customers/NewCustomerForm';
import Invoice from '../invoice/Invoice';
import Appointment from '../appointments/AppointmentList';
import NewCustomer from '../../components/customers/NewCustomer';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/api/customers');
            setCustomers(response.data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomerClick = (customerId) => {
        navigate(`/customers/${customerId}`);
    };

    return (
        <>
        <NewCustomer />
        <div className="container mx-auto px-4 py-8">
            {/* Header with Add Customer Button */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">Customers</h1>
                <button
                    onClick={() => setShowNewCustomerForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add New Customer
                </button>
            </div>

            {/* New Customer Modal */}
            {showNewCustomerForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 my-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">New Customer</h2>
                            <button 
                                onClick={() => setShowNewCustomerForm(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ×
                            </button>
                        </div>
                        <NewCustomerForm 
                            onSuccess={() => {
                                setShowNewCustomerForm(false);
                                fetchCustomers();
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Customers List */}
            {loading ? (
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customers.map((customer) => (
                        <div
                            key={customer._id}
                            onClick={() => handleCustomerClick(customer._id)}
                            className="bg-gray-800 rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition-colors"
                        >
                            <h3 className="text-lg font-semibold text-white">
                                {customer.firstName} {customer.lastName}
                            </h3>
                            <div className="mt-2 space-y-1 text-gray-300">
                                <p>{customer.email}</p>
                                <p>{customer.phoneNumber}</p>
                                <p>{customer.city}, {customer.zipCode}</p>
                            </div>
                            {customer.vehicles && customer.vehicles.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm text-gray-400">
                                        Vehicles: {customer.vehicles.length}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
        </>
    );
};

export default Customers; 