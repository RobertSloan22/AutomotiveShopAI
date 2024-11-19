import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    lastExchange: {
      userMessage: String,
      assistantMessage: String
    },
    keyPoints: [String],
    notes: [{
      timestamp: Date,
      topic: String,
      tags: [String],
      keyPoints: [String],
      codeExamples: [{
        language: String,
        code: String
      }],
      resources: [String]
    }]
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;