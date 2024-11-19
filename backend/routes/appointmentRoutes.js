import express from 'express';
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment
} from '../controllers/appointmentController.js';
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/', protectRoute, createAppointment);
router.get('/', protectRoute, getAppointments);
router.put('/:id', protectRoute, updateAppointment);
router.delete('/:id', protectRoute, deleteAppointment);

export default router;
