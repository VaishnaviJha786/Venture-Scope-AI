
import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Synthesizing founder materials...",
  "Scanning public data sources...",
  "Evaluating market size and trends...",
  "Assessing competitive landscape...",
  "Analyzing team background and experience...",
  "Building financial projections...",
  "Finalizing investment memo...",
];

const LoadingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="w-16 h-16 border-4 border-cyan-400 border-solid border-t-transparent rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-semibold text-brand-text mb-2">AI Analyst at Work</h2>
      <p className="text-brand-light transition-opacity duration-500">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingScreen;
