import React from 'react';

const VehicleDetails = ({ vehicle }) => {
    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                    </h2>
                    <p className="text-gray-400">VIN: {vehicle.vin}</p>
                </div>
                <div className="text-right">
                    <p className="text-gray-400">License: {vehicle.licensePlate}</p>
                    <p className="text-gray-400">Mileage: {vehicle.mileage.toLocaleString()}</p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicle Info */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Vehicle Information</h3>
                    <div className="space-y-2">
                        <p className="text-gray-300">Engine: {vehicle.engine}</p>
                        <p className="text-gray-300">Transmission: {vehicle.transmission}</p>
                        <p className="text-gray-300">Color: {vehicle.color}</p>
                    </div>
                </div>

                {/* Service History */}
                <div className="bg-gray-700 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white mb-3">Recent Services</h3>
                    <div className="space-y-2">
                        {vehicle.serviceHistory.map(service => (
                            <div key={service._id} className="border-b border-gray-600 pb-2">
                                <p className="text-gray-300">{service.serviceType}</p>
                                <p className="text-sm text-gray-400">
                                    {new Date(service.serviceDate).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetails; 