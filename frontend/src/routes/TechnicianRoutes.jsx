import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TechnicianList from '../pages/technicians/TechnicianList';
import TechnicianDetails from '../pages/technicians/TechnicianDetails';

const TechnicianRoutes = () => {
    return (
        <Routes>
            <Route index element={<TechnicianList />} />
            <Route path=":id" element={<TechnicianDetails />} />
        </Routes>
    );
};

export default TechnicianRoutes; 