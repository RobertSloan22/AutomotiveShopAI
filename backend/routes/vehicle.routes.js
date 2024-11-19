import express from 'express';
import { 
    createVehicle, 
    getVehicle, 
    updateVehicle, 
    deleteVehicle, 
    getCustomerVehicles,
    getVehicleServiceHistory,
    getAllVehicles,
    getVehiclesByCustomerName,
    getRecentVehicles,
} from '../controllers/vehicleController.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import protectRoute from "../middleware/protectRoute.js";
import Vehicle from "../models/vehicle.model.js";
const router = express.Router();
// Get all vehicles
router.get('/', protectRoute, getAllVehicles);
// Get all vehicles for a customer
router.get('/customer', protectRoute, getVehiclesByCustomerName);
// Get single vehicle
router.get('/:id', protectRoute, getVehicle);

// Add new vehicle
router.post('/', protectRoute, createVehicle);

// Update vehicle
router.put('/:id', protectRoute, updateVehicle);

// Delete vehicle
router.delete('/:id', protectRoute, deleteVehicle);

// Get vehicle service history
router.get('/:id/service-history', protectRoute, getVehicleServiceHistory);

// create a invoices/recent route
router.get('/invoices/recent', protectRoute, getRecentVehicles);

export default router; 