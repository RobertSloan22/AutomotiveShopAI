import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { useEffect } from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { toast } from 'react-hot-toast';
// from material ui import container grid 
import { Container, Grid } from '@mui/material';    
//import Customer context and Invoice context

const DTCQueryInterface = () => {
    const { currentVehicle } = useVehicle();
    const [url, setUrl] = useState('');
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');//
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedVehicleData, setSelectedVehicleData] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [showVehicleModal, setShowVehicleModal] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [selectedCustomerData, setSelectedCustomerData] = useState(null);
    const [presetUrls] = useState([
        {
            name: 'F30 Bimmerpost',
            url: 'https://f30.bimmerpost.com/forums/'
        },
        {
            name: 'Jeep Wrangler Forum',
            url: 'https://www.jlwranglerforums.com/forum/'
        }, 
        {
            name: 'Audi Forums',
            url: 'https://www.audiworld.com/forums/'
        },
        
        // Add more preset URLs here as needed
    ]);
    const [customerSearch, setCustomerSearch] = useState({ firstName: '', lastName: '' });
    const [selectedCustomerInfo, setSelectedCustomerInfo] = useState(null);
    
    
    
    
    
    const fetchVehicles = async () => {
        try {
            const response = await axiosInstance.get('/vehicles');
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Failed to fetch vehicles');
        }
    };

// write the function use the GET /api/vehicles/customer?firstName=John&lastName=Doe to get vehicles by customer name 
    const fetchVehiclesByCustomerName = async () => {
        try {
            const response = await axiosInstance.get(`/vehicles`, {
                params: {
                    firstName: customerSearch.firstName,
                    lastName: customerSearch.lastName
                }
            });
            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Failed to fetch vehicles');
        }
    };


    const fetchInvoices = async () => {
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            
            const response = await axiosInstance.get('/api/invoices/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            return response.data;
        } catch (error) {
            console.error('Error fetching invoices:', error);
            if (error.response?.status === 401) {
                // Handle unauthorized access - maybe redirect to login
                window.location.href = '/login';
            }
            throw error;
        }
    };
    
    const fetchCustomers = async () => {
        try {
            console.log('Fetching customers...'); // Debug log
            const response = await axiosInstance.get('/customers/all');
            if (Array.isArray(response.data)) {
                console.log('Fetched customers:', response.data);
                setCustomers(response.data);
            } else {
                console.error('Expected array of customers but got:', response.data);
                setCustomers([]);
                toast.error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching customers:', err);
            toast.error('Failed to fetch customers');
            setCustomers([]);
        }
    };

    
    
    
        const fetchAppointments = async () => {
        try {
            const response = await axiosInstance.get('/appointments');
            setAppointments(response.data);
        } catch (err) {
            toast.error('Failed to fetch appointments');
            console.error('Error fetching appointments:', err);
        }
    };

// Write the function to import vehicle data from the db
  




    const handleImportVehicleData = async () => {
        try {
            const response = await axiosInstance.get('/invoices/all');
            setInvoices(response.data);
            setShowInvoiceModal(true);
        } catch (error) {
            console.error('Error importing vehicle data:', error);
            toast.error('Failed to import vehicle data');
        }
    };

    const handleImportFromVehicles = () => {
        setShowVehicleModal(true);
        fetchVehicles();
    };

    const handleImportFromAppointments = () => {
        setShowAppointmentModal(true);
        fetchAppointments();
    };
    const handleImportFromCustomers = () => {
        setShowCustomerModal(true);
        fetchCustomers();
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomerInfo({
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            phone: customer.phoneNumber,
            address: customer.address
        });

        if (customer.vehicles && customer.vehicles.length > 0) {
            const vehicle = customer.vehicles[0];
            const vehicleData = {
                type: `${vehicle.year} ${vehicle.make} ${vehicle.model}`.trim(),
                vin: vehicle.vin,
                engine: vehicle.engine,
                transmission: vehicle.transmission,
                mileage: vehicle.mileage,
                description: vehicle.notes || '',
                customerName: `${customer.firstName} ${customer.lastName}`
            };
            setSelectedVehicleData(vehicleData);
        } else {
            setSelectedVehicleData(null);
        }
        setShowCustomerModal(false);
        toast.success('Customer data imported successfully');
    };

    
    const handleSelectVehicle = (vehicle) => {
        const vehicleData = {
            type: `${vehicle.year} ${vehicle.make} ${vehicle.model}`.trim(),
            vin: vehicle.vin,
            engine: vehicle.engine,
            transmission: vehicle.transmission,
            mileage: vehicle.mileage,
            description: vehicle.description || ''
        };
        setSelectedVehicleData(vehicleData);
        setShowVehicleModal(false);
        toast.success('Vehicle data imported successfully');
    };

    const handleSelectInvoice = (invoice) => {
        const vehicleData = {
            type: `${invoice.vehicleYear || ''} ${invoice.vehicleMake || ''} ${invoice.vehicleModel || ''} ${invoice.vehicleType || ''}`.trim(),
            vin: invoice.vehicleVin,
            engine: invoice.vehicleEngine,
            transmission: invoice.vehicleTransmission,
            mileage: invoice.vehicleMileage,
            description: invoice.vehicleDescription || ''
        };
        setSelectedVehicleData(vehicleData);
        setShowInvoiceModal(false);
        toast.success('Vehicle data imported successfully');
    };

    const handleSelectAppointment = (appointment) => {
        const vehicleData = {
            type: `${appointment.vehicle.year} ${appointment.vehicle.make} ${appointment.vehicle.model}`.trim(),
            vin: appointment.vehicle.vin,
            engine: appointment.vehicle.engine,
            transmission: appointment.vehicle.transmission,
            mileage: appointment.vehicle.mileage,
            description: appointment.vehicle.description || '',
            appointmentDate: appointment.date,
            serviceType: appointment.serviceType,
            complaint: appointment.complaint
        };
        setSelectedVehicleData(vehicleData);
        setShowAppointmentModal(false);
        toast.success('Vehicle data imported from appointment');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isInitialized) {
            setError('Please initialize with a forum URL first');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const vehicleInfo = selectedVehicleData || currentVehicle;
            const formattedVehicleData = {
                type: vehicleInfo.type || `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`,
                vin: vehicleInfo.vin,
                engine: vehicleInfo.engine,
                transmission: vehicleInfo.transmission,
                mileage: vehicleInfo.mileage,
                description: vehicleInfo.description || ''
            };

            const result = await axiosInstance.post('/dtc-query', { 
                query,
                vehicle: formattedVehicleData
            });
            setResponse(result.data.response);
        } catch (err) {
            setError('Failed to get response. Please try again.');
            console.error('Query error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInitialize = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            await axiosInstance.post('/dtc-initialize', { url });
            setIsInitialized(true);
            toast.success('DTC Query system initialized successfully');
        } catch (err) {
            setError('Failed to initialize with the provided URL. Please check the URL and try again.');
            console.error('Initialization error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Function to format the response with proper styling
    const formatResponse = (text) => {
        if (!text) return null;

        // Split the response into sections more reliably
        const sections = text.split(/\d+\.\s+(?=[A-Z])/g).filter(Boolean);
        
        const sectionTitles = [
            "Vehicle-Specific Information",
            "DTC Code Definition",
            "Common Causes",
            "Symptoms",
            "Diagnostic Steps",
            "Repair Solutions",
            "Additional Notes"
        ];

        return (
            <>
          
            <div className="space-y-4">
                {sections.map((section, index) => {
                    // Clean up the section text
                    const cleanedSection = section.trim();
                    
                    return (
                        <div key={index} className="bg-gray-800 bg-opacity-50 rounded-lg p-4 font-bold text-white">
                            <h3 className="text-blue-400 font-bold mb-2">
                                {sectionTitles[index]}
                            </h3>
                            <div className="text-gray-200 font-bold space-y-2">
                                {cleanedSection.split('\n').map((line, i) => {
                                    const trimmedLine = line.trim();
                                    if (!trimmedLine) return null;
                                    
                                    return (
                                        <p key={i} className="ml-2">
                                            {trimmedLine.startsWith('-') ? (
                                                <span>
                                                    <span className="text-blue-400 mr-2">•</span>
                                                    {trimmedLine.replace('-', '').trim()}
                                                </span>
                                            ) : (
                                                trimmedLine
                                            )}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
            </>
        );
    };

    const CustomerList = ({ customers, onSelect }) => {
        return (
            <div className="max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                    {customers.map((customer) => (
                        <div
                            key={customer._id}
                            onClick={() => onSelect(customer)}
                            className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                        >
                            <p className="text-white font-medium">
                                {customer.firstName} {customer.lastName}
                            </p>
                            <p className="text-sm text-gray-300">
                                {customer.email || 'No email'} | {customer.phoneNumber || 'No phone'}
                            </p>
                            <p className="text-sm text-gray-300">
                                {customer.city}, {customer.zipCode}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const CustomerSearchModal = ({ onSelect, onClose }) => {
        const [searchTerm, setSearchTerm] = useState('');
        const [searchResults, setSearchResults] = useState([]);
        const [loading, setLoading] = useState(false);

        const handleSearch = async (value) => {
            setSearchTerm(value);
            if (value.length < 2) {
                setSearchResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axiosInstance.get(`/customers/search`, {
                    params: { term: value }
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error('Search error:', error);
                toast.error('Error searching customers');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Select Customer</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                    </div>
                    
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search customers..."
                        className="w-full p-2 mb-4 bg-gray-700 border border-gray-600 rounded-md text-white"
                    />

                    {loading && (
                        <div className="text-center py-4">
                            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
                        </div>
                    )}

                    <div className="max-h-[60vh] overflow-y-auto">
                        {searchResults.map((customer) => (
                            <div
                                key={customer._id}
                                onClick={() => onSelect(customer)}
                                className="p-4 bg-gray-700 rounded mb-2 cursor-pointer hover:bg-gray-600"
                            >
                                <p className="text-white font-medium">
                                    {customer.firstName} {customer.lastName}
                                </p>
                                {customer.vehicles && customer.vehicles.length > 0 && (
                                    <p className="text-sm text-gray-300">
                                        Vehicle: {customer.vehicles[0].year} {customer.vehicles[0].make} {customer.vehicles[0].model}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
        <Container maxWidth="xl">
        <Grid container spacing={2}>
        <Grid item xs={12}>
      
        </Grid>


        <Grid item xs={12}>
        <div className="flex-1 w-[50vw] font-bold text-white bg-gray-900 bg-opacity-75 backdrop-blur-md rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4 text-white">Vehicle DTC Code Query</h2>
            
            {/* Display current vehicle info */}
            {currentVehicle && (
                <div className="mb-4 p-3 bg-gray-800 bg-opacity-50 rounded font-bold text-white">
                    <h3 className="text-white font-semibold mb-2 font-bold">Current Vehicle:</h3>
                    <div className="font-white text-white">
                        <p>{currentVehicle.year} {currentVehicle.make} {currentVehicle.model}</p>
                        <p className="text-sm">VIN: {currentVehicle.vin}</p>
                        {currentVehicle.engine && <p className="text-sm">Engine: {currentVehicle.engine}</p>}
                    </div>
                </div>
            )}

            {/* URL Input Form */}
            <form onSubmit={handleInitialize} className="space-y-4 mb-6">
                <div className="flex gap-2">
                    <div className="flex-1 flex gap-2">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Enter automotive forum URL..."
                            className="flex-1 p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                        />
                        <select 
                            onChange={(e) => setUrl(e.target.value)}
                            className="p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                        >
                            <option value="">Select preset forum...</option>
                            {presetUrls.map((preset, index) => (
                                <option key={index} value={preset.url}>
                                    {preset.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !url.trim()}
                        className={`px-4 py-2 rounded text-white ${
                            loading || !url.trim() 
                                ? 'bg-gray-600' 
                                : 'bg-green-600 hover:bg-green-700'
                        } transition-colors duration-200`}
                    >
                        {loading ? 'Initializing...' : 'Initialize'}
                    </button>
                </div>
            </form>

            {/* Add Import Vehicle Data button */}
            <div className="mb-4 flex gap-2">
                <button
                    onClick={handleImportVehicleData}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                    Import from Invoice
                </button>
                <button
                    onClick={handleImportFromVehicles}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                    Import from Vehicles
                </button>
                <button
                    onClick={handleImportFromAppointments}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                >
                    Import from Appointments
                </button>
                <button
                    onClick={handleImportFromCustomers}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
                >
                    Import from Customers
                </button>
            </div>

            <div className="mt-4">
                <div className="bg-gray-800 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Selected Vehicle Data</h3>
                    {selectedCustomerInfo && (
                        <div className="mb-2 text-gray-300">
                            <p><span className="font-medium">Customer:</span> {selectedCustomerInfo.name}</p>
                            {selectedCustomerInfo.email && (
                                <p><span className="font-medium">Email:</span> {selectedCustomerInfo.email}</p>
                            )}
                            {selectedCustomerInfo.phone && (
                                <p><span className="font-medium">Phone:</span> {selectedCustomerInfo.phone}</p>
                            )}
                        </div>
                    )}
                    {selectedVehicleData && (
                        <div className="text-gray-300">
                            <p><span className="font-medium">Vehicle:</span> {selectedVehicleData.type}</p>
                            <p><span className="font-medium">VIN:</span> {selectedVehicleData.vin || 'N/A'}</p>
                            <p><span className="font-medium">Engine:</span> {selectedVehicleData.engine || 'N/A'}</p>
                            <p><span className="font-medium">Mileage:</span> {selectedVehicleData.mileage || 'N/A'}</p>
                            {selectedVehicleData.description && (
                                <p><span className="font-medium">Notes:</span> {selectedVehicleData.description}</p>
                            )}
                        </div>
                    )}
                    {!selectedCustomerInfo && !selectedVehicleData && (
                        <p className="text-gray-400">No customer or vehicle selected</p>
                    )}
                </div>
            </div>

            {/* Query Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter DTC code or describe the issue..."
                        className="flex-1 p-2 bg-gray-800 text-white border border-gray-700 rounded focus:outline-none focus:border-blue-500"
                    />
                    <button 
                        type="submit" 
                        disabled={loading || !query.trim() || !isInitialized}
                        className={`px-4 py-2 rounded text-white ${
                            loading || !query.trim() || !isInitialized
                                ? 'bg-gray-600' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        } transition-colors duration-200`}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-4 p-2 bg-red-900 bg-opacity-50 text-red-200 rounded">
                    {error}
                </div>
            )}
            
            {response && (
                <div className="mt-4">
                    {formatResponse(response)}
                </div>
            )}

            {/* Invoice Selection Modal */}
            {showInvoiceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
                    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-4">Select Vehicle Data from Invoice</h3>
                        <div className="space-y-4">
                            {Array.isArray(invoices) && invoices.length > 0 ? (
                                invoices.map((invoice) => (
                                    <div
                                        key={invoice._id}
                                        onClick={() => handleSelectInvoice(invoice)}
                                        className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                                    >
                                        <p className="text-white font-medium">
                                            {invoice.vehicleType} - VIN: {invoice.vehicleVin}
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            Engine: {invoice.vehicleEngine} | Mileage: {invoice.vehicleMileage}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-white">No invoices found</p>
                            )}
                        </div>
                        <button
                            onClick={() => setShowInvoiceModal(false)}
                            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showVehicleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
                    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-4">Select Vehicle</h3>
                        <div className="space-y-4">
                            {vehicles.map((vehicle) => (
                                <div
                                    key={vehicle._id}
                                    onClick={() => handleSelectVehicle(vehicle)}
                                    className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                                >
                                    <p className="text-white font-medium">
                                        {vehicle.year} {vehicle.make} {vehicle.model} - VIN: {vehicle.vin}
                                    </p>
                                    <p className="text-sm text-gray-300">
                                        Engine: {vehicle.engine} | Mileage: {vehicle.mileage}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowVehicleModal(false)}
                            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {showAppointmentModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 99999 }}>
                    <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white mb-4">Select Vehicle from Active Appointments</h3>
                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment._id}
                                    onClick={() => handleSelectAppointment(appointment)}
                                    className="p-4 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-white font-medium">
                                                {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
                                            </p>
                                            <p className="text-sm text-gray-300">VIN: {appointment.vehicle.vin}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-300">
                                                {new Date(appointment.date).toLocaleDateString()}
                                            </p>
                                            <p className="text-sm text-blue-400">{appointment.serviceType}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-2">
                                        Complaint: {appointment.complaint}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowAppointmentModal(false)}
                            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchVehiclesByCustomerName} className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500">
                            Fetch Vehicles by Customer Name
                        </button>
                    </div>
                </div>
            )}

            {showCustomerModal && (
                <CustomerSearchModal
                    onSelect={handleSelectCustomer}
                    onClose={() => setShowCustomerModal(false)}
                />
            )}
        </div>
        </Grid>
        </Grid>
        </Container>
        </> 
    );
};

export default DTCQueryInterface;