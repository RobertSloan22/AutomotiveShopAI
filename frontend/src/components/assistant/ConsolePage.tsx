/// <reference types="vite/client" />

import React from 'react';
import { useEffect, useRef, useCallback, useState } from 'react';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client.js';
import { WavRecorder, WavStreamPlayer } from './lib/wavtools/index.js';
import { instructions } from './utils/conversation_config.js';
import { WavRenderer } from './utils/wav_renderer';
import { X, Edit, Zap, ArrowUp, ArrowDown, Search } from 'react-feather';
import { Button } from '../components/button/Button';
import { Toggle } from '../components/toggle/Toggle';
import { EngineDiagram } from '../components/EngineDiagram/EngineDiagram';
import './ConsolePage.scss';
import { carmdService } from './services/carmd';
import axiosInstance from '../../utils/axiosConfig.js';
import { CustomerDataTool } from './services/CustomerDataTool';
import { Notes } from './components/notes/Notes';
import { ConversationService } from './services/ConversationService';
import { DiagramViewer } from './components/DiagramViewer';
import { GoogleSearchService } from './services/CustomGoogleSearch';
import { ImageSearchModal } from './ImageSearchModal';




// Add interfaces after imports
interface ImportMetaEnv {
  VITE_OPENAI_API_KEY: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface NoteEntry {
  id?: string;
  timestamp: string;
  topic: string;
  tags: string[];
  keyPoints: string[];
  codeExamples?: {
    language: string;
    code: string;
  }[];
  resources?: string[];
}
const LOCAL_RELAY_SERVER_URL: string = '';
const OPENAI_API_KEY: string = '';
console.log('API Key present:', !!OPENAI_API_KEY);
/**
 * Type for result from get_weather() function call
 */
interface Coordinates {
  lat: number;
  lng: number;
  location?: string;
  temperature?: {
    value: number;
    units: string;
  };
  wind_speed?: {
    value: number;
    units: string;
  };
}

/**
 * Type for all event logs
 */
interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

interface RepairEntry {
  timestamp: string;
  repair_type: string;
  description: string;
  mileage?: number;
}

interface RepairHistoryParams {
  vehicle_id: string;
  repair_type: string;
  description: string;
  mileage?: number;
}

interface GetRepairHistoryParams {
  vehicle_id: string;
}

interface DiagramAnnotation {
  x: number;
  y: number;
  text: string;
}

interface ShowComponentDiagramParams {
  component_id: string;
  annotations?: DiagramAnnotation[];
}

interface DiagramSearchParams {
  search_query: string;
  type: 'repair' | 'parts' | 'wiring' | 'system';
  year?: string;
  make?: string;
  model?: string;
}

// Add this interface near the top with other interfaces
interface InputTextContentType {
  type: 'input_text';
  text: string;
  metadata?: {
    is_context: boolean;
    note_id: string;
    timestamp?: string;
  };
}

// Add this interface with your other interfaces
interface CustomerEntry {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

// Add this helper function near the top of the file, after the interfaces
const formatCustomerResponse = (data: any) => {
  try {
    // If it's an array of customers
    if (Array.isArray(data)) {
      return data.map(customer => ({
        id: customer._id,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email || 'N/A',
        phone: customer.phoneNumber || 'N/A'
      }));
    }
    
    // If it's a single customer object
    return {
      id: data._id,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email || 'N/A',
      phone: data.phoneNumber || 'N/A'
    };
  } catch (error) {
    console.error('Error formatting customer response:', error);
    throw new Error('Failed to format customer data');
  }
};

interface CustomerCreateParams {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  notes?: string;
}

// Add this interface near your other interfaces
interface ImageSearchResult {
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  source: string;
  link: string;
}

export function ConsolePage() {
  /**
   * Instantiate:
   * - WavRecorder (speech input)
   * - WavStreamPlayer (speech output)
   * - RealtimeClient (API client)
   */
  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ 
      sampleRate: 24000
    })
  );
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );
  const clientRef = useRef<RealtimeClient>(
    new RealtimeClient({
      url: LOCAL_RELAY_SERVER_URL,
      dangerouslyAllowAPIKeyInBrowser: true
    })
  );

  /**
   * References for
   * - Rendering audio visualization (canvas)
   * - Autoscrolling event logs
   * - Timing delta for event log displays
   */
  const clientCanvasRef = useRef<HTMLCanvasElement>(null);
  const serverCanvasRef = useRef<HTMLCanvasElement>(null);
  const eventsScrollHeightRef = useRef(0);
  const eventsScrollRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<string>(new Date().toISOString());

  /**
   * All of our variables for displaying application state
   * - items are all conversation items (dialog)
   * - realtimeEvents are event logs, which can be expanded
   * - memoryKv is for set_memory() function
   * - coords, marker are for get_weather() function
   */
  const [items, setItems] = useState<ItemType[]>([]);
  const [realtimeEvents, setRealtimeEvents] = useState<RealtimeEvent[]>([]);
  const [expandedEvents, setExpandedEvents] = useState<{
    [key: string]: boolean;
  }>({});
  const [isConnected, setIsConnected] = useState(false);
  const [canPushToTalk, setCanPushToTalk] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [memoryKv, setMemoryKv] = useState<{ [key: string]: RepairEntry[] }>({});
  const [coords, setCoords] = useState<Coordinates | null>({
    lat: 37.775593,
    lng: -122.418137,
  });
  const [marker, setMarker] = useState<Coordinates | null>(null);

  const [activeDiagram, setActiveDiagram] = useState<string>('engine_overview');
  const [diagramAnnotations, setDiagramAnnotations] = useState<DiagramAnnotation[]>([]);

  const [diagramUrl, setDiagramUrl] = useState<string | undefined>(undefined);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  // Create a ref to hold the disconnect function
  const disconnectRef = useRef<(() => Promise<void>) | null>(null);

  // Add state for notes array
  const [notes, setNotes] = useState<NoteEntry[]>([]);

  // Add state for modal
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  // Add state for notes visibility
  const [isNotesVisible, setIsNotesVisible] = useState(false);

  // Add this state near other useState declarations
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  // Add this state near other useState declarations
  const [activeContextId, setActiveContextId] = useState<string | null>(null);

  // Add state for customer data
  const [customers, setCustomers] = useState<CustomerEntry[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const conversationServiceRef = useRef(new ConversationService());
  const customerDataToolRef = useRef(new CustomerDataTool());

  const [apiLogs, setApiLogs] = useState<Array<{
    timestamp: string;
    type: string;
    data: any;
  }>>([]);

  // Add/update these state variables near your other useState declarations
  const [selectedDiagram, setSelectedDiagram] = useState<{
    url: string;
    title: string;
    thumbnail?: string;
    sourceUrl?: string;
    fileType: string;
  } | null>(null);

  // Add this state near your other useEffect hooks
  useEffect(() => {
    if (isNotesModalOpen) {
      loadNotes();
    }
  }, [isNotesModalOpen]);

  /**
   * Utility for formatting the timing of logs
   */
  const formatTime = useCallback((timestamp: string) => {
    const startTime = startTimeRef.current;
    const t0 = new Date(startTime).valueOf();
    const t1 = new Date(timestamp).valueOf();
    const delta = t1 - t0;
    const hs = Math.floor(delta / 10) % 100;
    const s = Math.floor(delta / 1000) % 60;
    const m = Math.floor(delta / 60_000) % 60;
    const pad = (n: number) => {
      let s = n + '';
      while (s.length < 2) {
        s = '0' + s;
      }
      return s;
    };
    return `${pad(m)}:${pad(s)}.${pad(hs)}`;
  }, []);

  /**
   * Disconnect and reset conversation state
   */
  const disconnectConversation = useCallback(async () => {
    try {
      setIsConnected(false);
      setIsRecording(false);
      setRealtimeEvents([]);
      setItems([]);
      setMemoryKv({});
      setCoords({
        lat: 37.775593,
        lng: -122.418137,
      });
      setMarker(null);

      const client = clientRef.current;
      const wavRecorder = wavRecorderRef.current;
      const wavStreamPlayer = wavStreamPlayerRef.current;

      if (client) {
        client.disconnect();
      }

      if (wavRecorder && wavRecorder.getStatus() !== 'ended') {
        await wavRecorder.end().catch(console.error);
      }

      if (wavStreamPlayer) {
        await wavStreamPlayer.interrupt();
      }
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
  }, []); // Empty dependency array

  // Store the disconnect function in the ref
  useEffect(() => {
    disconnectRef.current = disconnectConversation;
  }, [disconnectConversation]);

  /**
   * Connect to conversation
   */
  const connectConversation = useCallback(async () => {
    try {
      const client = clientRef.current;
      if (!OPENAI_API_KEY && !LOCAL_RELAY_SERVER_URL) {
        throw new Error('No API key or relay server URL provided');
      }

      console.log('Attempting connection...');

      // Initialize audio components with additional error handling
      try {
        await wavRecorderRef.current.begin();
        await wavStreamPlayerRef.current.connect();
      } catch (error: any) {
        console.error('Audio initialization failed:', error);
        if (error.message.includes('audioWorklet')) {
          throw new Error('AudioWorklet initialization failed. Please check your browser settings and reload the page.');
        }
        throw new Error('Failed to initialize audio components. Please check browser permissions.');
      }

      // Connect to API
      await client.connect();
      console.log('Connected successfully');

      // Update state
      startTimeRef.current = new Date().toISOString();
      setIsConnected(true);
      setRealtimeEvents([]);
      setItems(client.conversation.getItems());

      // Send initial message
      client.sendUserMessageContent([
        { type: 'input_text', text: 'Hello!' }
      ]);

      // Start VAD if needed
      if (client.getTurnDetectionType() === 'server_vad') {
        await wavRecorderRef.current.record((data) => client.appendInputAudio(data.mono));
      }
    } catch (error) {
      console.error('Connection failed:', error);
      // Use the ref to call disconnect
      if (disconnectRef.current) {
        await disconnectRef.current();
      }
      throw error;
    }
  }, []); // Empty dependency array since we're using refs

  const deleteConversationItem = useCallback(async (id: string) => {
    const client = clientRef.current;
    client.deleteItem(id);
  }, []);

  /**
   * In push-to-talk mode, start recording
   * .appendInputAudio() for each sample
   */
  const startRecording = useCallback(async () => {
    try {
      setIsRecording(true);
      const client = clientRef.current;
      const wavRecorder = wavRecorderRef.current;
      const wavStreamPlayer = wavStreamPlayerRef.current;

      // Ensure recorder is initialized
      if (wavRecorder.getStatus() === 'ended') {
        await wavRecorder.begin();
      }

      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
      
      await wavRecorder.record((data) => client.appendInputAudio(data.mono));
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
      // Optionally show error to user
    }
  }, []);

  /**
   * In push-to-talk mode, stop recording
   */
  const stopRecording = useCallback(async () => {
    try {
      const client = clientRef.current;
      const wavRecorder = wavRecorderRef.current;
      
      if (wavRecorder.getStatus() === 'recording') {
        await wavRecorder.pause();
      }
      
      setIsRecording(false);
      client.createResponse();
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
      // Optionally show error to user
    }
  }, []);
/*
Notes from conversation tool
*/ 
useEffect(() => {
  const wavStreamPlayer = wavStreamPlayerRef.current;
  const client = clientRef.current;

  client.updateSession({ instructions });
  client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });

  // Add note-taking tool
  client.addTool(
    {
      name: 'save_note',
      description: 'Saves important discussion points and code examples as a note.',
      parameters: {
        type: 'object',
        properties: {
          topic: {
            type: 'string',
            description: 'Main topic of the note',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Relevant tags for categorizing the note',
          },
          keyPoints: {
            type: 'array',
            items: { type: 'string' },
            description: 'Key points discussed',
          },
          codeExamples: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: { type: 'string' },
                code: { type: 'string' },
              },
            },
            description: 'Code examples discussed',
          },
          resources: {
            type: 'array',
            items: { type: 'string' },
            description: 'Relevant documentation or resource links',
          },
        },
        required: ['topic', 'tags', 'keyPoints'],
      },
    },
    async (params: {
      topic: string;
      tags: string[];
      keyPoints: string[];
      codeExamples?: { language: string; code: string; }[];
      resources?: string[];
    }) => {
      const note = {
        timestamp: new Date().toISOString(),
        ...params,
      };
      saveNote(note);
      return { status: 'saved', noteId: notes.length };
    }
  );
}, []); // Add empty dependency array

// Add this near your other useEffect hooks
useEffect(() => {
  const wavStreamPlayer = wavStreamPlayerRef.current;
  const client = clientRef.current;

  client.updateSession({ instructions });
  client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });

  // Add customer data tool
  client.addTool(
    {
      name: 'customer_data',
      description: 'Access and manage customer information. Can search, view details, and create new customers.',
      parameters: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['search', 'details', 'vehicles', 'history', 'create'],
            description: 'Action to perform (search/details/vehicles/history/create)'
          },
          params: {
            type: 'object',
            properties: {
              searchTerm: { type: 'string' },
              customerId: { type: 'string' },
              firstName: { 
                type: 'string',
                description: 'Customer\'s first name'
              },
              lastName: { 
                type: 'string',
                description: 'Customer\'s last name'
              },
              email: { 
                type: 'string',
                description: 'Customer\'s email address'
              },
              phoneNumber: { 
                type: 'string',
                description: 'Customer\'s phone number'
              },
              notes: { 
                type: 'string',
                description: 'Additional notes about the customer'
              }
            }
          }
        },
        required: ['action', 'params']
      }
    },
    async ({ action, params }: { action: string, params: any }) => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        type: `Customer Data Tool - ${action}`,
        data: { params }
      };
      
      setApiLogs(prev => [...prev, logEntry]);
      
      try {
        switch (action) {
          case 'search':
            const searchResponse = await axiosInstance.get('/customers/search', {
              params: { term: params.searchTerm }
            });
            
            setApiLogs(prev => [...prev, {
              timestamp: new Date().toISOString(),
              type: 'Search Response',
              data: searchResponse.data
            }]);
            
            return formatCustomerResponse(searchResponse.data);
            
          case 'details':
            console.log('📝 Fetching details for customer:', params.customerId);
            const detailsResponse = await axiosInstance.get(`/customers/${params.customerId}`);
            console.log('👤 Customer Details Response:', detailsResponse.data);
            return formatCustomerResponse(detailsResponse.data);
            
          case 'create':
            console.log('📝 Starting customer creation process');
            try {
              // Validate required fields
              if (!params.firstName || !params.lastName) {
                throw new Error('First name and last name are required');
              }

              // Format the request body
              const customerData = {
                customerData: {
                  firstName: params.firstName,
                  lastName: params.lastName,
                  email: params.email || '',
                  phoneNumber: params.phoneNumber || '',
                  address: params.address || '',
                  city: params.city || '',
                  zipCode: params.zipCode || '',
                  notes: params.notes || ''
                },
                vehicleData: {}
              };

              console.log('📦 Formatted request data:', customerData);

              const createResponse = await axiosInstance.post('/customers', customerData);
              console.log('✅ Customer creation successful:', createResponse.data);
              
              // Format the response
              const formattedResponse = formatCustomerResponse(createResponse.data.customer || createResponse.data);
              
              return {
                status: 'success',
                message: 'Customer created successfully',
                customer: formattedResponse
              };

            } catch (error: any) {
              console.error('❌ Customer creation error:', {
                error,
                params,
                message: error.message
              });
              
              return {
                status: 'error',
                message: error.response?.data?.error || 'Failed to create customer',
                details: error.message
              };
            }
          default:
            console.warn('⚠️ Unhandled action type:', action);
            return {
              status: 'error',
              message: `Unhandled action type: ${action}`
            };
        }
      } catch (error) {
        setApiLogs(prev => [...prev, {
          timestamp: new Date().toISOString(),
          type: 'Error',
          data: error instanceof Error ? error.message : 'Unknown error'
        }]);
        throw error;
      }
    }
  );
}, []); // Empty dependency array since we're using refs

// write the function for creating a new customer through the realtime api




// Add customer data loading function
const loadCustomerData = async () => {
  try {
    const response = await axiosInstance.get('/customers/all');
    console.log('📚 Customers from DB:', response.data);
    
    const parsedCustomers = response.data.map((customer: any) => {
      try {
        return {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
        };
      } catch (e) {
        console.error('Failed to parse customer:', e, customer);
        return null;
      }
    }).filter(Boolean);

    console.log('📝 Parsed customers:', parsedCustomers);
    setCustomers(parsedCustomers);
  } catch (error) {
    console.error('❌ Failed to load customers:', error);
  }
};

// Load customer data on component mount
useEffect(() => {
  loadCustomerData();
}, []);

  /**
   * Switch between Manual <> VAD mode for communication
   */
  const changeTurnEndType = useCallback(async (value: string) => {
    try {
      const client = clientRef.current;
      const wavRecorder = wavRecorderRef.current;

      // Stop any ongoing recording
      if (wavRecorder.getStatus() === 'recording') {
        await wavRecorder.pause();
      }

      // If recorder is not initialized, initialize it
      if (wavRecorder.getStatus() === 'ended') {
        await wavRecorder.begin();
      }

      client.updateSession({
        turn_detection: value === 'none' ? null : { type: 'server_vad' },
      });

      if (value === 'server_vad' && client.isConnected()) {
        await wavRecorder.record((data) => client.appendInputAudio(data.mono));
      }

      setCanPushToTalk(value === 'none');
    } catch (error) {
      console.error('Failed to change turn end type:', error);
      setCanPushToTalk(true); // Reset to manual mode on error
      // Optionally show error to user
    }
  }, []);

  /**
   * Auto-scroll the event logs
   */ 
  useEffect(() => {
    if (eventsScrollRef.current) {
      const eventsEl = eventsScrollRef.current;
      const scrollHeight = eventsEl.scrollHeight;
      // Only scroll if height has just changed
      if (scrollHeight !== eventsScrollHeightRef.current) {
        eventsEl.scrollTop = scrollHeight;
        eventsScrollHeightRef.current = scrollHeight;
      }
    }
  }, [realtimeEvents]);

  /**
   * Auto-scroll the conversation logs
   */
  useEffect(() => {
    const conversationEls = [].slice.call(
      document.body.querySelectorAll('[data-conversation-content]')
    );
    for (const el of conversationEls) {
      const conversationEl = el as HTMLDivElement;
      conversationEl.scrollTop = conversationEl.scrollHeight;
    }
  }, [items]);

  /**
   * Set up render loops for the visualization canvas
   */
  useEffect(() => {
    let isLoaded = true;

    const wavRecorder = wavRecorderRef.current;
    const clientCanvas = clientCanvasRef.current;
    let clientCtx: CanvasRenderingContext2D | null = null;

    const wavStreamPlayer = wavStreamPlayerRef.current;
    const serverCanvas = serverCanvasRef.current;
    let serverCtx: CanvasRenderingContext2D | null = null;

    const render = () => {
      if (isLoaded) {
        if (clientCanvas) {
          clientCanvas.width = clientCanvas.offsetWidth;
          clientCanvas.height = clientCanvas.offsetHeight;
          clientCtx = clientCtx || clientCanvas.getContext('2d');
          if (clientCtx) {
            clientCtx.clearRect(0, 0, clientCanvas.width, clientCanvas.height);
            const result = wavRecorder.recording
              ? wavRecorder.getFrequencies('voice')
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              clientCanvas,
              clientCtx,
              result.values,
              '#0099ff',
              20,
              0,
              8
            );
          }
        }
        if (serverCanvas) {
          serverCanvas.width = serverCanvas.offsetWidth;
          serverCanvas.height = serverCanvas.offsetHeight;
          serverCtx = serverCtx || serverCanvas.getContext('2d');
          if (serverCtx) {
            serverCtx.clearRect(0, 0, serverCanvas.width, serverCanvas.height);
            const result = wavStreamPlayer.analyser
              ? wavStreamPlayer.getFrequencies('voice')
              : { values: new Float32Array([0]) };
            WavRenderer.drawBars(
              serverCanvas,
              serverCtx,
              result.values,
              '#009900',
              20,
              0,
              8
            );
          }
        }
        window.requestAnimationFrame(render);
      }
    };
    render();

    return () => {
      isLoaded = false;
    };
  }, []);

  /**
   * Core RealtimeClient and audio capture setup
   * Set all of our instructions, tools, events and more
   */
  useEffect(() => {
    // Get refs
    const wavStreamPlayer = wavStreamPlayerRef.current;
    const client = clientRef.current;

    // Set instructions
    client.updateSession({ 
      instructions: instructions + `
You can access the conversation database using these tools:
- search_conversation_history: Search for specific topics or content
- get_conversation_details: Get full details of a specific conversation
- get_recent_conversations: List recent conversations
- get_notes: Get notes from the conversation database
- set_memory: Save important data about the user into memory
- log_repair_history: Record repair and maintenance history for a vehicle
- get_repair_history: Retrieve repair history for a specific vehicle
- search_automotive_diagram: Search and display relevant automotive diagrams
- get_customers: Get a list of customers from the database

When users ask about previous conversations, use these tools to:
1. Search for relevant conversations
2. Get specific details when needed
3. Reference and summarize previous discussions
4. Help users find specific information from past conversations
5. Get customer details when needed

Example queries you can handle:
- "What did we discuss about React hooks last week?"
- "Show me recent conversations about databases"
- "Find conversations mentioning API security"
- "how many customers do we have?"
- "what did we discuss about customer X last month?"
`
    });
    // Set transcription, otherwise we don't get user transcriptions back.
    client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });

    // Add tools
    client.addTool(
      {
        name: 'set_memory',
        description: 'Saves important data about the user into memory.',
        parameters: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description:
                'The key of the memory value. Always use lowercase and underscores, no other characters.',
            },
            value: {
              type: 'string',
              description: 'Value can be anything represented as a string',
            },
          },
          required: ['key', 'value'],
        },
      },
      async ({ key, value }: { [key: string]: any }) => {
        setMemoryKv((memoryKv) => {
          const newKv = { ...memoryKv };
          newKv[key] = value;
          return newKv;
        });
        return { ok: true };
      }
    );
    client.addTool(
      {
        name: 'log_repair_history',
        description: 'Records repair and maintenance history for a vehicle',
        parameters: {
          type: 'object',
          properties: {
            vehicle_id: {
              type: 'string',
              description: 'Vehicle identifier (VIN or custom ID)',
            },
            repair_type: {
              type: 'string',
              description: 'Type of repair or maintenance performed',
            },
            description: {
              type: 'string',
              description: 'Detailed description of work performed',
            },
            mileage: {
              type: 'number',
              description: 'Vehicle mileage at time of repair',
            }
          },
          required: ['vehicle_id', 'repair_type', 'description'],
        },
      },
      async ({ vehicle_id, repair_type, description, mileage }: RepairHistoryParams) => {
        setMemoryKv((prevState) => {
          const newState = { ...prevState };
          if (!newState[vehicle_id]) {
            newState[vehicle_id] = [];
          }
          newState[vehicle_id].push({
            timestamp: new Date().toISOString(),
            repair_type,
            description,
            mileage,
          });
          return newState;
        });
        return { status: 'recorded' };
      }
    );
    client.addTool(
      {
        name: 'get_repair_history',
        description: 'Retrieves repair history for a specific vehicle',
        parameters: {
          type: 'object',
          properties: {
            vehicle_id: {
              type: 'string',
              description: 'Vehicle identifier (VIN or custom ID)',
            },
          },
          required: ['vehicle_id'],
        },
      },
      async ({ vehicle_id }: GetRepairHistoryParams) => {
        return memoryKv[vehicle_id] || [];
        
      }
    );
    
    // Add CarMD diagnostic tool
    client.addTool(
      {
        name: 'get_diagnostic_info',
        description: 'Get diagnostic information for a specific vehicle and trouble code',
        parameters: {
          type: 'object',
          properties: {
            vin: {
              type: 'string',
              description: 'Vehicle Identification Number',
            },
            code: {
              type: 'string',
              description: 'Diagnostic Trouble Code (e.g., P0123)',
            },
          },
          required: ['vin', 'code'],
        },
      },
      async ({ vin, code }: { vin: string; code: string }) => {
        try {
          const diagnosticInfo = await carmdService.getDiagnostics(vin, code);
          return {
            status: 'success',
            info: diagnosticInfo,
          };
        } catch (error) {
          console.error('CarMD API error:', error);
          return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to get diagnostic information',
          };
        }
      }
    );

    // Add maintenance schedule tool
    client.addTool(
      {
        name: 'get_maintenance_schedule',
        description: 'Get maintenance schedule for a specific vehicle and mileage',
        parameters: {
          type: 'object',
          properties: {
            vin: {
              type: 'string',
              description: 'Vehicle Identification Number',
            },
            mileage: {
              type: 'number',
              description: 'Current vehicle mileage',
            },
          },
          required: ['vin', 'mileage'],
        },
      },
      async ({ vin, mileage }: { vin: string; mileage: number }) => {
        try {
          const maintenanceInfo = await carmdService.getMaintenanceSchedule(vin, mileage);
          return {
            status: 'success',
            schedule: maintenanceInfo,
          };
        } catch (error) {
          console.error('CarMD API error:', error);
          return {
            status: 'error',
            message: error instanceof Error ? error.message : 'Failed to get maintenance schedule',
          };
        }
      }
    );
    client.addTool(
      {
        name: 'search_notes',
        description: 'Search through saved notes by topic, tags, or content',
        parameters: {
          type: 'object',
          properties: {
            query: { 
              type: 'string', 
              description: 'Search term to find in notes' 
            },
            filter: { 
              type: 'string',
              enum: ['topic', 'tags', 'content', 'all'],
              description: 'Type of search to perform'
            }
          },
          required: ['query']
        }
      },
      async ({ query, filter = 'all' }: { query: string; filter?: 'topic' | 'tags' | 'content' | 'all' }) => {
        try {
          const response = await axiosInstance.get('/notes/search', {
            params: { query, filter }
          });
          return { status: 'success', results: response.data };
        } catch (error) {
          console.error('Failed to search notes:', error);
          return { status: 'error', message: 'Failed to search notes' };
        }
      }
    );
    
    client.addTool(
      {
        name: 'get_recent_notes',
        description: 'Get a list of recent notes',
        parameters: {
          type: 'object',
          properties: {
            limit: { 
              type: 'number', 
              description: 'Number of notes to retrieve (default: 10)' 
            }
          }
        }
      },
      async ({ limit = 10 }) => {
        try {
          const response = await axiosInstance.get('/notes/recent', {
            params: { limit }
          });
          return { status: 'success', notes: response.data };
        } catch (error) {
          console.error('Failed to get recent notes:', error);
          return { status: 'error', message: 'Failed to retrieve recent notes' };
        }
      }
    );
    // Inside useEffect where tools are added


  // Add the Serper search tool
  client.addTool(
    {
      name: 'search_images',
      description: 'Search for images and diagrams using Serper API',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query for images or diagrams'
          },
          type: {
            type: 'string',
            enum: ['diagram', 'part', 'repair'],
            description: 'Type of image to search for'
          }
        },
        required: ['query']
      }
    },
    async ({ query, type = 'diagram' }: { query: string; type?: string }) => {
      try {
        setApiLogs(prev => [...prev, {
          timestamp: new Date().toISOString(),
          type: 'Serper Image Search Request',
          data: { query, type }
        }]);

        const response = await axiosInstance.post('/serper/images', {
          query: `${query} ${type}`,
          num: 5
        });

        if (response.data.images?.length > 0) {
          setSearchResults(response.data.images);
          setSelectedDiagram({
            url: response.data.images[0].link,
            title: response.data.images[0].title,
            thumbnail: response.data.images[0].thumbnail,
            sourceUrl: response.data.images[0].source,
            fileType: 'image'
          });
        }

        setApiLogs(prev => [...prev, {
          timestamp: new Date().toISOString(),
          type: 'Serper Image Search Response',
          data: response.data
        }]);

        return {
          status: 'success',
          results: response.data.images || [],
          count: response.data.images?.length || 0
        };
      } catch (error) {
        console.error('Serper image search error:', error);
        setApiLogs(prev => [...prev, {
          timestamp: new Date().toISOString(),
          type: 'Serper Image Search Error',
          data: error instanceof Error ? error.message : 'Unknown error'
        }]);

        return {
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to search for images'
        };
      }
    }
  );

  // ... rest of your useEffect
// Add any necessary dependencies

    // handle realtime events from client + server for event logging
    client.on('realtime.event', (realtimeEvent: RealtimeEvent) => {
      setRealtimeEvents((realtimeEvents) => {
        const lastEvent = realtimeEvents[realtimeEvents.length - 1];
        if (lastEvent?.event.type === realtimeEvent.event.type) {
          // if we receive multiple events in a row, aggregate them for display purposes
          lastEvent.count = (lastEvent.count || 0) + 1;
          return realtimeEvents.slice(0, -1).concat(lastEvent);
        } else {
          return realtimeEvents.concat(realtimeEvent);
        }
      });
    });
    client.on('error', (event: any) => console.error(event));
    client.on('conversation.interrupted', async () => {
      try {
        await wavStreamPlayer.interrupt();
      } catch (error) {
        console.error('Failed to interrupt audio playback:', error);
      }
    });
    client.on('conversation.updated', async ({ item, delta }: any) => {
      const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      setItems(items);
    });

    setItems(client.conversation.getItems());

    return () => {
      // cleanup; resets to defaults
      client.reset();
    };
  }, []);

  useEffect(() => {    // Core RealtimeClient and audio capture setup
    const cleanup = async () => {
      if (disconnectRef.current) {
        await disconnectRef.current();
      }
    };

    return () => {
      cleanup().catch(console.error);    };
  }, []);

  // Modify the saveNote function
  const saveNote = async (note: NoteEntry) => {
    try {
      const formattedNote = {
        content: {
          timestamp: new Date().toISOString(),
          topic: note.topic,
          tags: note.tags || [],
          keyPoints: note.keyPoints || [],
          codeExamples: note.codeExamples || [],
          resources: note.resources || []
        }
      };

      console.log('📤 Sending note to server:', JSON.stringify(formattedNote, null, 2));

      const response = await axiosInstance.post('/notes', formattedNote);
      console.log('📥 Server response:', JSON.stringify(response.data, null, 2));
      
      setNotes(prev => [...prev, formattedNote.content as NoteEntry]);
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to save note:', error);
      if ('response' in error) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  };

  // Update the loadNotes function
  const loadNotes = async () => {
    try {
      const response = await axiosInstance.get('/notes');
      console.log('📚 Raw notes from DB:', response.data);
      
      // Parse the notes properly based on the DB structure
      const parsedNotes = response.data.map((note: any) => {
        try {
          // If content is a string, parse it, otherwise use it directly
          const content = typeof note.content === 'string' 
            ? JSON.parse(note.content) 
            : note.content;
            
          return {
            id: note._id,
            timestamp: content.timestamp || note.timestamp,
            topic: content.topic,
            tags: content.tags || [],
            keyPoints: content.keyPoints || [],
            codeExamples: content.codeExamples || [],
            resources: content.resources || []
          };
        } catch (e) {
          console.error('Failed to parse note:', e, note);
          return null;
        }
      }).filter(Boolean);

      console.log('📝 Parsed notes:', parsedNotes);
      setNotes(parsedNotes);
    } catch (error) {
      console.error('❌ Failed to load notes:', error);
    }
  };

  // Add useEffect to load notes on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  // Add export function
  const exportNotes = () => {
    const dataStr = JSON.stringify(notes, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `notes-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    linkElement.remove();
  };

  // Update loadNoteContext function
  const loadNoteContext = useCallback(async (noteId: string) => {
    const selectedNote = notes.find(note => (note.id || note.timestamp) === noteId);
    if (!selectedNote || !clientRef.current) return;

    setActiveContextId(noteId); // Set active context
    const contextMessage = `Previous conversation context:
Topic: ${selectedNote.topic}
Key Points:
${selectedNote.keyPoints.join('\n')}`;

    // Send context to the API
    clientRef.current.sendUserMessageContent([
      { 
        type: 'input_text', 
        text: contextMessage,
        metadata: {
          is_context: true,
          note_id: noteId,
          timestamp: selectedNote.timestamp
        }
      }
    ]);
  }, [notes]);

  // Add this near other useEffect hooks
  useEffect(() => {
    loadNotes();
  }, []);

  // Add this callback near other useCallback definitions
  const updateClientInstructions = useCallback(() => {
    const client = clientRef.current;
    if (!client) return;

    const notesContext = notes.length > 0 
      ? `You have access to ${notes.length} saved notes about various topics.` 
      : 'No saved notes yet.';

    client.updateSession({ 
      instructions: `${instructions}
      
      ${notesContext}
      
      You can:
      - Reference existing notes using the search_notes tool
      - Save new notes using the save_note tool
      - Get recent notes using the get_recent_notes tool
      
      When discussing topics that have related notes, proactively mention and reference them.`
    });
  }, [notes]);

  // Add this effect after the updateClientInstructions callback
  useEffect(() => {
    updateClientInstructions();
  }, [notes, updateClientInstructions]);


  // load customers
  const loadCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customers/all');
      
      const parsedCustomers = (response.data || [])
        .filter((customer: any) => customer && typeof customer === 'object')
        .map((customer: any) => ({
          _id: customer._id || '',
          firstName: customer.firstName || '',
          lastName: customer.lastName || '',
          email: customer.email || '',
          phoneNumber: customer.phoneNumber || ''
        }));

      setCustomers(parsedCustomers);
    } catch (error) {
      console.error('Failed to load customers:', error);
    }
  };

  // Add this effect to load customers on component mount
  useEffect(() => {
    loadCustomers();
  }, []);

  const updateCustomerContext = useCallback(() => {
    const client = clientRef.current;
    if (!client) return;

    const customersContext = customers.length > 0 
      ? `You have access to ${customers.length} customers. Use the customer_data tool to:
         - Search customers with 'search' action
         - Get customer details with 'details' action
         - Get customer vehicles with 'vehicles' action
         - Get service history with 'history' action` 
      : 'No customers available yet.';

    client.updateSession({ 
      instructions: `${instructions}
      
      ${customersContext}
      
      Available customer_data tool actions:
      - search: Find customers by name or email
      - details: Get detailed information about a specific customer
      - vehicles: Get vehicles owned by a customer
      - history: Get service history for a customer`
    });
  }, [customers, instructions]);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    updateCustomerContext();
  }, [customers, updateCustomerContext]);

  const [searchResults, setSearchResults] = useState<ImageSearchResult[]>([]);

  /**
   * Render the application
   */
  return (
    <div data-component="ConsolePage">
  
      <div className="content-main h-[15vh]">
        <div className="content-logs">
          <div className="content-block eventsh-[10vh]">
            <div className="visualization h-[10vh]">
              <div className="visualization-entry client" style={{ width: '80vw' }}>
                <canvas ref={clientCanvasRef} />
              </div>
              <div className="visualization-entry server" style={{ width: '80vw' }}>
                <canvas ref={serverCanvasRef} />
              </div>
            </div>
            <div className="content-block-title">events</div>
            <div className="content-block-body h-[15vh]" style={{ width: '60vw' }} ref={eventsScrollRef}>
              {!realtimeEvents.length && `awaiting connection...`}
              {realtimeEvents.slice(-5).map((realtimeEvent, i) => {
                const count = realtimeEvent.count;
                const event = { ...realtimeEvent.event };
                if (event.type === 'input_audio_buffer.append') {
                  event.audio = `[trimmed: ${event.audio.length} bytes]`;
                } else if (event.type === 'response.audio.delta') {
                  event.delta = `[trimmed: ${event.delta.length} bytes]`;
                }
                return (
                  <div 
                    className="event" 
                    key={event.event_id || `event-${i}-${realtimeEvent.time}`}
                  >
                    <div className="event-timestamp">
                      {formatTime(realtimeEvent.time)}
                    </div>
                    <div className="event-details">
                      <div
                        className="event-summary"
                        onClick={() => {
                          // toggle event details
                          const id = event.event_id;
                          const expanded = { ...expandedEvents };
                          if (expanded[id]) {
                            delete expanded[id];
                          } else {
                            expanded[id] = true;
                          }
                          setExpandedEvents(expanded);
                        }}
                      >
                        <div
                          className={`event-source ${
                            event.type === 'error'
                              ? 'error'
                              : realtimeEvent.source
                          }`}
                        >
                          {realtimeEvent.source === 'client' ? (
                            <ArrowUp />
                          ) : (
                            <ArrowDown />
                          )}
                          <span>
                            {event.type === 'error'
                              ? 'error!'
                              : realtimeEvent.source}
                          </span>
                        </div>
                        <div className="event-type">
                          {event.type}
                          {count && ` (${count})`}
                        </div>
                      </div>
                      {!!expandedEvents[event.event_id] && (
                        <div className="event-payload">
                          {JSON.stringify(event, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="content-block conversation  overflow-hidden" style={{ height: '20vh' }}>
            <div className="content-block-title">conversation</div>
            <div className="content-block-body" data-conversation-content>
              {!items.length && `awaiting connection...`}
              {items.map((conversationItem) => (
                <div 
                  className="conversation-item" 
                  key={conversationItem.id}
                >
                  <div className={`speaker ${conversationItem.role || ''}`}>
                    <div>
                      {(
                        conversationItem.role || conversationItem.type
                      ).replace(/_/g, ' ')}
                    </div>
                    <div
                      className="close"
                      onClick={() =>
                        deleteConversationItem(conversationItem.id)
                      }
                    >
                      <X />
                    </div>
                  </div>
                  <div className={`speaker-content`}>
                    {/* tool response */}
                    {conversationItem.type === 'function_call_output' && (
                      <div>{conversationItem.formatted.output}</div>
                    )}
                    {/* tool call */}
                    {!!conversationItem.formatted.tool && (
                      <div>
                        {conversationItem.formatted.tool.name}(
                        {conversationItem.formatted.tool.arguments})
                      </div>
                    )}
                    {!conversationItem.formatted.tool &&
                      conversationItem.role === 'user' && (
                        <div>
                          {conversationItem.formatted.transcript ||
                            (conversationItem.formatted.audio?.length
                              ? '(awaiting transcript)'
                              : conversationItem.formatted.text ||
                                '(item sent)')}
                        </div>
                      )}
                    {!conversationItem.formatted.tool &&
                      conversationItem.role === 'assistant' && (
                        <div>
                          {conversationItem.formatted.transcript ||
                            conversationItem.formatted.text ||
                            '(truncated)'}
                        </div>
                      )}
                    {conversationItem.formatted.file && (
                      <audio
                        src={conversationItem.formatted.file.url}
                        controls
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="content-actions">
            <Toggle
              defaultValue={false}
              labels={['manual', 'vad']}
              values={['none', 'server_vad']}
              onChange={(_, value) => changeTurnEndType(value)}
            />
            <div className="spacer" />
            {isConnected && canPushToTalk && (
              <Button
                label={isRecording ? 'release to send' : 'push to talk'}
                buttonStyle={isRecording ? 'alert' : 'regular'}
                disabled={!isConnected || !canPushToTalk}
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
              />
            )}
            <div className="spacer" />
            <Button
              label={isConnected ? 'disconnect' : 'connect'}
              iconPosition={isConnected ? 'end' : 'start'}
              icon={isConnected ? X : Zap}
              buttonStyle={isConnected ? 'regular' : 'action'}
              onClick={
                isConnected ? disconnectConversation : connectConversation
              }
            />
            <Button
            label="View Saved Notes"
            onClick={() => setIsNotesModalOpen(true)}
            icon={Edit}
/>
            <Button
              label="Search Images"
              icon={Search}
              onClick={() => setIsImageModalOpen(true)}
            />
          </div>
        </div>
        <div className="content-right">
          <div className="content-block saved-notes">
          
            {isNotesVisible && (
              <div className="content-block-body notes-list">
                {notes.length === 0 ? (
                  <p>No saved notes found.</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id || note.timestamp} className="note-entry">
                      <div 
                        className={`note-topic ${activeContextId === (note.id || note.timestamp) ? 'active-context' : ''}`}
                        onClick={() => {
                          const newNoteId = selectedNoteId === (note.id || note.timestamp) ? null : (note.id || note.timestamp);
                          setSelectedNoteId(newNoteId);
                          if (newNoteId) {
                            loadNoteContext(newNoteId);
                          } else {
                            setActiveContextId(null); // Clear active context
                          }
                        }}
                      >
                        <h3>
                          {note.topic}
                          {activeContextId === (note.id || note.timestamp) && (
                            <span className="context-indicator">Active Context</span>
                          )}
                        </h3>
                        <span className="timestamp">{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                      
                      {selectedNoteId === (note.id || note.timestamp) && (
                        <div className="note-details">
                          <div className="key-points">
                            <h4>Key Points:</h4>
                            <ul>
                              {note.keyPoints.map((point, i) => (
                                <li key={`${note.id || note.timestamp}-point-${i}`}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="content-block repair-history">
            <div className="content-block-title">Vehicle Repair History</div>
            <div className="content-block-body full">
              {Object.entries(memoryKv).map(([vehicleId, repairs]) => (
                <div key={vehicleId}>
                  <h3>Vehicle: {vehicleId}</h3>
                  {Array.isArray(repairs) && repairs.map((repair, index) => (
                    <div key={`${vehicleId}-${repair.timestamp}-${index}`} className="repair-entry">
                      <div className="repair-date">{new Date(repair.timestamp).toLocaleDateString()}</div>
                      <div className="repair-type">{repair.repair_type}</div>
                      <div className="repair-description">{repair.description}</div>
                      {repair.mileage && <div className="repair-mileage">Mileage: {repair.mileage}</div>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="content-block kv">
            <div className="content-block-title">set_memory()</div>
            <div className="content-block-body content-kv">
              {JSON.stringify(memoryKv, null, 2)}
            </div>
          </div>
          <div className="content-block repair-diagram">
            <div className="content-block-title">Component Diagram</div>
          </div>
          <div className="api-logs">
          <div className="content-block api-logs">
            <div className="content-block-title">API Logs</div>
            <div className="content-block-body" style={{ maxHeight: '600px', overflow: 'auto' }}>
              {apiLogs.map((log, index) => (
                <div key={index} className= "log-entry p-2 border-b border-gray-700">
                  <div className="">{log.timestamp}</div>
                  <div className="text-lg text-bold text-blue-400">{log.type}</div>
                  <pre className="text-lg text-red-500 overflow-x-auto">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
         </div>
        </div>
      </div>
    <div className="notesmain"></div>
      {isNotesModalOpen && (
        <div className="notes-modal">
          <div className="notes-modal-content">
            <div className="notes-modal-header">
              <h2>Saved Notes</h2>
              <button onClick={() => setIsNotesModalOpen(false)}>×</button>
            </div>
            <div className="notes-list">
              {notes.length === 0 ? (
                <p>No saved notes found.</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id || note.timestamp} className="note-entry">
                    <div className="note-topic">
                      <h3>{note.topic}</h3>
                      <span className="timestamp">
                        {new Date(note.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="note-details">
                      <h4>Key Points:</h4>
                      <ul>
                        {note.keyPoints.map((point, i) => (
                          <li key={`${note.id || note.timestamp}-point-${i}`}>{point}</li>
                        ))}
                      </ul>
                      {note.codeExamples && note.codeExamples.length > 0 && (
                        <div className="code-examples">
                          <h4>Code Examples:</h4>
                          {note.codeExamples.map((codeExample, i) => (
                            <pre key={`${note.id || note.timestamp}-code-${i}`}>
                              {codeExample.code}
                            </pre>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      <ImageSearchModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        searchResults={searchResults}
        onSelectImage={(image) => {
          setSelectedDiagram({
            url: image.imageUrl,
            title: image.title,
            thumbnail: image.thumbnailUrl,
            sourceUrl: image.link,
            fileType: 'image'
          });
          setIsImageModalOpen(false);
          
          // Log the selection to verify it's working
          console.log('Selected diagram:', image);
        }}
      />
      {selectedDiagram && (
        <div className="selected-diagram mt-4">
          <h3 className="text-lg font-semibold mb-2">{selectedDiagram.title}</h3>
          <img 
            src={selectedDiagram.url} 
            alt={selectedDiagram.title}
            className="max-w-full h-auto"
          />
          {selectedDiagram.sourceUrl && (
            <a 
              href={selectedDiagram.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm mt-2 block"
            >
              View Source
            </a>
          )}
        </div>
      )}
    </div>
  );
}
