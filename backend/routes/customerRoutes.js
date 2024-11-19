import express from 'express';
import { 
    createCustomer,
    updateCustomer,
    getCustomer,
    getCustomerVehicles,
    getCustomerInvoices,
    searchCustomers,
    getAllCustomers,
    updateCustomerWithVehicle,
    deleteCustomer
} from '../controllers/customerController.js';
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();
// Get all customers
router.get('/all', protectRoute, getAllCustomers);
// Search endpoint (should come before /:id routes to avoid conflicts)
router.get('/search', protectRoute, searchCustomers);

// Create new customer
router.post('/', protectRoute, createCustomer);

// Get customer by ID
router.get('/:id', protectRoute, getCustomer);

// Update customer
router.put('/:id', protectRoute, updateCustomer);

// Get customer's vehicles
router.get('/:id/vehicles', protectRoute, getCustomerVehicles);

// Get customer's invoices
router.get('/:id/invoices', protectRoute, getCustomerInvoices);

// Update customer with vehicle
router.put('/:id/with-vehicle', protectRoute, updateCustomerWithVehicle);

// Delete customer
router.delete('/:id', protectRoute, deleteCustomer);

// Update the search route to handle both search methods
router.get('/search', protectRoute, searchCustomers);
router.get('/search-by-name', protectRoute, searchCustomers); // Optional: add a dedicated name search endpoint

export default router; 