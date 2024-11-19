import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
    const navigate = useNavigate();
    
    const quickActions = [
        { label: 'New Appointment', action: () => navigate('/appointments/new'), icon: '📅' },
        { label: 'New Customer', action: () => navigate('/customers/new'), icon: '👥' },
        { label: 'New Service Record', action: () => navigate('/service-records/new'), icon: '🔧' },
        { label: 'Order Parts', action: () => navigate('/parts/order'), icon: '📦' },
        { label: 'DTC Query Interface', action: () => navigate('/dtc-query-interface'), icon: '🔍' },
        { label: 'Activant', action: () => navigate('/activant'), icon: '📅🔧' }
    ];

    return (
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
    );
};

export default QuickActions; 