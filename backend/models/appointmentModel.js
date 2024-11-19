import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  vehicle: {
    type: String,
    required: true,
  },
  vehicleMake: {
    type: String,
    required: false,
  },
  vehicleYear: {
    type: Number,
    required: false,
  },
  vehicleModel: {
    type: String,
    required: false,
  },
  complaint: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
  },
  time: {
    type: Date,
    required: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
