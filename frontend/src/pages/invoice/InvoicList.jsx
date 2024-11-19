import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
/// import the nav bar from components 
// import axios
import axiosInstance from '../../utils/axiosConfig';


// import Appointments from components
const Invoice = () => {
    const [invoices, setInvoices] = useState([]);
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
            const res = await axiosInstance.get('/invoices/all');
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            setInvoices(data);
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handleViewInvoice = (invoice) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    return (
        <>
        <div>

            {/* Invoices List */}
            <div className="bg-gray-800 rounded-lg p-6">
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
                                        <button className="text-red-400 hover:text-red-300"
                                            onClick={() => handleDelete(invoice._id)}
                                            >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
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
        </>
    );
};

export default Invoice;
