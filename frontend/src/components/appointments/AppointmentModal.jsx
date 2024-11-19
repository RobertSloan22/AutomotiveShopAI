import React from 'react';

const AppointmentModal = ({ isOpen, onClose, appointment, setAppointment, onSave, isViewing = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">{isViewing ? 'Appointment Details' : 'New Appointment'}</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(appointment);
        }}>
          <input
            type="text"
            placeholder="Customer Name"
            className="w-full mb-2 p-2 border rounded"
            value={appointment.customerName}
            onChange={(e) => setAppointment({...appointment, customerName: e.target.value})}
            readOnly={isViewing}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full mb-2 p-2 border rounded"
            value={appointment.phoneNumber}
            onChange={(e) => setAppointment({...appointment, phoneNumber: e.target.value})}
            readOnly={isViewing}
          />
          <input
            type="text"
            placeholder="Vehicle"
            className="w-full mb-2 p-2 border rounded"
            value={appointment.vehicle}
            onChange={(e) => setAppointment({...appointment, vehicle: e.target.value})}
            readOnly={isViewing}
          />
          <textarea
            placeholder="Complaint"
            className="w-full mb-2 p-2 border rounded"
            value={appointment.complaint}
            onChange={(e) => setAppointment({...appointment, complaint: e.target.value})}
            readOnly={isViewing}
          />
          <textarea
            placeholder="Notes"
            className="w-full mb-2 p-2 border rounded"
            value={appointment.notes}
            onChange={(e) => setAppointment({...appointment, notes: e.target.value})}
            readOnly={isViewing}
          />
          <input
            type="datetime-local"
            className="w-full mb-2 p-2 border rounded"
            value={appointment.time}
            onChange={(e) => setAppointment({...appointment, time: e.target.value})}
            readOnly={isViewing}
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Close
            </button>
            {!isViewing && (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
