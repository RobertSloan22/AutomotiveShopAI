import React from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosConfig';

const InvoiceCreate = ({ onInvoiceCreated }) => {
    const [formData, setFormData] = React.useState({
        customerName: '',
        customerEmail: '',
        phoneNumber: '',
        address: '',
        invoiceDate: '',
        vehicleType: '',
        vehicleNumber: '',
        vehicleVin: '',
        vehicleColor: '',
        vehicleMileage: '',
        vehicleEngine: '',
        vehicleTransmission: '',
        vehicleFuelType: '',
        vehicleDescription: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axiosInstance.post('/invoices/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success('Invoice created successfully!');
            onInvoiceCreated(); // Callback to parent to refresh the list
            // Reset form
            setFormData({
                customerName: '',
                customerEmail: '',
                phoneNumber: '',
                address: '',
                invoiceDate: '',
                vehicleType: '',
                vehicleNumber: '',
                vehicleVin: '',
                vehicleColor: '',
                vehicleMileage: '',
                vehicleEngine: '',
                vehicleTransmission: '',
                vehicleFuelType: '',
                vehicleDescription: ''
            });
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
            <h1 className="text-3xl font-semibold text-center text-gray-300 mb-6">
                Invoice <span className="text-blue-500">Management</span>
            </h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer Information */}
                <div className="space-y-4">
                    <input
                        type="text"
                        name="customerName"
                        placeholder="Customer Name"
                        value={formData.customerName}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                        required
                    />
                    {/* ... rest of customer information inputs ... */}
                </div>

                {/* Vehicle Information */}
                <div className="space-y-4">
                    <input
                        type="text"
                        name="vehicleType"
                        placeholder="Vehicle Type"
                        value={formData.vehicleType}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                        required
                    />
                    {/* ... rest of vehicle information inputs ... */}
                </div>

                {/* Additional Vehicle Details */}
                <div className="md:col-span-2 space-y-4">
                    <input
                        type="text"
                        name="vehicleEngine"
                        placeholder="Engine"
                        value={formData.vehicleEngine}
                        onChange={handleChange}
                        className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                        required
                    />
                    {/* ... rest of additional vehicle details inputs ... */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Create Invoice
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceCreate;