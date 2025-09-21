import { GoogleGenAI, Type } from "@google/genai";
import type { StartupInput, AnalysisResult, GroundingChunk, GroundingSource } from '../types';

// Prompt for the first call (research)
const buildResearchPrompt = (inputs: StartupInput): string => {
  return `
    Act as a senior venture capital analyst. Your task is to conduct thorough research on a startup using publicly available information.
    Synthesize your findings into a detailed report.
    
    **Startup Information:**
    - Company Name: ${inputs.companyName}
    - Company Website: ${inputs.companyWebsite}
    - Founder(s) Info: ${inputs.founderInfo || 'Not provided.'}
    - Pitch Deck / Business Plan: ${inputs.pitchDeck}

    **Research Areas:**
    Cover these five key areas in your report. Be comprehensive and objective.
    1.  **Market Opportunity:** Analyze the total addressable market (TAM), market growth projections, and current industry trends.
    2.  **Product & Technology:** Describe the core product, its innovative aspects, underlying technology, and any competitive advantages.
    3.  **Team Assessment:** Research the founders and key team members. Evaluate their experience, domain expertise, and past successes or failures.
    4.  **Competitive Landscape:** Identify the main competitors, both direct and indirect. What is the startup's key differentiation?
    5.  **Business Model:** How does the company plan to make money? Analyze its revenue model, customer acquisition strategy, pricing, and scalability.

    Provide a detailed, narrative-style report covering all these points based on your search findings.
  `;
};

// Prompt for the second call (structuring)
const buildStructuringPrompt = (researchReport: string): string => {
  return `
    You are an analyst bot responsible for structuring data.
    Based *only* on the following research report, generate a JSON object for an investment memo.
    
    **Research Report:**
    ---
    ${researchReport}
    ---
    
    **Your Task:**
    Fill out the JSON object based on the report. For each of the 5 sections, provide a rating from 1 to 10 (1=very weak, 10=excellent), a detailed analysis summary in the 'details' field, and a list of specific pros and cons. If information for a section is missing in the report, you MUST explicitly state that in the 'details' field, provide a rating of 0, and leave the pros/cons arrays empty.
    
    The 5 sections are: "Market Opportunity", "Product & Technology", "Team Assessment", "Competitive Landscape", and "Business Model". Ensure all 5 are present in the final JSON.

    Finally, provide an "Overall Score" (from 0 to 100, calculated as the average of the 5 section ratings multiplied by 10) and a concise "Executive Summary" of the findings.
  `;
};

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    overallScore: { type: Type.INTEGER, description: "The final overall score from 0 to 100." },
    executiveSummary: { type: Type.STRING, description: "A concise summary of the investment recommendation." },
    sections: {
      type: Type.ARRAY,
      description: "An array of analysis sections. Must contain exactly 5 sections.",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The title of the analysis section." },
          rating: { type: Type.INTEGER, description: "The rating for this section from 0 to 10." },
          details: { type: Type.STRING, description: "The detailed analysis for this section." },
          pros: {
            type: Type.ARRAY,
            description: "A list of positive points.",
            items: { type: Type.STRING }
          },
          cons: {
            type: Type.ARRAY,
            description: "A list of negative points.",
            items: { type: Type.STRING }
          }
        },
        required: ["title", "rating", "details", "pros", "cons"]
      }
    }
  },
  required: ["overallScore", "executiveSummary", "sections"]
};


export const analyzeStartup = async (inputs: StartupInput): Promise<{ analysis: AnalysisResult; sources: GroundingSource[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // --- STEP 1: Research and Information Gathering ---
    const researchPrompt = buildResearchPrompt(inputs);
    const researchResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: researchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const researchReport = researchResponse.text;
    const groundingChunks: GroundingChunk[] = researchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .map(chunk => chunk.web)
      .filter(web => web && web.uri && web.title)
      .map(web => ({ uri: web.uri!, title: web.title! }));
    const uniqueSources = Array.from(new Map(sources.map(item => [item['uri'], item])).values());

    if (!researchReport || researchReport.trim().length < 50) {
        throw new Error("The AI could not find sufficient public information to conduct an analysis. Please provide more details about the startup.");
    }

    // --- STEP 2: Structuring the Data into JSON ---
    const structuringPrompt = buildStructuringPrompt(researchReport);
    const structuringResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: structuringPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const analysis: AnalysisResult = JSON.parse(structuringResponse.text.trim());

    // Basic validation after structured output
    if (!analysis.executiveSummary || !analysis.sections || analysis.sections.length < 5) {
      throw new Error("The AI failed to structure the analysis correctly. Please try again.");
    }
    
    return { analysis, sources: uniqueSources };

  } catch (error) {
    console.error("Error during Gemini API call or parsing:", error);
    if (error instanceof Error) {
        // Pass a more user-friendly message
        if (error.message.includes("sufficient public information")) {
            throw error;
        }
        if (error.message.includes("structure the analysis")) {
            throw new Error("The AI generated an analysis, but it was in an unexpected format. Please try your request again.");
        }
         throw new Error(`An error occurred during analysis: ${error.message}. Please check the console for details.`);
    }
    throw new Error("An unknown error occurred during the analysis.");
  }
};
