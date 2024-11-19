import { createContext, useContext } from 'react';

export const InvoiceContext = createContext();
export const useInvoice = () => useContext(InvoiceContext); 