import { contextBridge, ipcRenderer } from 'electron';

// Expose environment variables to renderer process
contextBridge.exposeInMainWorld('electron', {
    getEnvVars: () => ipcRenderer.invoke('get-env-vars'),
    env: {
        VITE_OPENAI_API_KEY: ipcRenderer.invoke('get-env-vars').VITE_OPENAI_API_KEY
    }
});