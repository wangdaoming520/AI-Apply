import { GoogleGenAI, Type } from "@google/genai";
import { ScriptGenerationResponse, Language } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a structured manga script from a high-level story idea.
 */
export const generateMangaScript = async (
  storyIdea: string, 
  panelCount: number,
  genre: string,
  language: Language
): Promise<ScriptGenerationResponse> => {
  if (!apiKey) throw new Error("API Key missing");

  const langInstruction = language === 'zh' 
    ? 'Output the content (description, dialogue, notes) strictly in Simplified Chinese.' 
    : 'Output the content in English.';

  const prompt = `
    Create a detailed manga/comic script based on this idea: "${storyIdea}".
    Genre: ${genre}.
    Generate exactly ${panelCount} panels.
    ${langInstruction}
    For each panel, provide:
    1. A detailed visual description for an image generator (include angle, lighting, action).
    2. The dialogue (if any) or sound effects.
    3. Character focus notes (who is in the shot and their expression).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          panels: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                dialogue: { type: Type.STRING },
                characterFocus: { type: Type.STRING }
              },
              required: ["description", "dialogue", "characterFocus"]
            }
          }
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No script generated");
  
  return JSON.parse(text) as ScriptGenerationResponse;
};

/**
 * Generates an image for a specific manga panel.
 */
export const generatePanelImage = async (
  visualDescription: string,
  artStyleDescription: string,
  characterContext: string
): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  // Construct a prompt that enforces style and context
  const fullPrompt = `
    Create a professional manga panel.
    Art Style: ${artStyleDescription}.
    Scene Description: ${visualDescription}.
    Character Details: ${characterContext}.
    Quality: High contrast, detailed ink lines, cinematic composition. Black and white or colored manga style.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: fullPrompt,
    config: {
      imageConfig: {
        aspectRatio: "1:1" // Square panels are versatile for grid layouts
      }
    }
  });

  // Extract image
  if (response.candidates && response.candidates[0].content.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image generated");
};