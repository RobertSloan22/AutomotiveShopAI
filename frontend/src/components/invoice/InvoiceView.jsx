import { useCustomer } from '../../context/CustomerContext';

const InvoiceView = ({ invoice }) => {
    const { selectCustomerAndVehicle } = useCustomer();

    const handleSetCurrent = () => {
        selectCustomerAndVehicle(invoice.customer, invoice.vehicle);
    };

    return (
        <div>
            {/* Existing invoice view content */}
            
            <button
                onClick={handleSetCurrent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Set as Current Vehicle
            </button>
        </div>
    );
};

export default InvoiceView; 