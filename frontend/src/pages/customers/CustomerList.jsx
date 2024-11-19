import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        
        fetchCustomers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Customers</h2>
                <Link
                    to="/customers/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    New Customer
                </Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {customers.map((customer) => (
                        <Link
                            key={customer._id}
                            to={`/customers/${customer._id}`}
                            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700"
                        >
                            <h3 className="text-lg font-semibold text-white">
                                {customer.name}
                            </h3>
                            <p className="text-gray-400">{customer.email}</p>
                            <p className="text-gray-400">{customer.phone}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomerList; 