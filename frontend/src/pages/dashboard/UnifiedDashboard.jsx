import { Grid, Container } from '@mui/material';
import MessageContainer from "../../components/messages/MessageContainer";
import CustomerSearch from "../../components/customers/CustomerSearch";
import DTCQueryInterface from "../../components/dtc/DTCQueryInterface";
import Appointments from "../../components/appointments/Appointments";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import { AutoChatAssistant } from "../../components/assistant/AutoChatAssistant.tsx";
import { ConsolePage } from '../../components/assistant/ConsolePage';

const UnifiedDashboard = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    
    // Reference the stats from Overview.jsx
    const stats = [
        { label: 'Appointments Today', value: '8', icon: '📅' },
        { label: 'Vehicles In Service', value: '5', icon: '🚗' },
        { label: 'Pending Invoices', value: '3', icon: '📄' },
        { label: 'Low Stock Items', value: '12', icon: '⚠️' }
    ];

    return (
        <>
 
        <Container maxWidth="xl" className="py-6">
            {/* Top Stats Row */}
            <Grid item xs={12}>
        <div className="flex justify-center items-center h-[10vh] font-bold text-3xl text-white">
        <h1>DTC Dashboard</h1>
        </div>
        </Grid>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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

            <Grid container spacing={3}>
                {/* Left Column */}
                <Grid item xs={12} md={6}>
                    {/* Customer Search Section */}
                  

                    {/* DTC Query Interface */}
                    <DTCQueryInterface />

                    {/* Add AutoChat Assistant */}
                    <div className="mt-6">
                            </div>
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={6}>
                    {/* Message Container */}

                    {/* Appointments Calendar */}
                    <div className="bg-gray-800 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">Appointments</h2>
                            <button
                                onClick={() => navigate('/appointments/new')}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                New Appointment
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {appointments && appointments.map((apt) => (
                                <div key={apt._id} className="bg-gray-700 p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-medium">{apt.customerName}</h3>
                                            <p className="text-sm text-gray-400">{apt.vehicle}</p>
                                            <p className="text-sm text-gray-400">
                                                {new Date(apt.start).toLocaleTimeString()} - {new Date(apt.end).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500 text-white">
                                            {new Date(apt.start).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {apt.notes && (
                                        <p className="mt-2 text-sm text-gray-400">{apt.notes}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                    </div>
                    
                </Grid>
               
            </Grid>
            
  </Container>
        </>
    );
};

export default UnifiedDashboard; 