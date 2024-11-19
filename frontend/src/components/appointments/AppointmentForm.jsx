import React, { useState, useEffect } from 'react';
import CustomerSearch from '../customers/CustomerSearch';
import { useLocation } from 'react-router-dom';

const AppointmentForm = ({ selectedAppointment, onSave }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    phoneNumber: '',
    vehicle: '',
    complaint: '',
    notes: '',
    time: new Date().toISOString().slice(0, 16),
    status: 'scheduled'
  });

  const location = useLocation();
  const customerData = location.state?.customerData;

  // Initialize form with customer data if available
  useEffect(() => {
    if (customerData) {
      setFormData(prevData => ({
        ...prevData,
        customerName: customerData.customerName,
        phoneNumber: customerData.phoneNumber,
        email: customerData.email
      }));
    }
  }, [customerData]);

  // Update form when selectedAppointment changes
  useEffect(() => {
    if (selectedAppointment) {
      setFormData({
        customerName: selectedAppointment.customerName || '',
        phoneNumber: selectedAppointment.phoneNumber || '',
        vehicle: selectedAppointment.vehicle || '',
        complaint: selectedAppointment.complaint || '',
        notes: selectedAppointment.notes || '',
        time: selectedAppointment.time || new Date().toISOString().slice(0, 16)
      });
    }
  }, [selectedAppointment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      _id: selectedAppointment?._id // Include _id if it exists (for updates)
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCustomerSelect = (customer) => {
    setFormData(prev => ({
      ...prev,
      customerName: customer.name,
      // Add any other customer fields you want to auto-fill
    }));
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-10 text-white w-[154w] h-[calc(82vh-150px)] text-lg">
      <CustomerSearch onCustomerSelect={handleCustomerSelect} />
      
      <div>
        <label className="block text-lg font-medium text-white">Customer Name</label>
        <input
          type="text"
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white h-[50px] text-lg px-4"
          required
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-white">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white h-[50px] text-lg px-4"
          required
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-white">Vehicle</label>
        <input
          type="text"
          name="vehicle"
          value={formData.vehicle}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white h-[50px] text-lg px-4"
          required
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-white">Complaint</label>
        <textarea
          name="complaint"
          value={formData.complaint}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white h-[100px] text-lg p-4"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-white">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white h-[100px] text-lg p-4"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-white">Time</label>
        <input
          type="datetime-local"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white h-[50px] text-lg px-4"
          required
        />
      </div>

      <div>
        <label className="block text-lg font-medium text-white">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-700 text-white h-[50px] text-lg px-4"
        >
          <option value="scheduled">Scheduled</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-3 text-xl text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        {selectedAppointment ? 'Update Appointment' : 'Create Appointment'}
      </button>
 
    </form>
    </>
  );
};

export default AppointmentForm;
