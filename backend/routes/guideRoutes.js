import express from 'express';
import Guide from '../models/Guide.js';

const router = express.Router();

// 1. GET all available guides
router.get('/', async (req, res) => {
    try {
        // We only want to find guides who are marked as available
        const guides = await Guide.find({ isAvailable: true });
        res.status(200).json(guides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. POST a new guide (Registration)
router.post('/register', async (req, res) => {
    const { fullName, languages, contact, experience, profileImage } = req.body;

    const newGuide = new Guide({
        fullName,
        languages,
        contact,
        experience,
        profileImage,
        isAvailable,
        rating
    });

    try {
        const savedGuide = await newGuide.save();
        res.status(201).json(savedGuide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;