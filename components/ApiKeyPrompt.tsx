import React, { useState } from 'react';

interface ApiKeyPromptProps {
  onApiKeySubmit: (apiKey: string) => void;
}

const ApiKeyPrompt: React.FC<ApiKeyPromptProps> = ({ onApiKeySubmit }) => {
  const [localApiKey, setLocalApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localApiKey.trim()) {
      onApiKeySubmit(localApiKey.trim());
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary font-sans text-brand-text flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-brand-secondary rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-brand-text">VentureScope AI</h1>
            <p className="text-brand-light mt-2">Enter your Google AI Studio API Key to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-brand-light">API Key</label>
            <input
              type="password"
              id="apiKey"
              name="apiKey"
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              placeholder="Enter your API key here"
              className="mt-1 block w-full bg-brand-accent/50 border-brand-accent rounded-md shadow-sm py-2 px-3 text-brand-text placeholder-brand-light/70 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              required
            />
          </div>
          <p className="text-xs text-brand-light">
            You can get a free key from {' '}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Google AI Studio
            </a>. 
            Your key is stored only in your browser for this session.
          </p>
          <button
            type="submit"
            disabled={!localApiKey.trim()}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-primary bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-cyan-500 disabled:bg-brand-accent disabled:cursor-not-allowed transition-colors"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApiKeyPrompt;
