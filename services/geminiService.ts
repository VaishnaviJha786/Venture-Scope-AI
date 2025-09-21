import { GoogleGenAI, Type } from "@google/genai";
import type { StartupInput, AnalysisResult, GroundingChunk, GroundingSource } from '../types';

const buildPrompt = (inputs: StartupInput): string => {
  return `
    Analyze the provided startup information and act as a venture capital analyst.
    Your analysis MUST be grounded in publicly available data using the Google Search tool.
    
    **Startup Information:**
    - Company Name: ${inputs.companyName}
    - Company Website: ${inputs.companyWebsite}
    - Founder(s) Info: ${inputs.founderInfo || 'Not provided.'}
    - Pitch Deck / Business Plan: ${inputs.pitchDeck}

    **Your Task:**
    Generate a comprehensive investment memo. For each section, provide a rating from 1 to 10 (1=very weak, 10=excellent), a detailed analysis, and a list of specific pros and cons. The analysis must be objective and data-driven, referencing public information where possible.

    **Output Format:**
    You MUST return the analysis as a single JSON object that conforms to the provided schema. Do not include any markdown formatting like \`\`\`json.

    **Analysis Sections to Include:**
    1.  **Market Opportunity:** Assess the total addressable market (TAM), market growth, and current trends.
    2.  **Product & Technology:** Evaluate the product's innovation, competitive advantage, and technological feasibility.
    3.  **Team Assessment:** Analyze the founders' experience, domain expertise, and ability to execute.
    4.  **Competitive Landscape:** Identify key competitors and the startup's differentiation.
    5.  **Business Model:** Evaluate the revenue model, customer acquisition strategy, and scalability.
    
    Finally, provide an "Overall Score" (from 0 to 100) and a concise "Executive Summary" of your findings.
    `;
};

// This function now relies on the environment variable for the API key.
export const analyzeStartup = async (inputs: StartupInput): Promise<{ analysis: AnalysisResult; sources: GroundingSource[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = buildPrompt(inputs);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        // responseMimeType and responseSchema are not allowed when using the googleSearch tool.
        tools: [{ googleSearch: {} }],
      },
    });

    let responseText = response.text;
    
    // To make parsing more robust, extract JSON from markdown code blocks if they exist.
    const jsonRegex = /```json\s*([\s\S]*?)\s*```/;
    const match = responseText.match(jsonRegex);
    if (match && match[1]) {
      responseText = match[1];
    }
    
    const analysis: AnalysisResult = JSON.parse(responseText.trim());

    const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const sources: GroundingSource[] = groundingChunks
      .map(chunk => chunk.web)
      .filter(web => web && web.uri && web.title)
      .map(web => ({ uri: web.uri!, title: web.title! }));

    // Deduplicate sources based on URI
    const uniqueSources = Array.from(new Map(sources.map(item => [item['uri'], item])).values());

    return { analysis, sources: uniqueSources };

  } catch (error) {
    console.error("Error during Gemini API call or parsing:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to analyze startup: ${error.message}. Please check if your API key is valid and your network connection is stable.`);
    }
    throw new Error("An unknown error occurred during the analysis.");
  }
};
