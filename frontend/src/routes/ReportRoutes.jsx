import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ReportsDashboard from '../pages/reports/ReportsDashboard';

const ReportRoutes = () => {
    return (
        <Routes>
            <Route index element={<ReportsDashboard />} />
            
        </Routes>
    );
};

export default ReportRoutes; 