import express from 'express';
import { Retriever } from '../bmw-dtc-agent/Retriever.js';

const router = express.Router();
let retriever = null;

router.post('/api/dtc-initialize', async (req, res) => {
    try {
        const { url } = req.body;
        retriever = await Retriever.initialize(url);
        res.json({ message: 'Retriever initialized successfully' });
    } catch (error) {
        console.error('Initialization error:', error);
        res.status(500).json({ 
            error: 'Failed to initialize retriever',
            details: error.message 
        });
    }
});

router.post('/api/dtc-query', async (req, res) => {
    try {
        const { query, vehicle } = req.body;
        
        if (!retriever) {
            throw new Error('Retriever not initialized');
        }

        console.log('Received query:', query);
        console.log('Received vehicle data:', vehicle);

        const response = await retriever.query(query, vehicle);
        res.json({ response });
    } catch (error) {
        console.error('Query error details:', error);
        res.status(500).json({ 
            error: 'Failed to process query',
            details: error.message,
            stack: error.stack 
        });
    }
});

export default router; 