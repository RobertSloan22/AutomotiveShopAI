import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ServiceList from '../pages/services/ServiceList';
import ServiceForm from '../pages/services/ServiceForm';
import ServiceCalendar from '../components/scheduling/ServiceCalendar';

const ServiceRoutes = () => {
    return (
        <Routes>
            <Route index element={<ServiceList />} />
            <Route path="new" element={<ServiceForm />} />
            <Route path=":id" element={<ServiceForm />} />
            <Route path="calendar" element={<ServiceCalendar />} />
        </Routes>
    );
};

export default ServiceRoutes; 