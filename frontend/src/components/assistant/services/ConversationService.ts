import axios from 'axios';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client.js';
import axiosInstance from '../../../utils/axiosConfig';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export interface SavedConversation {
  _id: string;
  timestamp: string;
  title: string;
  lastExchange: {
    userMessage: string;
    assistantMessage: string;
  };
  keyPoints: string[];
  notes: {
    timestamp: Date;
    topic: string;
    tags: string[];
    keyPoints: string[];
    codeExamples?: {
      language: string;
      code: string;
    }[];
    resources?: string[];
  }[];
}

export class ConversationService {
  private readonly API_ENDPOINT = '/conversations';

  async saveConversation(data: {
    items: ItemType[];
    memoryKv: { [key: string]: any };
    notes: any[];
  }): Promise<string> {
    try {
      // Extract the last exchange from items
      const lastUserItem = [...data.items].reverse().find(item => item.role === 'user');
      const lastAssistantItem = [...data.items].reverse().find(item => item.role === 'assistant');

      // Extract key points from assistant messages
      const keyPoints = data.items
        .filter(item => item.role === 'assistant')
        .map(item => item.formatted.text || '')
        .filter(text => text.includes('Key point:') || text.includes('Important:'))
        .map(text => text.replace(/^(Key point:|Important:)\s*/i, '').trim());

      const conversationData = {
        title: `Conversation from ${new Date().toLocaleDateString()}`,
        lastExchange: {
          userMessage: lastUserItem?.formatted?.text || '',
          assistantMessage: lastAssistantItem?.formatted?.text || ''
        },
        keyPoints,
        notes: data.notes.map(note => ({
          ...note,
          timestamp: new Date()
        }))
      };

      const response = await axiosInstance.post<{ id: string }>(this.API_ENDPOINT, conversationData);
      return response.data.id;
    } catch (error) {
      console.error('Failed to save conversation:', error);
      throw new Error('Failed to save conversation');
    }
  }

  async getConversationById(id: string): Promise<SavedConversation | null> {
    try {
      const response = await axiosInstance.get<SavedConversation>(`${this.API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to load conversation:', error);
      return null;
    }
  }

  async getAllConversations(): Promise<SavedConversation[]> {
    try {
      const response = await axiosInstance.get<SavedConversation[]>(this.API_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Failed to get conversations:', error);
      return [];
    }
  }

  async deleteConversation(id: string): Promise<boolean> {
    try {
      await axiosInstance.delete(`${this.API_ENDPOINT}/${id}`);
      return true;
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      return false;
    }
  }

  async searchConversations(params: {
    query?: string;
    filter?: 'topic' | 'tags' | 'content' | 'all';
    timeframe?: 'today' | 'week' | 'month' | 'all';
  }): Promise<SavedConversation[]> {
    try {
      const response = await axiosInstance.get<SavedConversation[]>(`${this.API_ENDPOINT}/search`, {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search conversations:', error);
      return [];
    }
  }

  async getRecentConversations(limit: number = 5): Promise<SavedConversation[]> {
    try {
      const response = await axiosInstance.get<SavedConversation[]>(`${this.API_ENDPOINT}`, {
        params: {
          limit,
          sort: 'timestamp',
          order: 'desc'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get recent conversations:', error);
      return [];
    }
  }

  async searchByTopic(topic: string): Promise<SavedConversation[]> {
    try {
      const response = await axiosInstance.get<SavedConversation[]>(`${this.API_ENDPOINT}/search`, {
        params: {
          query: topic,
          filter: 'topic'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to search conversations by topic:', error);
      return [];
    }
  }
}

export const conversationService = new ConversationService();
