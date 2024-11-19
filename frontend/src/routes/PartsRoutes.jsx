import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PartsList from '../pages/parts/PartsList';
import PartsForm from '../pages/parts/PartsForm';

const PartsRoutes = () => {
    return (
        <Routes>
            <Route index element={<PartsList />} />
            <Route path="new" element={<PartsForm />} />
            <Route path=":id" element={<PartsForm />} />
        </Routes>
    );
};

export default PartsRoutes; 