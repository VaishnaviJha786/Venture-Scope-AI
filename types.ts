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
  web: {
    // FIX: Made uri and title optional to align with the Gemini API's GroundingChunk type.
    uri?: string;
    title?: string;
  }
}

export interface GroundingSource {
    uri: string;
    title: string;
}
