import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to sanitize markdown so voice synthesis reads clean natural text
const cleanSpokenText = (text) => {
    if (!text) return '';
    return text
        .replace(/```[\s\S]*?```/g, '') // code blocks
        .replace(/`([^`]+)`/g, '$1')     // inline code
        .replace(/#{1,6}\s+/g, '')       // headings
        .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
        .replace(/(\*|_)(.*?)\1/g, '$2') // italic
        .replace(/~~(.*?)~~/g, '$2')     // strikethrough
        .replace(/^\s*[-*+]\s+/gm, '')   // list bullets
        .replace(/^\s*\d+\.\s+/gm, '')   // numbered lists
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
        .replace(/\n+/g, ' ')           // collapse multiple newlines to single space
        .trim();
};

const CEYLON_VOICE_SYSTEM_INSTRUCTION = `You are 'CeylonVoice', an expert Sri Lankan travel companion. Answer user queries clearly, concisely, and warmly. Specialize in local attractions, cultural etiquette, weather, local foods (e.g., Kottu, Hopper), trains, wildlife safaris, and safety tips in Sri Lanka. Keep responses short and conversational (2-4 sentences max) suitable for spoken voice output. Do not use bullet points or markdown styling.`;

router.post('/voice-assistant', async (req, res) => {
    const { message, audio, mimeType, history } = req.body;

    if ((!message || !message.trim()) && !audio) {
        return res.status(400).json({ message: "Message or audio is required" });
    }

    // Build conversational context
    let formattedPrompt = `System: ${CEYLON_VOICE_SYSTEM_INSTRUCTION}\n\n`;

    if (Array.isArray(history) && history.length > 0) {
        // Include recent history (last 4 turns) for conversational continuity
        const recentHistory = history.slice(-4);
        recentHistory.forEach(item => {
            const role = item.role === 'user' ? 'User' : 'CeylonVoice';
            formattedPrompt += `${role}: ${item.content}\n`;
        });
    }

    if (message && message.trim()) {
        formattedPrompt += `User: ${message}\nCeylonVoice:`;
    } else {
        formattedPrompt += `User provided a spoken voice recording. Please listen to their question and answer as CeylonVoice concisely (2-4 sentences max):`;
    }

    const contents = [];
    if (audio) {
        contents.push({
            inlineData: {
                data: audio,
                mimeType: mimeType || 'audio/webm'
            }
        });
    }
    contents.push({ text: formattedPrompt });

    // Helper to generate content
    const generateWithModel = async (modelName) => {
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: CEYLON_VOICE_SYSTEM_INSTRUCTION
        });
        const result = await model.generateContent(contents);
        const response = await result.response;
        return response.text();
    };

    // Try primary model gemini-2.5-flash
    try {
        const rawText = await generateWithModel("gemini-2.5-flash");
        const sanitizedReply = cleanSpokenText(rawText);

        return res.status(200).json({
            reply: sanitizedReply,
            raw: rawText
        });
    } catch (primaryError) {
        console.warn("Primary model gemini-2.5-flash failed or busy, trying fallback gemini-3.6-flash...", primaryError.message);
        try {
            const rawText = await generateWithModel("gemini-3.6-flash");
            const sanitizedReply = cleanSpokenText(rawText);

            return res.status(200).json({
                reply: sanitizedReply,
                raw: rawText
            });
        } catch (fallbackError) {
            console.error("AI Voice Assistant Error:", fallbackError);
            return res.status(503).json({
                message: "Ayubowan! I'm having trouble connecting right now. Please try again in a moment."
            });
        }
    }
});

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
                const fallbackModel = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
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