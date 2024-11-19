import { createContext, useContext, useState } from 'react';

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
    const [currentVehicle, setCurrentVehicle] = useState(null);
    
    const updateCurrentVehicle = (vehicleData) => {
        setCurrentVehicle(vehicleData);
    };

    return (
        <VehicleContext.Provider value={{ currentVehicle, updateCurrentVehicle }}>
            {children}
        </VehicleContext.Provider>
    );
};

export const useVehicle = () => useContext(VehicleContext); 