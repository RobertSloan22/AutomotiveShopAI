import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useVehicle } from '../../context/VehicleContext';
import { VehicleSearch } from '../vehicle/VehicleSearch';
import axiosInstance from '../../utils/axiosConfig';

export const InvoiceForm = ({ initialData, onSubmit, isReadOnly = false }) => {
    const [formData, setFormData] = useState({
        customerName: initialData?.customerName || '',
        customerEmail: initialData?.customerEmail || '',
        phoneNumber: initialData?.phoneNumber || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        zip: initialData?.zip || '',
        invoiceDate: initialData?.invoiceDate || new Date().toISOString().split('T')[0],
        vehicleType: initialData?.vehicleType || '',
        vehicleNumber: initialData?.vehicleNumber || '',
        vehicleVin: initialData?.vehicleVin || '',
        vehicleColor: initialData?.vehicleColor || '',
        vehicleMileage: initialData?.vehicleMileage || '',
        vehicleEngine: initialData?.vehicleEngine || '',
        vehicleTransmission: initialData?.vehicleTransmission || '',
        vehicleFuelType: initialData?.vehicleFuelType || '',
        vehicleDescription: initialData?.vehicleDescription || '',
        laborItems: initialData?.laborItems || [],
        partsItems: initialData?.partsItems || [],
        notes: initialData?.notes || ''
    });

    const { updateCurrentVehicle } = useVehicle();

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
            toast.success('Invoice saved successfully!');
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleVehicleSelect = (vehicleData) => {
        updateCurrentVehicle({
            make: vehicleData.make,
            model: vehicleData.model,
            year: vehicleData.year,
            vin: vehicleData.vin,
            engine: vehicleData.engine,
            transmission: vehicleData.transmission
        });

        setFormData(prev => ({
            ...prev,
            vehicleType: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model}`,
            vehicleVin: vehicleData.vin,
            vehicleEngine: vehicleData.engine,
            vehicleTransmission: vehicleData.transmission
        }));
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information Section */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="customerName"
                            placeholder="Customer Name"
                            value={formData.customerName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            readOnly={isReadOnly}
                            required
                        />
                        <input
                            type="email"
                            name="customerEmail"
                            placeholder="Email"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            readOnly={isReadOnly}
                        />
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            readOnly={isReadOnly}
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            readOnly={isReadOnly}
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            readOnly={isReadOnly}
                        />
                        <input
                            type="text"
                            name="zip"
                            placeholder="ZIP Code"
                            value={formData.zip}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            readOnly={isReadOnly}
                        />
                    </div>
                </div>

                {/* Vehicle Information Section */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Vehicle Information</h2>
                    <div className="mb-4">
                        <VehicleSearch onSelect={handleVehicleSelect} disabled={isReadOnly} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="vehicleNumber"
                            placeholder="Vehicle Number"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                        />
                        <input
                            type="text"
                            name="vehicleColor"
                            placeholder="Color"
                            value={formData.vehicleColor}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                        />
                        <input
                            type="text"
                            name="vehicleMileage"
                            placeholder="Mileage"
                            value={formData.vehicleMileage}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                        />
                        <input
                            type="text"
                            name="vehicleEngine"
                            placeholder="Engine"
                            value={formData.vehicleEngine}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                        />
                        <input
                            type="text"
                            name="vehicleTransmission"
                            placeholder="Transmission"
                            value={formData.vehicleTransmission}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                        />
                        <input
                            type="text"
                            name="vehicleFuelType"
                            placeholder="Fuel Type"
                            value={formData.vehicleFuelType}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                        />
                    </div>
                </div>

                {/* Description/Notes Section */}
                <div className="bg-gray-800 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Description & Notes</h2>
                    <textarea
                        name="vehicleDescription"
                        placeholder="Vehicle Description"
                        value={formData.vehicleDescription}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white mb-4"
                        rows="3"
                    />
                    <textarea
                        name="notes"
                        placeholder="Additional Notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                        rows="3"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        disabled={isReadOnly}
                    >
                        Save Invoice
                    </button>
                </div>
            </form>
        </div>
    );
}; 

export default InvoiceForm;