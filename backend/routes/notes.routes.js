import express from 'express';
import { 
  createNote,
  getNotes,
  getNotesByConversation,
  deleteNote,
  searchNotes,
  getRecentNotes
} from '../controllers/notes.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import protectRoute from "../middleware/protectRoute.js";


const router = express.Router();

// All routes are protected with auth middleware
router.use(protectRoute);

// Create a new note
router.post('/', protectRoute, createNote);

// Get all notes for the authenticated user
router.get('/', protectRoute, getNotes);

// Get notes for a specific conversation
router.get('/conversation/:conversationId', protectRoute, getNotesByConversation);

// Delete a specific note
router.delete('/:noteId', protectRoute, deleteNote);

// Add these routes before the export
router.get('/search', protectRoute, searchNotes);
router.get('/recent', protectRoute, getRecentNotes);

export default router;
