import React from 'react';

const VehicleSelectionModal = ({ isOpen, onClose, vehicles, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-white mb-4">Select Vehicle</h3>
                
                <div className="space-y-2">
                    {vehicles.map(vehicle => (
                        <div
                            key={vehicle._id}
                            onClick={() => onSelect(vehicle)}
                            className="bg-gray-700 p-3 rounded cursor-pointer hover:bg-gray-600"
                        >
                            <p className="text-white">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </p>
                            <p className="text-gray-400 text-sm">
                                VIN: {vehicle.vin}
                            </p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default VehicleSelectionModal; 