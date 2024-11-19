import axiosInstance from '../../utils/axiosInstance';

export const createInvoice = async (invoiceData) => {
    try {
        const response = await axiosInstance.post('/invoices/create', invoiceData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        // Customize error handling if needed
        throw new Error(error.response?.data?.error || error.message);
    }
};