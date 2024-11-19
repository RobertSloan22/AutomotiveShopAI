/// <reference types="vite/client" />

import React from 'react';
import { useEffect, useRef, useCallback, useState } from 'react';
import { RealtimeClient } from '@openai/realtime-api-beta';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client.js';
import { WavRecorder, WavStreamPlayer } from './lib/wavtools/index.js';
import { instructions } from './utils/conversation_config.js';
import { WavRenderer } from './utils/wav_renderer';
import { X, Edit, Zap, ArrowUp, ArrowDown } from 'react-feather';
import { Button } from '../components/button/Button';
import { Toggle } from '../components/toggle/Toggle';
import { EngineDiagram } from '../components/EngineDiagram/EngineDiagram';
import './AutoChatAssistant.scss';
import { carmdService } from './services/carmd';

// Add interfaces after imports
interface ImportMetaEnv {
  VITE_OPENAI_API_KEY: string;
  // Add other env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const LOCAL_RELAY_SERVER_URL: string = 'http://localhost:8081';
const OPENAI_API_KEY: string = import.meta.env.VITE_OPENAI_API_KEY;
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

  // Create a ref to hold the disconnect function
  const disconnectRef = useRef<(() => Promise<void>) | null>(null);

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
    client.updateSession({ instructions: instructions });
    // Set transcription, otherwise we don't get user transcriptions back
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
    client.addTool(
      {
        name: 'search_automotive_diagram',
        description: 'Searches and displays relevant automotive diagrams',
        parameters: {
          type: 'object',
          properties: {
            search_query: {
              type: 'string',
              description: 'Specific automotive component or system to find a diagram for',
            },
            type: {
              type: 'string',
              enum: ['repair', 'parts', 'wiring', 'system'],
              description: 'Type of diagram needed',
            },
            year: {
              type: 'string',
              description: 'Vehicle year (optional)',
            },
            make: {
              type: 'string',
              description: 'Vehicle make (optional)',
            },
            model: {
              type: 'string',
              description: 'Vehicle model (optional)',
            }
          },
          required: ['search_query', 'type'],
        },
      },
      async ({ search_query, type, year, make, model }: DiagramSearchParams) => {
        try {
          // Try CarMD/Mitchell first
          try {
            const carmdResult = await carmdService.getDiagrams(search_query, {
              year,
              make,
              model
            });
            
            if (carmdResult?.imageUrl) {
              setDiagramUrl(carmdResult.imageUrl);
              setActiveDiagram('custom');
              return { 
                status: 'found', 
                url: carmdResult.imageUrl,
                source: carmdResult.source,
                title: carmdResult.title
              };
            }
          } catch (error) {
            console.log('Primary diagram search failed, falling back to Google:', error);
          }

          // Google Custom Search fallback
          let fullQuery = `${year || ''} ${make || ''} ${model || ''} ${search_query} ${type} diagram schematic`;
          fullQuery = fullQuery.trim();

          const response = await fetch(
            `https://www.googleapis.com/customsearch/v1?` +
            `key=${process.env.REACT_APP_GOOGLE_API_KEY}` +
            `&cx=${process.env.REACT_APP_GOOGLE_CSE_ID}` +
            `&q=${encodeURIComponent(fullQuery)}` +
            `&searchType=image` +
            `&num=1` +
            `&imgType=clipart,photo` +
            `&fileType=jpg,png,gif` +
            `&imgSize=large` +
            `&safe=active`
          );

          if (!response.ok) {
            throw new Error(`Google Search API error: ${response.statusText}`);
          }

          const data = await response.json();
          const imageResult = data.items?.[0]?.link;

          if (imageResult) {
            const imgResponse = await fetch(imageResult, { method: 'HEAD' });
            if (imgResponse.ok) {
              setDiagramUrl(imageResult);
              setActiveDiagram('custom');
              return { 
                status: 'found', 
                url: imageResult,
                source: 'Google Custom Search',
                title: data.items?.[0]?.title || 'Automotive Diagram'
              };
            }
          }
          
          return { 
            status: 'not_found', 
            error: 'No suitable diagram found',
            message: 'Try adjusting the search terms or specifying different vehicle details'
          };
        } catch (error) {
          console.error('Diagram search error:', error);
          return { 
            status: 'error', 
            error: 'Failed to search for diagram',
            message: error instanceof Error ? error.message : 'Unknown error occurred'
          };
        }
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

  useEffect(() => {
    // Core RealtimeClient and audio capture setup
    const cleanup = async () => {
      if (disconnectRef.current) {
        await disconnectRef.current();
      }
    };

    return () => {
      cleanup().catch(console.error);
    };
  }, []);

  /**
   * Render the application
   */
  return (
    <div data-component="ConsolePage">
      <div className="content-top">
        <div className="content-title">
          <img src="/openai-logomark.svg" />
        </div>
      </div>
      <div className="content-main">
        <div className="content-logs">
          <div className="content-block events">
            <div className="visualization">
              <div className="visualization-entry client" style={{ width: '80vw' }}>
                <canvas ref={clientCanvasRef} />
              </div>
              <div className="visualization-entry server" style={{ width: '80vw' }}>
                <canvas ref={serverCanvasRef} />
              </div>
            </div>
            <div className="content-block-title">events</div>
            <div className="content-block-body" style={{ width: '60vw' }} ref={eventsScrollRef}>
              {!realtimeEvents.length && `awaiting connection...`}
              {realtimeEvents.map((realtimeEvent, i) => {
                const count = realtimeEvent.count;
                const event = { ...realtimeEvent.event };
                if (event.type === 'input_audio_buffer.append') {
                  event.audio = `[trimmed: ${event.audio.length} bytes]`;
                } else if (event.type === 'response.audio.delta') {
                  event.delta = `[trimmed: ${event.delta.length} bytes]`;
                }
                return (
                  <div className="event" key={event.event_id}>
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
          <div className="content-block conversation">
            <div className="content-block-title">conversation</div>
            <div className="content-block-body" data-conversation-content>
              {!items.length && `awaiting connection...`}
              {items.map((conversationItem, i) => {
                return (
                  <div className="conversation-item" key={conversationItem.id}>
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
                );
              })}
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
          </div>
        </div>
        <div className="content-right">
          <div className="content-block repair-history">
            <div className="content-block-title">Vehicle Repair History</div>
            <div className="content-block-body full">
              {Object.entries(memoryKv).map(([vehicleId, repairs]) => (
                <div key={vehicleId}>
                  <h3>Vehicle: {vehicleId}</h3>
                  {Array.isArray(repairs) && repairs.map((repair, index) => (
                    <div key={index} className="repair-entry">
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
        </div>
      </div>
    </div>
  );
}
