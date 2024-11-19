import Note from '../models/notes.model.js';

export const createNote = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id;
    
    console.log('📝 Creating note with content:', JSON.stringify(content, null, 2));
    console.log('👤 User ID:', userId);
    
    const newNote = new Note({
      content,
      userId,
      conversationId: req.body.conversationId || 'default'
    });

    const savedNote = await newNote.save();
    console.log('✅ Note saved successfully:', JSON.stringify(savedNote, null, 2));
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('❌ Error saving note:', error);
    console.error('Error details:', error.errors || error.message);
    res.status(500).json({ 
      message: error.message,
      details: error.errors 
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('🔍 Fetching notes for user:', userId);
    
    const notes = await Note.find({ userId });
    console.log(`📚 Found ${notes.length} notes:`, JSON.stringify(notes, null, 2));
    res.json(notes);
  } catch (error) {
    console.error('❌ Error fetching notes:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getNotesByConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;
    const notes = await Note.find({ userId, conversationId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;
    
    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      userId // Ensure user can only delete their own notes
    });

    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const { query, filter = 'all' } = req.query;
    const userId = req.user._id;

    let searchQuery = { userId };

    if (filter === 'topic') {
      searchQuery['content.topic'] = { $regex: query, $options: 'i' };
    } else if (filter === 'tags') {
      searchQuery['content.tags'] = { $regex: query, $options: 'i' };
    } else if (filter === 'content') {
      searchQuery['content.keyPoints'] = { $regex: query, $options: 'i' };
    } else {
      // 'all' - search across multiple fields
      searchQuery['$or'] = [
        { 'content.topic': { $regex: query, $options: 'i' } },
        { 'content.tags': { $regex: query, $options: 'i' } },
        { 'content.keyPoints': { $regex: query, $options: 'i' } }
      ];
    }

    const notes = await Note.find(searchQuery).sort({ timestamp: -1 });
    res.json(notes);
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getRecentNotes = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const userId = req.user._id;
    
    const notes = await Note.find({ userId })
      .sort({ timestamp: -1 })
      .limit(Number(limit));
      
    res.json(notes);
  } catch (error) {
    console.error('Error getting recent notes:', error);
    res.status(500).json({ message: error.message });
  }
};
