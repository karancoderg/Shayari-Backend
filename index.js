import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/generate', async (req, res) => {
  const { prompt, language } = req.body;

  const formattedPrompt =
    language === 'hindi'
      ? `Write a 4-line Shayari in Hindi about "${prompt}".`
      : `Write a 4-line Shayari in Punjabi about "${prompt}".`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;
    const shayari = response.text();

    res.json({ shayari });
  } catch (error) {
    console.error('Gemini API Error:', error.message || error);
    res.status(500).json({ error: 'Gemini API error' });
  }
});

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
