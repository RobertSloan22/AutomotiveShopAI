import express from 'express';
import { searchImages } from '../controllers/serper.controller.js';
import protectRoute from "../middleware/protectRoute.js";
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply protection middleware
router.use(protectRoute);

// Protected routes
router.post('/images', protectRoute, searchImages);

export default router;