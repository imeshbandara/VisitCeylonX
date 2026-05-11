import express from 'express';
import Tourist from '../models/Tourist.js';

const router = express.Router();

// Register a new Tourist
router.post('/register', async (req, res) => {
    try {
        const newTourist = new Tourist(req.body);
        const savedTourist = await newTourist.save();
        res.status(201).json(savedTourist);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;