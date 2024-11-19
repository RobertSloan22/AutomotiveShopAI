import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from "react-router-dom";
import CustomerSearch from '../../components/customers/CustomerSearch';
/// import the nav bar from components 
import Navbar from '../../components/navbar/navbar';
// import the sidebar from components
import Sidebar from '../../components/sidebar/Sidebar';
// import the message container from components
import MessageContainer from '../../components/messages/MessageContainer';
// import the Appointments from components
import Appointments from '../../components/appointments/Appointments';
import AppointmentModal from '../../components/appointments/AppointmentModal';
import AppointmentForm from '../../components/appointments/AppointmentForm';
import { Grid, Container } from '@mui/material';
import AppointmentList from '../appointments/AppointmentList';
import axiosInstance from '../../utils/axiosConfig'
const Activant = () => {
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
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/invoices/create', {
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

    const fetchInvoices = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/invoices/all', {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
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

    // Add this new handler
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        
        const filtered = invoices.filter(invoice => 
            invoice.customerName.toLowerCase().includes(term) ||
            invoice.customerEmail.toLowerCase().includes(term) ||
            invoice.phoneNumber.includes(term)
        );
        setFilteredInvoices(filtered);
    };

    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setIsCustomerModalOpen(true);
    };

    return (
        <>
       <AppointmentList/>

                      <MessageContainer />
                        <Appointments/>
        
        </>
    );
};

export default Activant;
