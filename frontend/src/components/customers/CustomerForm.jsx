import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CustomerForm = ({ customer, onSubmit, isEditing = false }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        zipCode: '',
        notes: '',
        preferredContact: 'email',
        year: '',
        make: '',
        model: '',
        trim: '',
        vin: '',
        licensePlate: '',
        color: '',
        mileage: '',
        engine: '',
        transmission: '',
        fuelType: '',
        isAWD: false,
        is4x4: false,
        vehicleNotes: ''
    });

    useEffect(() => {
        if (customer) {
            setFormData(prev => ({
                ...prev,
                ...customer
            }));
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await onSubmit(formData);
            toast.success(`Customer ${isEditing ? 'updated' : 'created'} successfully!`);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300">Phone Number</label>
                <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300">Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">City</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">ZIP Code</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300">Preferred Contact Method</label>
                <select
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300">Notes</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Year</label>
                    <input
                        type="text"
                        name="year"
                        value={formData.year}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Make</label>
                    <input
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Model</label>
                    <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Trim</label>
                    <input
                        type="text"
                        name="trim"
                        value={formData.trim}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Vin</label>
                    <input
                        type="text"
                        name="vin"
                        value={formData.vin}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">License Plate</label>
                    <input
                        type="text"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Color</label>
                    <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Mileage</label>
                    <input
                        type="text"
                        name="mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Engine</label>
                    <input
                        type="text"
                        name="engine"
                        value={formData.engine}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Transmission</label>
                    <input
                        type="text"
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Fuel Type</label>
                    <input
                        type="text"
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Is AWD</label>
                    <input
                        type="checkbox"
                        name="isAWD"
                        checked={formData.isAWD}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Is 4x4</label>
                    <input
                        type="checkbox"
                        name="is4x4"
                        checked={formData.is4x4}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">Vehicle Notes</label>
                    <textarea
                        name="vehicleNotes"
                        value={formData.vehicleNotes}
                        onChange={handleChange}
                        rows="3"
                        className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
                {isEditing ? 'Update Customer' : 'Create Customer'}
            </button>
        </form>
    );
};

export default CustomerForm;