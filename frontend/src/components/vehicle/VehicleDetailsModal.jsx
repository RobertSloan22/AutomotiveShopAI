import React from 'react';

const VehicleDetailsModal = ({ vehicle, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Vehicle Details</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="bg-gray-700 rounded p-3">
                        <p className="text-gray-400 text-sm">Vehicle</p>
                        <p className="text-white">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                    </div>
                    
                    <div className="bg-gray-700 rounded p-3">
                        <p className="text-gray-400 text-sm">VIN</p>
                        <p className="text-white font-mono">{vehicle.vin}</p>
                    </div>

                    {vehicle.engine && (
                        <div className="bg-gray-700 rounded p-3">
                            <p className="text-gray-400 text-sm">Engine</p>
                            <p className="text-white">{vehicle.engine}</p>
                        </div>
                    )}

                    {vehicle.transmission && (
                        <div className="bg-gray-700 rounded p-3">
                            <p className="text-gray-400 text-sm">Transmission</p>
                            <p className="text-white">{vehicle.transmission}</p>
                        </div>
                    )}

                    {vehicle.mileage && (
                        <div className="bg-gray-700 rounded p-3">
                            <p className="text-gray-400 text-sm">Mileage</p>
                            <p className="text-white">{vehicle.mileage.toLocaleString()} miles</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailsModal; 