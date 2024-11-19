import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-hot-toast';
import { vehicleOptions, engineOptions, colorOptions } from '../../utils/vehicleOptions';

const NewCustomerForm = ({ onSuccess, initialData = {}, isEditing = false }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        address: '',
        city: '',
        zipCode: '',
        notes: '',
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
        if (initialData && Object.keys(initialData).length > 0) {
            console.log('Setting initial form data:', initialData);
            setFormData(prev => ({
                ...prev,
                ...initialData,
                vehicleNotes: initialData.notes || ''
            }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const customerData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                city: formData.city,
                zipCode: formData.zipCode,
                notes: formData.notes
            };

            const vehicleData = {
                _id: initialData._id,
                year: formData.year,
                make: formData.make,
                model: formData.model,
                trim: formData.trim,
                vin: formData.vin,
                licensePlate: formData.licensePlate,
                color: formData.color,
                mileage: formData.mileage,
                engine: formData.engine,
                transmission: formData.transmission,
                fuelType: formData.fuelType,
                isAWD: formData.isAWD,
                is4x4: formData.is4x4,
                notes: formData.vehicleNotes
            };

            if (isEditing) {
                await axiosInstance.put(`/customers/${initialData._id}`, {
                    customerData,
                    vehicleData
                });
            } else {
                const response = await axiosInstance.post('/customers', {
                    customerData,
                    vehicleData
                });
            }

            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error(error.response?.data?.error || 'Error saving customer');
        } finally {
            setLoading(false);
        }
    };

    const getModelOptions = (make) => {
        return make && vehicleOptions[make.toLowerCase()] 
            ? vehicleOptions[make.toLowerCase()].models 
            : [];
    };

    return (
        <>
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        name="zipCode"
                        placeholder="ZIP Code"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="year"
                        placeholder="Year"
                        value={formData.year}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <select
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    >
                        <option value="">Select Make</option>
                        {Object.entries(vehicleOptions).map(([key, value]) => (
                            <option key={key} value={key}>
                                {value.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                        disabled={!formData.make}
                    >
                        <option value="">Select Model</option>
                        {getModelOptions(formData.make).map(model => (
                            <option key={model} value={model}>
                                {model}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        name="trim"
                        placeholder="Trim Package"
                        value={formData.trim}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                    />
                    <input
                        type="text"
                        name="vin"
                        placeholder="VIN"
                        value={formData.vin}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <input
                        type="text"
                        name="licensePlate"
                        placeholder="License Plate"
                        value={formData.licensePlate}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                    />
                    <select
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    >
                        <option value="">Select Color</option>
                        {colorOptions.map(color => (
                            <option key={color} value={color}>
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="mileage"
                        placeholder="Mileage"
                        value={formData.mileage}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    />
                    <select
                        name="engine"
                        value={formData.engine}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    >
                        <option value="">Select Engine</option>
                        {engineOptions.map(engine => (
                            <option key={engine} value={engine}>
                                {engine}
                            </option>
                        ))}
                    </select>
                    <select
                        name="transmission"
                        value={formData.transmission}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    >
                        <option value="">Select Transmission</option>
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                        <option value="cvt">CVT</option>
                    </select>
                    <select
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                        required
                    >
                        <option value="">Select Fuel Type</option>
                        <option value="gasoline">Gasoline</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                    </select>
                    <div className="col-span-2 flex gap-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="isAWD"
                                checked={formData.isAWD}
                                onChange={handleChange}
                                className="form-checkbox text-blue-600"
                            />
                            <span className="text-white">AWD</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                name="is4x4"
                                checked={formData.is4x4}
                                onChange={handleChange}
                                className="form-checkbox text-blue-600"
                            />
                            <span className="text-white">4x4</span>
                        </label>
                    </div>
                    <textarea
                        name="notes"
                        placeholder="Notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="col-span-2 w-full p-2 bg-gray-700 rounded text-white"
                        rows="3"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className={`w-full p-2 text-white rounded ${
                    loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
                {loading ? 'Creating...' : 'Create Customer'}
            </button>
        </form>
        </>
    );
};

export default NewCustomerForm;