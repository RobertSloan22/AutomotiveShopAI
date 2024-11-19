import React from 'react';
import { Routes, Route } from 'react-router-dom';
import VehicleList from '../pages/vehicles/VehicleList';
import VehicleDetails from '../pages/vehicles/VehicleDetails';
import NewVehicleForm from '../components/customers/NewCustomerForm';
import VehiclePage from '../pages/vehicles/VehiclePage';
const VehicleRoutes = () => {
    return (
        <Routes>
            <Route index element={<VehiclePage />} />
        
        </Routes>
    );
};

export default VehicleRoutes; 