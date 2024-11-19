import React, { useState } from 'react';
import { useCustomer } from '../../context/CustomerContext';

const AppointmentForm = ({ onSubmit, initialData = {} }) => {
    const { currentCustomer, currentVehicle } = useCustomer();
    const [formData, setFormData] = useState({
        date: initialData.date || '',
        time: initialData.time || '',
        serviceType: initialData.serviceType || '',
        description: initialData.description || '',
        estimatedDuration: initialData.estimatedDuration || '1',
        technician: initialData.technician || '',
        priority: initialData.priority || 'normal'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            customerId: currentCustomer?._id,
            vehicleId: currentVehicle?._id
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                Schedule Appointment5
            </button>
        </form>
    );
};

export default AppointmentForm; 