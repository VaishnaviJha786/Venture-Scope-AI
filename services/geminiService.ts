import { GoogleGenAI } from "@google/genai";
import type { StartupInput, AnalysisResult, GroundingChunk, GroundingSource } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStartup = async (
  inputs: StartupInput
): Promise<{ analysis: AnalysisResult; sources: GroundingSource[] }> => {
  const { companyName, companyWebsite, founderInfo, pitchDeck } = inputs;

  const prompt = `
    ROLE: You are a world-class venture capital analyst at a top-tier firm.
    
    TASK: Conduct a comprehensive investment analysis of the startup "${companyName}". Synthesize the provided private materials with publicly available data to generate a detailed investment memo.
    
    CONTEXT & PRIVATE MATERIALS:
    - Company Name: ${companyName}
    - Company Website: ${companyWebsite}
    - Founder Information (LinkedIn profiles, bios): ${founderInfo}
    - Pitch Deck / Business Plan Summary:
    ---
    ${pitchDeck}
    ---

    INSTRUCTIONS:
    1.  Use Google Search to find public information about the company, founders, market, and competitors.
    2.  Evaluate the startup across the following key dimensions: Market Opportunity, Product & Technology, Team Assessment, Business Model, and Competitive Landscape.
    3.  For each dimension, provide a rating from 1-10, a detailed analysis, and a bulleted list of pros and cons.
    4.  Provide a final overall investment score from 1-100 and a concise executive summary.
    5.  Be critical, objective, and data-driven in your analysis. Your audience is an investment committee.
    6.  Return your complete analysis in a valid JSON object format that adheres to this TypeScript interface:
    \`\`\`typescript
    interface AnalysisSection {
      title: string;
      rating: number;
      details: string;
      pros: string[];
      cons: string[];
    }

    interface AnalysisResult {
      overallScore: number;
      executiveSummary: string;
      sections: AnalysisSection[];
    }
    \`\`\`
  `;

  let responseText = "";
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.2,
      },
    });

    responseText = response.text;

    const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    // FIX: Replaced map().filter() with reduce() to safely handle optional 'uri' and 'title' properties from the API and correctly type the resulting 'sources' array.
    const sources: GroundingSource[] = groundingChunks.reduce<GroundingSource[]>((acc, chunk) => {
      if (chunk.web?.uri && chunk.web?.title) {
        acc.push({ uri: chunk.web.uri, title: chunk.web.title });
      }
      return acc;
    }, []);

    // Filter out duplicate sources based on URI
    const uniqueSources = Array.from(new Map(sources.map(item => [item.uri, item])).values());
    
    // The model may wrap the output in markdown, so we extract it here.
    let jsonString = responseText.trim();
    const match = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) {
        jsonString = match[1];
    }

    const analysis: AnalysisResult = JSON.parse(jsonString);

    return { analysis, sources: uniqueSources };

  } catch (error) {
    console.error("Error analyzing startup:", error);
    if (error instanceof SyntaxError) {
      console.error("Failed to parse AI response:", responseText);
      throw new Error("The AI returned a malformed analysis that could not be understood. Please try again.");
    }
    throw new Error("Failed to communicate with the AI model. Please check the console for more details.");
  }
};
