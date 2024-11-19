import { useEffect, useRef, useState } from 'react';
import OpenAI from 'openai';
import { WavRecorder, WavStreamPlayer } from './lib/wavtools';

const openai = new OpenAI({ 
  apiKey: process.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

export function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([]);
  const [threadId, setThreadId] = useState(null);
  const [assistantId, setAssistantId] = useState(null);

  const wavRecorderRef = useRef(new WavRecorder({ sampleRate: 24000 }));
  const wavPlayerRef = useRef(new WavStreamPlayer({ sampleRate: 24000 }));

  // Initialize assistant and thread
  useEffect(() => {
    async function initializeAssistant() {
      try {
        // Create assistant
        const assistant = await openai.beta.assistants.create({
          name: "Auto Diagnostic Assistant",
          instructions: "You are an automotive diagnostic assistant. Help users diagnose car problems by asking relevant questions about symptoms, analyzing the responses, and providing potential causes and solutions.",
          tools: [{ type: "code_interpreter" }],
          model: "gpt-4-turbo-preview"
        });
        setAssistantId(assistant.id);

        // Create thread
        const thread = await openai.beta.threads.create();
        setThreadId(thread.id);
      } catch (error) {
        console.error('Failed to initialize assistant:', error);
      }
    }

    initializeAssistant();
  }, []);

  // Start recording
  const startRecording = async () => {
    try {
      setIsRecording(true);
      await wavRecorderRef.current.begin();
      await wavRecorderRef.current.record();
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
    }
  };

  // Stop recording and process audio
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);
      
      const audioData = await wavRecorderRef.current.end();
      
      // Convert audio to text using Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: audioData,
        model: "whisper-1"
      });

      // Send message to thread
      await openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: transcription.text
      });

      // Run the assistant
      const run = await openai.beta.threads.runs.create(threadId, {
        assistant_id: assistantId
      });

      // Wait for completion and get response
      const response = await waitForResponse(threadId, run.id);
      
      // Convert response to speech
      const speech = await openai.audio.speech.create({
        model: "tts-1",
        voice: "alloy",
        input: response.content
      });

      // Play response
      await wavPlayerRef.current.playAudio(speech);
      
      setIsProcessing(false);
      setMessages(prev => [...prev, 
        { role: 'user', content: transcription.text },
        { role: 'assistant', content: response.content }
      ]);

    } catch (error) {
      console.error('Failed to process recording:', error);
      setIsProcessing(false);
    }
  };

  // Helper function to wait for assistant response
  const waitForResponse = async (threadId, runId) => {
    let run;
    do {
      run = await openai.beta.threads.runs.retrieve(threadId, runId);
      if (run.status === 'failed') throw new Error('Run failed');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } while (run.status !== 'completed');

    const messages = await openai.beta.threads.messages.list(threadId);
    return messages.data[0];
  };

  return (
    <div className="voice-assistant">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      
      <button 
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        disabled={isProcessing}
      >
        {isRecording ? 'Release to Send' : isProcessing ? 'Processing...' : 'Hold to Speak'}
      </button>
    </div>
  );
} 
