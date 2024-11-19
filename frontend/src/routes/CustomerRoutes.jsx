import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerList from '../pages/customers/CustomerList';
import CustomerDetails from '../pages/customers/CustomerDetails';
import CustomersPage from '../pages/customers/CustomersPage';

const CustomerRoutes = () => {
    return (
        <CustomersPage>
            <Routes>
                <Route index element={<CustomerList />} />
                <Route path=":id" element={<CustomerDetails />} />
            </Routes>
        </CustomersPage>
    );
};

export default CustomerRoutes; 