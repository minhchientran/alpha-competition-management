import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, model = 'gemini-1.5-flash' } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Invalid messages format' });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }

        const geminiModel = genAI.getGenerativeModel({ model });
        const conversation = geminiModel.startChat({
            history: messages.slice(0, -1).map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        let prompt = messages[messages.length - 1].content;
        if (messages.length === 1) {
            prompt = `You are an AI trading assistant. ${prompt}`;
        }

        const result = await conversation.sendMessage(prompt);
        const response = await result.response;
        const aiResponse = response.text();

        return res.status(200).json({ message: aiResponse });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
