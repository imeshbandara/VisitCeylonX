import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-plan', async (req, res) => {
    const { destination, days, preferences, budget } = req.body;
    
    const prompt = `Create a detailed ${days}-day travel itinerary for ${destination} in Sri Lanka. 
    User preferences: ${preferences}. Budget level: ${budget}. 
    Please provide the response in a structured format with daily activities and estimated costs.`;

    // Try generating with the primary model first
    try {
        console.log("Trying primary model: gemini-2.5-flash...");
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return res.status(200).json({ plan: response.text() });

    } catch (primaryError) {
        // If it's a 503 overload error, try the fallback model
        if (primaryError.status === 503) {
            console.warn("Gemini 2.5 is busy. Trying fallback model: gemini-1.5-pro...");
            try {
                const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const result = await fallbackModel.generateContent(prompt);
                const response = await result.response;
                return res.status(200).json({ plan: response.text() });
            } catch (fallbackError) {
                console.error("All models are busy:", fallbackError);
            }
        } else {
            console.error("AI Generation Error:", primaryError);
        }
        
        // If both fail, send a clean message to the frontend
        res.status(503).json({ message: "Google AI servers are currently overloaded. Please try again in a moment!" });
    }
});

export default router;