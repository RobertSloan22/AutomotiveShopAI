import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import process from 'process';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: true,
            permissions: ['microphone'],
            webAudio: true,
            audioWorklet: true
        }
    });

    // Set permissions for media
    win.webContents.session.setPermissionRequestHandler((webContents, permission, callback) => {
        const allowedPermissions = ['media'];
        if (allowedPermissions.includes(permission)) {
            callback(true); // Grant permission
        } else {
            callback(false); // Deny permission
        }
    });

    // Make env variables available to renderer process
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('env-vars', {
            VITE_OPENAI_API_KEY: process.env.VITE_OPENAI_API_KEY
        });
    });

    // Load the app
    if (!app.isPackaged) {
        win.loadURL('http://localhost:5173');
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }

    // Add CSP headers with audio/media permissions
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self';" +
                    "connect-src 'self' " +
                        "ws://localhost:8081 wss://localhost:8081 " +  // Relay server
                        "http://localhost:5000 " +                     // MongoDB backend
                        "http://localhost:5173 ws://localhost:5173 " + // Vite dev server
                        "https://api.openai.com;" +                    // OpenAI API
                    "media-src 'self' blob: mediastream: *;" +
                    "worker-src 'self' blob: 'unsafe-inline';" +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:;" +
                    "style-src 'self' 'unsafe-inline';" +
                    "img-src 'self' data: blob:;" +
                    "child-src 'self' blob:;"
                ]
            }
        });
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});