import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const VehicleDetails = () => {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch vehicle details
        setLoading(false);
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!vehicle) return <div>Vehicle not found</div>;

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-gray-400">VIN</p>
                        <p className="text-white">{vehicle.vin}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">License Plate</p>
                        <p className="text-white">{vehicle.licensePlate}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Mileage</p>
                        <p className="text-white">{vehicle.mileage}</p>
                    </div>
                    <div>
                        <p className="text-gray-400">Status</p>
                        <p className="text-white">{vehicle.status}</p>
                    </div>
                </div>
            </div>

            {/* Service History */}
            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Service History</h3>
                {/* Service history list */}
            </div>
        </div>
    );
};

export default VehicleDetails; 