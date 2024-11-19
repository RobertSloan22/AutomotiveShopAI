import React, { useState } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ServiceForm = ({ onSubmit, initialData = {} }) => {
    const { currentCustomer, currentVehicle } = useCustomer();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        date: initialData.date || '',
        time: initialData.time || '',
        serviceType: initialData.serviceType || '',
        description: initialData.description || '',
        estimatedDuration: initialData.estimatedDuration || '1',
        technician: initialData.technician || '',
        priority: initialData.priority || 'normal',
        phoneNumber: currentCustomer?.phoneNumber || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Calculate end time based on estimated duration
            const startDateTime = new Date(`${formData.date}T${formData.time}`);
            const endDateTime = new Date(startDateTime.getTime() + (parseFloat(formData.estimatedDuration) * 60 * 60 * 1000));

            // Create appointment data
            const appointmentData = {
                customerName: currentCustomer?.firstName + ' ' + currentCustomer?.lastName,
                customerId: currentCustomer?._id,
                phoneNumber: formData.phoneNumber,
                vehicle: currentVehicle?.make + ' ' + currentVehicle?.model,
                complaint: formData.description,
                time: startDateTime.toISOString(),
                start: startDateTime,
                end: endDateTime,
                title: `${formData.serviceType} - ${currentCustomer?.firstName} ${currentCustomer?.lastName}`,
                notes: formData.description,
                status: 'scheduled'
            };

            // Validate required fields
            if (!appointmentData.phoneNumber) {
                toast.error('Customer phone number is required');
                return;
            }

            // Call the onSubmit prop if provided
            if (onSubmit) onSubmit(appointmentData);

            // Make API call to create appointment
            await axios.post('/api/appointments', appointmentData);

            // Show success message
            toast.success('Appointment scheduled successfully!');

            // Navigate to appointments page
            navigate('/appointments');
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            toast.error('Failed to schedule appointment. Please try again.');
        }
    };

    return (
        <>     
           <div className="flex items-center justify-center h-[80vh] py-12 px-4 ">
            <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-1">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                className="w-full bg-gray-700 text-white rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Time</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({...formData, time: e.target.value})}
                                className="w-full bg-gray-700 text-white rounded p-2"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-1">Service Type</label>
                        <select
                            value={formData.serviceType}
                            onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                            className="w-full bg-gray-700 text-white rounded p-2"
                            required
                        >
                            <option value="">Select Service Type</option>
                            <option value="maintenance">Regular Maintenance</option>
                            <option value="repair">Repair</option>
                            <option value="diagnostic">Diagnostic</option>
                            <option value="inspection">Inspection</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-300 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-gray-700 text-white rounded p-2"
                            rows="3"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-300 mb-1">Estimated Duration (hours)</label>
                            <input
                                type="number"
                                value={formData.estimatedDuration}
                                onChange={(e) => setFormData({...formData, estimatedDuration: e.target.value})}
                                className="w-full bg-gray-700 text-white rounded p-2"
                                min="0.5"
                                step="0.5"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Phone Number</label>
                            <input
                                type="text"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                className="w-full bg-gray-700 text-white rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-300 mb-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                                className="w-full bg-gray-700 text-white rounded p-2"
                            >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Schedule Appointment
                    </button>
                </form>
            </div>
        </div>
        </>
    );
};

export default ServiceForm; 