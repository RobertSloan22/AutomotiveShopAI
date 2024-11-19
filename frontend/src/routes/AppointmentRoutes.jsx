import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppointmentList from '../pages/appointments/AppointmentList';
import AppointmentForm from '../pages/appointments/AppointmentForm';
import Appointments from '../components/appointments/Appointments';

const AppointmentRoutes = () => {
    return (
        <>
            
        <Routes>
            <Route index element={<AppointmentList />} />
            <Route path="new" element={<AppointmentForm />} />
            <Route path=":id" element={<Appointments />} />
        </Routes>
        <Appointments />
        </>
    );
};

export default AppointmentRoutes; 