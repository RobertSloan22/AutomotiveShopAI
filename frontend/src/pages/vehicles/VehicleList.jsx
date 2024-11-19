import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('/api/vehicles/all');
                setVehicles(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                toast.error('Failed to fetch vehicles');
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Vehicles</h2>
                <Link
                    to="/vehicles/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add Vehicle
                </Link>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <Link
                            key={vehicle._id}
                            to={`/vehicles/${vehicle._id}`}
                            className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700"
                        >
                            <h3 className="text-lg font-semibold text-white">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </h3>
                            <p className="text-gray-400">VIN: {vehicle.vin}</p>
                            <p className="text-gray-400">
                                Owner: {vehicle.customerName}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VehicleList; 