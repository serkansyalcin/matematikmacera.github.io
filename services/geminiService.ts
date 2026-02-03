
import { GoogleGenAI, Type } from "@google/genai";
import { AIRiddle, AIStoryQuest, Difficulty, AIProblem, Operation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateAIRiddle(difficulty: Difficulty): Promise<AIRiddle> {
  const prompt = `İlkokul öğrencisi için bir matematik bilmecesi oluştur. 
  Zorluk: ${difficulty}. 
  Bilmece bir sayı veya basit bir mantık üzerine olmalı. 
  Örnek: "İki katımın 5 fazlası 15 olan sayıyım, ben kimim?". 
  4 seçenekli olsun. Cevap kısa olmalı.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riddle: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswer: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["riddle", "options", "correctAnswer", "explanation"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}

export async function generateAIStoryQuest(difficulty: Difficulty): Promise<AIStoryQuest> {
  const prompt = `Uzay temalı bir matematik görevi yaz. 
  Bir hikaye anlat ve sonunda bir problem sor. 
  Zorluk: ${difficulty}. 
  Cevap bir tam sayı olmalı.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          story: { type: Type.STRING },
          question: { type: Type.STRING },
          answer: { type: Type.NUMBER },
          reward: { type: Type.STRING }
        },
        required: ["story", "question", "answer", "reward"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}

// Added generateAIStoryProblem function used by AIChallenge.tsx
export async function generateAIStoryProblem(difficulty: Difficulty, operation: Operation | 'mixed'): Promise<AIProblem> {
  const prompt = `İlkokul öğrencisi için uzay temalı bir matematik hikaye problemi oluştur. 
  Zorluk: ${difficulty}. 
  İşlem: ${operation}.
  Cevap bir tam sayı olmalı. Bir de ipucu ekle.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          story: { type: Type.STRING },
          question: { type: Type.STRING },
          correctAnswer: { type: Type.NUMBER },
          hint: { type: Type.STRING }
        },
        required: ["story", "question", "correctAnswer", "hint"]
      }
    }
  });

  return JSON.parse(response.text.trim());
}

// Added getCelebrationMessage function used by App.tsx
export async function getCelebrationMessage(score: number): Promise<string> {
  const prompt = `${score} puan toplayarak tüm uzay görevlerini tamamlayan bir çocuk için tebrik mesajı yaz. Kısa ve heyecan verici olsun.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });
  return response.text?.trim() || "Harikasın! Uzay Ustası oldun!";
}
