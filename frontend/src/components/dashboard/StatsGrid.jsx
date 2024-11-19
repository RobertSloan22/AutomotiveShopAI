import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const StatsGrid = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [serviceRecords, setServiceRecords] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const stats = [
        { label: 'Appointments Today', value: appointments.length, icon: '📅' },
        { label: 'Vehicles In Service', value: appointments.filter(a => a.status === 'in-progress').length, icon: '🚗' },
        { label: 'Pending Invoices', value: serviceRecords.filter(r => !r.paid).length, icon: '📄' },
        { label: 'Low Stock Items', value: '12', icon: '⚠️' }
    ];

    const quickActions = [
        { label: 'New Appointment', action: () => navigate('/appointments/new'), icon: '📅' },
        { label: 'New Customer', action: () => navigate('/customers/new'), icon: '👥' },
        { label: 'New Service Record', action: () => navigate('/service-records/new'), icon: '🔧' },
        { label: 'Order Parts', action: () => navigate('/parts/order'), icon: '📦' },
        { label: 'DTC Query Interface', action: () => navigate('/dtc-query-interface'), icon: '🔍' },
        { label: 'Activant', action: () => navigate('/activant'), icon: '📅🔧' }
    ];
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                        </div>
                        <span className="text-2xl">{stat.icon}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsGrid; 