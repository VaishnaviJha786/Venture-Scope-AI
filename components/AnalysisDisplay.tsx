
import React from 'react';
import type { AnalysisResult, GroundingSource } from '../types';
import AnalysisCard from './AnalysisCard';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  sources: GroundingSource[];
}

const ScoreDonut: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 75) return 'stroke-green-400';
    if (s >= 50) return 'stroke-yellow-400';
    return 'stroke-red-400';
  };

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-brand-accent"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        <circle
          className={`${getColor(score)} transition-all duration-1000 ease-in-out`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-brand-text">{score}</span>
      </div>
    </div>
  );
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, sources }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-brand-primary/50 p-6 rounded-lg">
        <ScoreDonut score={result.overallScore} />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-text mb-2">Investment Memo</h2>
          <p className="text-brand-light">{result.executiveSummary}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {(result.sections || []).map((section, index) => (
          <AnalysisCard key={index} section={section} />
        ))}
      </div>

      {sources.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4 text-cyan-400">Data Sources</h3>
          <div className="bg-brand-primary/50 p-4 rounded-lg">
            <ul className="space-y-2">
              {sources.map((source, index) => (
                <li key={index} className="truncate">
                  <a 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-brand-light hover:text-cyan-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    <span className="truncate">{source.title || source.uri}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDisplay;
