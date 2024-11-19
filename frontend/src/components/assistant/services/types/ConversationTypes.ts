import { NoteEntry } from '../../../types';  // Adjust path as needed

export interface ConversationExchange {
  userMessage: string;
  assistantMessage: string;
}

export interface SaveConversationRequest {
  title: string;
  lastExchange: ConversationExchange;
  keyPoints: string[];
  notes: NoteEntry[];
}

export interface ConversationSummary {
  id: string;
  title: string;
  lastExchange: ConversationExchange;
  keyPoints: string[];
  notes: NoteEntry[];
  createdAt: Date;
}