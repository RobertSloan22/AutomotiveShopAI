import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';

const ShopDashboard = () => {
    return (
        <>   
        <Sidebar/>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                        New Service Record
                    </button>
                    <button className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700">
                        Add New Customer
                    </button>
                    <button className="w-full bg-purple-600 text-white p-3 rounded hover:bg-purple-700">
                        Add New Vehicle
                    </button>
                </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Today' Appointments</h2>
                <div className="space-y-3">
                    {/* Appointment list */}
                </div>
            </div>

            {/* Vehicles In Shop */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold text-white mb-4">Vehicles In Shop</h2>
                <div className="space-y-3">
                    {/* Vehicle list */}
                </div>
            </div>
        </div>
        <Sidebar/>

        </>
    );
};

export default ShopDashboard; 