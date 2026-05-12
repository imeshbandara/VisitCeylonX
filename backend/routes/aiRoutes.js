import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

// Gemini API eka Initialize kirima
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-plan', async (req, res) => {
    const { destination, days, preferences, budget } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // AI ekata laba dena upades (Prompt)
        const prompt = `Create a detailed ${days}-day travel itinerary for ${destination} in Sri Lanka. 
        User preferences: ${preferences}. Budget level: ${budget}. 
        Please provide the response in a structured format with daily activities and estimated costs.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ plan: text });
    } catch (error) {
        console.error("AI Generation Error:", error);
        res.status(500).json({ message: "Failed to generate plan. Please try again." });
    }
});

export default router;