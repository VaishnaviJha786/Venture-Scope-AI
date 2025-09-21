export interface StartupInput {
  companyName: string;
  companyWebsite: string;
  founderInfo: string;
  pitchDeck: string;
}

export interface AnalysisSection {
  title: string;
  rating: number;
  details: string;
  pros: string[];
  cons: string[];
}

export interface AnalysisResult {
  overallScore: number;
  executiveSummary: string;
  sections: AnalysisSection[];
}

export interface GroundingChunk {
  // FIX: The 'web' property is optional in the Gemini API's GroundingChunk type.
  web?: {
    uri?: string;
    title?: string;
  }
}

export interface GroundingSource {
    uri: string;
    title: string;
}
