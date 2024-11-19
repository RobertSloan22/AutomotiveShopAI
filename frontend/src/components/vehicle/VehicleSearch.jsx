import { useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useAuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const fetchVehiclesFromAllSources = async (searchTerm, token) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        console.log('Fetching vehicles with token:', token);
        
        const responses = await Promise.all([
            axios.get(`/api/vehicles/search?q=${searchTerm}`, config)
                .catch(err => ({ data: [], error: err })),
            axios.get(`/api/invoices/vehicles?q=${searchTerm}`, config)
                .catch(err => ({ data: [], error: err })),
            axios.get(`/api/appointments/vehicles?q=${searchTerm}`, config)
                .catch(err => ({ data: [], error: err })),
            axios.get(`/api/customers/vehicles?q=${searchTerm}`, config)
                .catch(err => ({ data: [], error: err }))
        ]);

        console.log('API Responses:', responses);

        const allVehicles = responses
            .filter(response => !response.error)
            .flatMap(response => response.data || []);

        console.log('Combined vehicles:', allVehicles);

        const uniqueVehicles = Array.from(
            new Map(allVehicles.map(vehicle => [vehicle.vin, vehicle])).values()
        );

        return uniqueVehicles;
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        toast.error('Failed to fetch vehicles');
        return [];
    }
};

export const VehicleSearch = ({ onSelect, disabled }) => {
    const { authUser } = useAuthContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.length >= 2) {
            console.log('Auth state:', { 
                isAuthenticated: !!authUser, 
                hasToken: !!authUser?.token,
                token: authUser?.token 
            });

            if (!authUser?.token) {
                toast.error('Authentication required');
                return;
            }

            setLoading(true);
            try {
                const results = await fetchVehiclesFromAllSources(value, authUser.token);
                console.log('Search results:', results);
                setVehicles(results);
                if (results.length === 0) {
                    toast.info('No vehicles found');
                }
            } catch (error) {
                console.error('Search error:', error);
                toast.error('Error searching vehicles');
            } finally {
                setLoading(false);
            }
        } else {
            setVehicles([]);
        }
    };

    return (
        <div className="relative">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search vehicles by VIN, make, model..."
                    value={searchTerm}
                    onChange={handleSearch}
                    disabled={disabled}
                    className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white pr-8"
                />
                {loading && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                    </div>
                )}
            </div>
            
            {vehicles.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.vin}
                            onClick={() => onSelect(vehicle)}
                            className="p-2 hover:bg-gray-700 cursor-pointer text-white"
                        >
                            <div className="font-medium">
                                {`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            </div>
                            <div className="text-sm text-gray-400">
                                VIN: {vehicle.vin}
                                {vehicle.customerName && ` • Owner: ${vehicle.customerName}`}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 