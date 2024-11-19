import React from 'react';
import { useVehicle } from '../../context/VehicleContext';
import { useCustomer } from '../../context/CustomerContext';

const VehicleIndicator = () => {
    const { currentVehicle } = useVehicle();
    const { currentCustomer } = useCustomer();

    if (!currentVehicle && !currentCustomer) return null;

    return (
        <div className="flex items-center bg-gray-700 rounded-lg px-3 py-1.5 text-sm">
            {currentCustomer && (
                <div className="border-r border-gray-500 pr-3 mr-3">
                    <span className="text-gray-400">Customer: </span>
                    <span className="text-white font-medium">
                        {currentCustomer.firstName} {currentCustomer.lastName}
                    </span>
                </div>
            )}
            {currentVehicle && (
                <div className="flex items-center">
                    <span className="text-gray-400">Vehicle: </span>
                    <span className="text-white font-medium ml-1">
                        {currentVehicle.year} {currentVehicle.make} {currentVehicle.model}
                    </span>
                    <button 
                        className="ml-2 text-gray-400 hover:text-white transition-colors"
                        title="View Details"
                        onClick={() => {/* Add vehicle details modal handler */}}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};

export default VehicleIndicator; 