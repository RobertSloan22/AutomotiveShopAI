import React from 'react'
import { VehicleSearch } from '../../components/vehicle/VehicleSearch';
import Navbar from '../../components/navbar/navbar';
// import the sidebar from components
import Sidebar from '../../components/sidebar/Sidebar';
// import the message container from components
import MessageContainer from '../../components/messages/MessageContainer';
// import vehiclelist and vehicledetails from /vehicles
import VehicleList from '../../pages/vehicles/VehicleList';
import VehicleDetails from '../../pages/vehicles/VehicleDetails';  
import NewInvoice from '../../pages/invoice/NewInvoice';
import InvoiceForm from '../../components/invoice/InvoiceForm';
import InvoiceCreate from '../../components/invoice/InvoiceCreate';
import InvoiceModal from '../../components/invoice/InvoiceModal';
import InvoiceView from '../../components/invoice/InvoiceView';
const InvoicePage = () => {
  return (
    <div>
            <NewInvoice />
            <InvoiceForm />
            <InvoiceCreate />
            <InvoiceModal />
    </div>
  )
}

export default InvoicePage
