import React from 'react';
import { useState } from 'react';
import Appointments from '../appointments/Appointments';


const InvoiceModal = ({ isOpen, onClose, invoice }) => {
    if (!isOpen || !invoice) return null;

    return (
        <div>
            <Appointments />
        </div>
    );
};

export default InvoiceModal;