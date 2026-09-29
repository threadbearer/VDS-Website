 
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
}
dotenv.config();

import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const tools = [
  {
    functionDeclarations: [
      {
        name: "getWeather",
        description: "Get the current weather",
        parameters: {
          type: "OBJECT",
          properties: {
            location: { type: "STRING" }
          },
          required: ["location"]
        }
      }
    ]
  }
];

async function main() {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        tools: tools,
      }
    });
    
    console.log("Sending message...");
    const stream = await chat.sendMessageStream({ message: "What is the weather in London?" });
    for await (const chunk of stream) {
      console.log("Chunk function calls:", chunk.functionCalls);
    }
  } catch (err) {
    console.error("ERROR", err);
  }
}
main();
