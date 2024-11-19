import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const TodaysAppointments = ({ appointments, loading }) => {
    const navigate = useNavigate();

    return (
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
    );
};

export default TodaysAppointments; 