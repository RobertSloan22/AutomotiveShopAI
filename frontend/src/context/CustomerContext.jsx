import React, { createContext, useContext, useState } from 'react';

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerData, setCustomerData] = useState({});

    const updateCustomerData = (data) => {
        setCustomerData(prevData => ({
            ...prevData,
            ...data
        }));
    };

    return (
        <CustomerContext.Provider value={{
            selectedCustomer,
            setSelectedCustomer,
            customerData,
            updateCustomerData
        }}>
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomer = () => {
    const context = useContext(CustomerContext);
    if (!context) {
        throw new Error('useCustomer must be used within a CustomerProvider');
    }
    return context;
};