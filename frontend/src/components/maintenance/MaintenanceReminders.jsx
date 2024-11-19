import React, { useState } from 'react';

const MaintenanceReminders = () => {
    const [reminders, setReminders] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Maintenance Reminders</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Reminder
                </button>
            </div>

            {/* Reminders List */}
            <div className="space-y-4">
                {reminders.map(reminder => (
                    <div key={reminder._id} 
                        className={`bg-gray-700 rounded-lg p-4 border-l-4 ${
                            reminder.priority === 'high' ? 'border-red-500' :
                            reminder.priority === 'medium' ? 'border-yellow-500' :
                            'border-green-500'
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    {reminder.title}
                                </h3>
                                <p className="text-gray-400">
                                    Due: {new Date(reminder.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-400">
                                    {reminder.mileageInterval ? 
                                        `Every ${reminder.mileageInterval.toLocaleString()} miles` : 
                                        `Every ${reminder.timeInterval} months`}
                                </span>
                            </div>
                        </div>
                        
                        <p className="text-gray-300 mt-2">{reminder.description}</p>
                        
                        <div className="flex justify-end mt-4 space-x-2">
                            <button className="text-blue-400 hover:text-blue-300">
                                Complete
                            </button>
                            <button className="text-yellow-400 hover:text-yellow-300">
                                Snooze
                            </button>
                            <button className="text-red-400 hover:text-red-300">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Reminder Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                        {/* Form content */}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaintenanceReminders; 