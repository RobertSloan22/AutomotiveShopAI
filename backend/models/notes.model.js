import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  content: {
    type: {
      topic: { type: String },
      tags: [{ type: String }],
      keyPoints: [{ type: String }],
      codeExamples: [{
        language: String,
        code: String
      }],
      resources: [{ type: String }]
    },
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    default: '507f1f77bcf86cd799439011' // Temporary fixed ObjectId
  },
  conversationId: {
    type: String,
    default: 'default'
  }
}, {
  timestamps: true
});

const Note = mongoose.model('Note', noteSchema);

export default Note;