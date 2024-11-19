import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
/// import the nav bar from components 
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import InvoicePage from './InvoicePage';
//import all components needed for the chat feature
import { Link } from "react-router-dom";
import InvoiceList from './InvoicList';

// import Appointments from components
const Invoice = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [appointments, setAppointments] = useState([]);
    const [serviceRecords, setServiceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [invoice, setInvoice] = useState(null);
    const [formData, setFormData] = useState({
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
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch appointments
                const { data } = await axiosInstance.get('/appointments');
                console.log('Raw appointments from API:', data);
                
                // Format appointments like in Appointments.jsx
                const formattedAppointments = data.map(apt => ({
                    _id: apt._id,
                    customerName: apt.customerName,
                    vehicle: apt.vehicle,
                    start: new Date(apt.start),
                    end: new Date(apt.end),
                    status: apt.status,
                    complaint: apt.complaint || apt.description,
                    notes: apt.notes
                }));

                // Filter for today's appointments
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const todaysAppointments = formattedAppointments.filter(apt => 
                    apt.start >= today && apt.start < tomorrow
                );

                console.log('Today\'s appointments:', todaysAppointments);
                setAppointments(todaysAppointments);

                // Fetch recent invoices
                const { data: invoiceData } = await axiosInstance.get('/invoices/recent');
                console.log('Raw invoices from API:', invoiceData);
                console.log('Invoice data type:', typeof invoiceData);
                console.log('Is array?', Array.isArray(invoiceData));
                
                const formattedInvoices = Array.isArray(invoiceData) ? invoiceData.map(invoice => ({
                    _id: invoice._id,
                    invoiceNumber: invoice.invoiceNumber || 'N/A',
                    customerName: invoice.customerName,
                    vehicle: invoice.vehicle || {},
                    total: invoice.total || 0,
                    date: invoice.date ? new Date(invoice.date) : new Date(),
                    status: invoice.status || 'pending',
                    paid: invoice.paid || false,
                    description: invoice.description || ''
                })) : [];

                console.log('Formatted invoices:', formattedInvoices);

                setServiceRecords(formattedInvoices);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/invoices/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success('Invoice created successfully!');
            fetchInvoices(); // Refresh the list
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
    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/invoices/${id}`);
            fetchInvoices();
        } catch (error) {
            console.error('Error deleting invoice:', error);
        }
    };



    const fetchInvoices = async () => {
        try {
            const { data } = await axiosInstance.get('/api/invoices/all');
            
            // Ensure data is an array
            if (!Array.isArray(data)) {
                console.error('Expected array but got:', typeof data);
                setInvoices([]);
                return;
            }
            
            // Map the data to ensure all required fields exist
            const formattedInvoices = data.map(invoice => ({
                _id: invoice._id,
                invoiceDate: invoice.invoiceDate || new Date(),
                customerName: invoice.customerName || 'N/A',
                vehicleType: invoice.vehicleType || 'N/A',
                // Add other fields as needed
            }));
            
            setInvoices(formattedInvoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            toast.error('Failed to fetch invoices');
            setInvoices([]); // Set to empty array on error
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await axiosInstance(`/invoices/${id || 'recent'}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch invoice');
                }
                const data = await response.json();
                setInvoice(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching invoice:', err);
            }
        };

        fetchInvoice();
    }, [id]);

    return (
        <>
        <div className="pt-20">
            <div className="w-[70vw] p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                {/* Create Invoice Form */}
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
                        <input
                            type="email"
                            name="customerEmail"
                            placeholder="Customer Email"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
                        <input
                            type="text"
                            name="zipCode"
                            placeholder="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
                        <input
                            type="date"
                            name="invoiceDate"
                            value={formData.invoiceDate}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
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
                        <input
                            type="text"
                            name="vehicleNumber"
                            placeholder="Vehicle Number"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
                        <input
                            type="text"
                            name="vehicleVin"
                            placeholder="VIN"
                            value={formData.vehicleVin}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
                        <input
                            type="text"
                            name="vehicleColor"
                            placeholder="Vehicle Color"
                            value={formData.vehicleColor}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
                        <input
                            type="text"
                            name="vehicleMileage"
                            placeholder="Mileage"
                            value={formData.vehicleMileage}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
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
                        <input
                            type="text"
                            name="vehicleTransmission"
                            placeholder="Transmission"
                            value={formData.vehicleTransmission}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
                        <input
                            type="text"
                            name="vehicleFuelType"
                            placeholder="Fuel Type"
                            value={formData.vehicleFuelType}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            required
                        />
                        <textarea
                            name="vehicleDescription"
                            placeholder="Vehicle Description"
                            value={formData.vehicleDescription}
                            onChange={handleChange}
                            className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
                            rows="3"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Create Invoice
                        </button>
                    </div>
                </form>
            </div>

            {/* Invoices List */}
            <div className="w-full mt-6 p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Recent Invoices</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="px-4 py-2 text-gray-300">Date</th>
                                <th className="px-4 py-2 text-gray-300">Customer</th>
                                <th className="px-4 py-2 text-gray-300">Vehicle</th>
                                <th className="px-4 py-2 text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        {loading ? (
                            <p>Loading invoices...</p>
                        ) : invoices.length === 0 ? (
                            <p>No invoices found</p>
                        ) : (
                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice._id} className="border-b border-gray-700">
                                        <td className="px-4 py-2 text-gray-300">
                                            {new Date(invoice.invoiceDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2 text-gray-300">{invoice.customerName}</td>
                                        <td className="px-4 py-2 text-gray-300">{invoice.vehicleType}</td>
                                        <td className="px-4 py-2">
                                            <button 
                                                className="text-blue-400 hover:text-blue-300 mr-2"
                                                onClick={() => handleViewInvoice(invoice)}
                                            >
                                                View
                                            </button>
                                            <button className="text-red-400 hover:text-red-300">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
            </div>

            {/* Add Modal */}
            {isModalOpen && selectedInvoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-gray-800 text-gray-300 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Invoice Details</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold mb-2">Customer Information</h3>
                                <p><span className="font-medium">Name:</span> {selectedInvoice.customerName}</p>
                                <p><span className="font-medium">Email:</span> {selectedInvoice.customerEmail}</p>
                                <p><span className="font-medium">Phone:</span> {selectedInvoice.phoneNumber}</p>
                                <p><span className="font-medium">Address:</span> {selectedInvoice.address}</p>
                                <p><span className="font-medium">Date:</span> {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold mb-2">Vehicle Information</h3>
                                <p><span className="font-medium">Type:</span> {selectedInvoice.vehicleType}</p>
                                <p><span className="font-medium">Number:</span> {selectedInvoice.vehicleNumber}</p>
                                <p><span className="font-medium">VIN:</span> {selectedInvoice.vehicleVin}</p>
                                <p><span className="font-medium">Color:</span> {selectedInvoice.vehicleColor}</p>
                                <p><span className="font-medium">Mileage:</span> {selectedInvoice.vehicleMileage}</p>
                            </div>
                            
                            <div className="col-span-2">
                                <h3 className="font-semibold mb-2">Additional Details</h3>
                                <p><span className="font-medium">Engine:</span> {selectedInvoice.vehicleEngine}</p>
                                <p><span className="font-medium">Transmission:</span> {selectedInvoice.vehicleTransmission}</p>
                                <p><span className="font-medium">Fuel Type:</span> {selectedInvoice.vehicleFuelType}</p>
                                <p><span className="font-medium">Description:</span> {selectedInvoice.vehicleDescription}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        <InvoicePage />
        </>
    );
};

export default Invoice;
