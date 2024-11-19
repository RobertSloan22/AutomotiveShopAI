import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import axios from 'axios';

const InvoiceContext = createContext();

export const useInvoice = () => useContext(InvoiceContext);

export const InvoiceProvider = ({ children }) => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInvoices = async () => {
        try {
            const res = await axiosInstance.get('invoices/recent');
            setInvoices(res.data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <InvoiceContext.Provider value={{ invoices, setInvoices, loading, fetchInvoices }}>
            {children}
        </InvoiceContext.Provider>
    );
};
