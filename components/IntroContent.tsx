
import React from 'react';

const IntroContent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-brand-accent mb-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
        <path d="M2 17l10 5 10-5"></path>
        <path d="M2 12l10 5 10-5"></path>
        <line x1="12" y1="22" x2="12" y2="12"></line>
        <line x1="22" y1="7" x2="17" y2="9.5"></line>
        <line x1="7" y1="9.5" x2="2" y2="7"></line>
      </svg>
      <h2 className="text-3xl font-bold text-brand-text mb-2">Welcome to VentureScope AI</h2>
      <p className="max-w-2xl text-brand-light">
        Your automated investment analyst. Provide details about a startup in the panel on the left to begin the evaluation process. The AI will synthesize provided and public data to generate a comprehensive investment memo.
      </p>
    </div>
  );
};

export default IntroContent;
