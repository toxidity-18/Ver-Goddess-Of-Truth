import { GoogleGenAI, Type } from "@google/genai";
import { EvidenceAnalysis } from "../types";

const apiKey = process.env.API_KEY || ''; // Fallback to empty string if not defined, handled by try-catch
const ai = new GoogleGenAI({ apiKey });

export const analyzeEvidenceText = async (text: string): Promise<EvidenceAnalysis> => {
  if (!apiKey) {
    console.warn("No API Key provided. Returning mock analysis.");
    return {
      category: 'harassment',
      severity: 'medium',
      confidence: 0.85,
      summary: 'Analysis unavailable (Missing API Key). Manual review required.',
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following text which is potential evidence of online harassment. 
      Classify the category (threat, doxxing, stalking, hate_speech, defamation, harassment, or unknown).
      Determine severity (low, medium, high, critical).
      Provide a confidence score (0-1).
      Provide a brief 1-sentence summary of why it fits this category.
      
      Text to analyze: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            severity: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            summary: { type: Type.STRING },
          },
        },
      },
    });

    const jsonStr = response.text || "{}";
    const result = JSON.parse(jsonStr) as EvidenceAnalysis;
    return result;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      category: 'unknown',
      severity: 'low',
      confidence: 0,
      summary: 'AI analysis failed. Please review manually.',
    };
  }
};

export const generateDossierSummary = async (evidenceTexts: string[]): Promise<string> => {
  if (!apiKey) {
    return "Summary unavailable (Missing API Key).";
  }

  try {
    const combinedText = evidenceTexts.map((t, i) => `Item ${i+1}: ${t}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a forensic analyst summarizing a case of online harassment. 
      Review the following evidence items and write a cohesive, professional executive summary 
      (approx 100-150 words) describing the nature of the harassment campaign, the primary types of threats observed, 
      and the overall severity. Do not use bullet points, write a narrative paragraph.

      Evidence:
      ${combinedText}`
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    return "Error generating summary.";
  }
};

export const generateDossierMetadata = async (evidenceTexts: string[]): Promise<{ title: string; description: string }> => {
  if (!apiKey) {
    return { title: "New Dossier (Auto-Generated)", description: "Summary unavailable (Missing API Key)." };
  }

  try {
    const combinedText = evidenceTexts.map((t, i) => `Item ${i+1}: ${t}`).join('\n');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a forensic analyst. Review the following evidence items and generate a professional Title and a brief Description for a legal dossier.
      
      Evidence:
      ${combinedText}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
        },
      },
    });

    const jsonStr = response.text || "{}";
    return JSON.parse(jsonStr) as { title: string; description: string };
  } catch (error) {
    console.error("Gemini Metadata Error:", error);
    return { title: "Auto-Generated Dossier", description: "AI generation failed." };
  }
};