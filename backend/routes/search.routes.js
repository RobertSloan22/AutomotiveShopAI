import express from 'express';
import { searchDiagrams } from '../controllers/search.controller.js';
import protectRoute from "../middleware/protectRoute.js";
import { verifyToken } from '../middleware/auth.middleware.js';


const router = express.Router();
router.use(protectRoute);

router.post('/search/diagrams', protectRoute, searchDiagrams);

export default router;