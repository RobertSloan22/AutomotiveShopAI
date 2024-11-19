import express from "express";
import { 
    createInvoice, 
    getAllInvoices, 
    getInvoiceById, 
    updateInvoice, 
    deleteInvoice,
    getInvoicesByCustomer, 
    getRecentInvoices
} from "../controllers/invoice.controller.js";
import protectRoute from "../middleware/protectRoute.js";
import Invoice from "../models/invoice.model.js";

const router = express.Router();

// Protected routes (require authentication)
router.post("/create", protectRoute, createInvoice);
router.get("/recent", protectRoute, getRecentInvoices);
router.get("/customer/:id", protectRoute, getInvoicesByCustomer);
router.get("/all", protectRoute, getAllInvoices);
router.get("/:id", protectRoute, getInvoiceById);
router.put("/:id", protectRoute, updateInvoice);
router.delete("/:id", protectRoute, deleteInvoice);

export default router;