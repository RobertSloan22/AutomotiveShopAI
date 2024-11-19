import { InvoiceForm } from '../../components/invoice/InvoiceForm';
import { useCustomer } from '../../context/CustomerContext';
import { VehicleSearch } from '../../components/vehicle/VehicleSearch';

const NewInvoice = () => {
    const { selectedCustomer } = useCustomer();

    const handleSubmit = async (formData) => {
        try {
            const response = await fetch('/api/invoices/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to create invoice');
            }
        } catch (error) {
            console.error('Error creating invoice:', error);
        }
    };

    return (
        <>
      
        <div>
        
            <InvoiceForm 
                initialData={{
                    customerName: selectedCustomer?.name,
                    lastName: selectedCustomer?.lastName,
                    customerEmail: selectedCustomer?.email,
                    phoneNumber: selectedCustomer?.phone,
                    address: selectedCustomer?.address,
                    state: selectedCustomer?.state,
                    city: selectedCustomer?.city,
                    zipCode: selectedCustomer?.zip,
                }}
                onSubmit={handleSubmit}
            />
        </div>
        </>
    );
};

export default NewInvoice; 