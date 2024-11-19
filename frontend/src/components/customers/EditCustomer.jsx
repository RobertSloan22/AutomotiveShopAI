import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-hot-toast';
import NewCustomerForm from './NewCustomerForm';

const EditCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customerData, setCustomerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomerData = async () => {
            try {
                setLoading(true);
                const customerRes = await axiosInstance.get(`/customers/${id}`);
                const vehiclesRes = await axiosInstance.get(`/customers/${id}/vehicles`);
                const vehicleData = vehiclesRes.data.length > 0 ? vehiclesRes.data[0] : {};

                console.log('Customer Data:', customerRes.data);
                console.log('Vehicle Data:', vehicleData);

                const combinedData = {
                    ...customerRes.data,
                    ...vehicleData,
                    vehicleNotes: vehicleData.notes || ''
                };

                console.log('Combined Data:', combinedData);
                setCustomerData(combinedData);
            } catch (error) {
                console.error('Error fetching customer:', error);
                setError('Failed to load customer information');
                toast.error('Error loading customer data');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchCustomerData();
        }
    }, [id]);

    if (loading) return <div className="text-white text-center mt-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Customer</h2>
            <NewCustomerForm 
                initialData={customerData} 
                onSuccess={() => {
                    toast.success('Customer updated successfully');
                    navigate(`/customers/${id}`);
                }}
                isEditing={true}
            />
        </div>
    );
};

export default EditCustomer;