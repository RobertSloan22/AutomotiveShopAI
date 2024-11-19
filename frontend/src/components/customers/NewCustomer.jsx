import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import CustomerForm from './CustomerForm';

const NewCustomer = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            const response = await axios.post('/api/customers', formData);
            toast.success('Customer created successfully');
            navigate(`/customers/${response.data._id}`);
        } catch (error) {
            toast.error('Error creating customer');
            console.error('Error:', error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Customer</h2>
            <CustomerForm onSubmit={handleSubmit} />
        </div>
    );
};

export default NewCustomer;