import React from 'react';

const AppointmentDetailsModal = ({ appointment, onClose, onEdit }) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Appointment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-white">
          <div>
            <label className="font-medium">Customer Name:</label>
            <p>{appointment.customerName}</p>
          </div>
          
          <div>
            <label className="font-medium">Phone Number:</label>
            <p>{appointment.phoneNumber}</p>
          </div>
          
          <div>
            <label className="font-medium">Vehicle:</label>
            <p>{appointment.vehicle}</p>
          </div>
          
          <div>
            <label className="font-medium">Time:</label>
            <p>{new Date(appointment.start).toLocaleString()}</p>
          </div>
          
          <div>
            <label className="font-medium">Complaint:</label>
            <p>{appointment.complaint}</p>
          </div>
          
          <div>
            <label className="font-medium">Notes:</label>
            <p>{appointment.notes}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => handleDeleteAppointment(appointment._id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
          <button
            onClick={() => onEdit(appointment)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal; 