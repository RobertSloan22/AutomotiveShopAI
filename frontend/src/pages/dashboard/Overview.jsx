import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { format } from 'date-fns';
import { AppointmentsPage } from '../../components/assistant/AppointmentsPage';
//import all components needed for the chat feature
import MessageContainer from "../../components/messages/MessageContainer";
import { Link } from "react-router-dom";

import Grid from '@mui/material/Grid2';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));
//import the message container

const Overview = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [serviceRecords, setServiceRecords] = useState([]);
    const [serviceVehicles, setServiceVehicles] = useState([]);
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
                // fetch vehicles
                const { data: vehicleData } = await axiosInstance.get('/vehicles');
                console.log('Raw vehicles:', vehicleData);

                const formattedVehicles = Array.isArray(vehicleData) ? vehicleData.map(vehicle => ({
                    _id: vehicle._id,
                    year: vehicle.year,
                    make: vehicle.make,
                    model: vehicle.model,
                    licensePlate: vehicle.licensePlate
                })) : [];

                console.log('Formatted Vehilces:', formattedVehicles);


                setServiceVehicles(formattedVehicles);

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
        { label: 'Vehicles In Service', value: vehicles.length, icon: '🚗' },
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
// the menu should be centered in the screen with equal padding on top and bottom 
    return (
        <>
 <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid size="auto">
          <Item>size=auto
          <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.action}
                                    className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    <span className="text-2xl mb-2">{action.icon}</span>
                                    <span className="text-white text-sm text-center">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
          </Item>
        </Grid>
        <Grid size={6}>
          <Item>size=6</Item>
        </Grid>
        <Grid size="grow">
          <Item>size=grow
          <AppointmentsPage />
          </Item>
        </Grid>
      </Grid>
  
                    
        <div className=" row-span-4">
            <div className="w-[75vw] mx-auto px-4 py-8">
                <MessageContainer />
                <div className="space-y-6">
                    {/* Stats Grid */}
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

                    {/* Quick Actions */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {quickActions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.action}
                                    className="flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    <span className="text-2xl mb-2">{action.icon}</span>
                                    <span className="text-white text-sm text-center">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Today's Appointments */}
                      
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Today's Appointments</h2>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-gray-400">Loading appointments...</div>
                                ) : appointments.length === 0 ? (
                                    <div className="text-gray-400">No appointments scheduled for today</div>
                                ) : (
                                    appointments.map(appointment => (
                                        <div 
                                            key={appointment._id}
                                            className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600"
                                            onClick={() => navigate(`/appointments/${appointment._id}`)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {format(new Date(appointment.start), 'h:mm a')} - {appointment.customerName}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {appointment.vehicle}
                                                    </p>
                                                    {appointment.notes && (
                                                        <p className="text-sm text-gray-400 mt-1">
                                                            Notes: {appointment.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-sm text-blue-400">
                                                        {appointment.status || 'scheduled'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <AppointmentsPage/>
                        {/* Recent Invoices */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold text-white mb-4">Recent Invoices</h2>
                            <div className="space-y-4">
                                {loading ? (
                                    <div className="text-gray-400">Loading invoices...</div>
                                ) : serviceRecords.length === 0 ? (
                                    <div className="text-gray-400">No recent invoices</div>
                                ) : (
                                    serviceRecords.map(invoice => (
                                        <div 
                                            key={invoice._id}
                                            className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600"
                                            onClick={() => navigate(`/invoices/${invoice._id}`)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-white font-medium">
                                                        {invoice.customerName}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        Invoice #{invoice.invoiceNumber}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {invoice.vehicle?.year} {invoice.vehicle?.make} {invoice.vehicle?.model}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-medium">
                                                        ${invoice.total.toFixed(2)}
                                                    </p>
                                                    <p className={`text-sm ${invoice.paid ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {invoice.paid ? 'Paid' : 'Pending'}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {format(new Date(invoice.date), 'MMM d, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Box>
        </>
    );
};

export default Overview; 