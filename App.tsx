
import React, { useState } from 'react';
import type { StartupInput, AnalysisResult, GroundingSource } from './types';
import { analyzeStartup } from './services/geminiService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingScreen from './components/LoadingScreen';
import IntroContent from './components/IntroContent';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);

  const handleAnalyze = async (inputs: StartupInput) => {
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setSources([]);

    try {
      const result = await analyzeStartup(inputs);
      if (result && result.analysis) {
        setAnalysisResult(result.analysis);
        setSources(result.sources || []);
      } else {
        setError('Failed to get a valid analysis from the AI. The response might be empty or malformed.');
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary font-sans text-brand-text">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 xl:col-span-3">
            <InputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="bg-brand-secondary rounded-xl shadow-lg p-6 min-h-[calc(100vh-200px)]">
              {isLoading && <LoadingScreen />}
              {error && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-red-400">
                    <h3 className="text-xl font-bold mb-2">Analysis Failed</h3>
                    <p>{error}</p>
                  </div>
                </div>
              )}
              {!isLoading && !error && !analysisResult && <IntroContent />}
              {!isLoading && !error && analysisResult && (
                <AnalysisDisplay result={analysisResult} sources={sources} />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
