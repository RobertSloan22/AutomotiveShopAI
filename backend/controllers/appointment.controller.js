import Appointment from '../models/appointment.model.js';

export const createAppointment = async (req, res) => {
  try {
    const { title, start, end, description, customerName, phoneNumber } = req.body;
    
    const newAppointment = new Appointment({
      title,
      start,
      end,
      description,
      customerName,
      phoneNumber,
      userId: req.user._id,
    });

    await newAppointment.save();
    
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
