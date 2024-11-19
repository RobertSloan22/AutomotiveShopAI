import React, { useState, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext';

const CustomerPortal = () => {
    const { currentCustomer } = useCustomer();
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages Panel */}
            <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
                <div className="space-y-4">
                    {messages.map(message => (
                        <div key={message._id} className="bg-gray-700 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <span className="text-white font-medium">{message.subject}</span>
                                <span className="text-gray-400 text-sm">
                                    {new Date(message.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-300 mt-2">{message.content}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
                <div className="space-y-3">
                    {notifications.map(notification => (
                        <div key={notification._id} 
                            className={`p-3 rounded-lg ${
                                notification.type === 'urgent' ? 'bg-red-900' :
                                notification.type === 'warning' ? 'bg-yellow-900' :
                                'bg-gray-700'
                            }`}
                        >
                            <p className="text-white">{notification.message}</p>
                            <span className="text-sm text-gray-400">
                                {new Date(notification.date).toLocaleDateString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CustomerPortal; 