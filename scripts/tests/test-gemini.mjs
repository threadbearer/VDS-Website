 
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const chat = ai.chats.create({
  model: 'gemini-1.5-flash',
  config: {
    systemInstruction: "You are a test bot",
  }
});
try {
  const stream = await chat.sendMessageStream("hello");
  for await (const chunk of stream) {
    console.log(chunk.text);
  }
} catch (e) {
  console.error("ERROR", e);
}
