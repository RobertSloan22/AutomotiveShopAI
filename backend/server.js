import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import helmet from 'helmet';

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import customerRoutes from './routes/customerRoutes.js';
import dtcRoutes from './routes/dtc.routes.js';
import vehicleRoutes from "./routes/vehicle.routes.js";
import serviceRoutes from "./routes/service.routes.js";
import partsRoutes from "./routes/parts.routes.js";
import technicianRoutes from "./routes/technician.routes.js";
import diagramRoutes from './routes/diagram.routes.js';
import diagramGenerateRoutes from './routes/diagram-generate.routes.js';
import conversationRoutes from './routes/conversation.routes.js';
import notesRoutes from './routes/notes.routes.js';
import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";
import searchRoutes from './routes/search.routes.js';
import serperRoutes from './routes/serper.routes.js';
import imageRoutes from './routes/image.routes.js';

dotenv.config();

const __dirname = path.resolve();
// PORT should be assigned after calling dotenv.config() because we need to access the env variables. Didn't realize while recording the video. Sorry for the confusion.
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'app://*',
  'file://*',
  'electron://*'
];

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "ws://localhost:8081",
        "wss://localhost:8081",
        "http://localhost:5000",
        "http://localhost:5173",
        "ws://localhost:5173",
        "https://api.openai.com",
        "app://*",
        "file://*",
        "electron://*"
      ],
      mediaSrc: ["'self'", "blob:", "mediastream:", "*"],
      workerSrc: ["'self'", "blob:", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      childSrc: ["'self'", "blob:"]
    }
  }
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some(allowed => {
      if (allowed.endsWith('*')) {
        return origin.startsWith(allowed.slice(0, -1));
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use('/api/customers', customerRoutes);
app.use("/api/dtc-initialize", dtcRoutes);
app.use(dtcRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/technicians", technicianRoutes);
app.use('/api', diagramRoutes);
app.use('/api', diagramGenerateRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/notes', notesRoutes);
app.use(express.static(path.join(__dirname, "/frontend/dist-electron")));
app.use('/api/search', searchRoutes);
app.use('/api/serper', serperRoutes);
app.use('/api', imageRoutes);

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist-electron", "index.html"));
});

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  path: '/socket.io/',
  transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

server.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
