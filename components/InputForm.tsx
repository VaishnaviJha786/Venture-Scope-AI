
import React, { useState } from 'react';
import type { StartupInput } from '../types';

interface InputFormProps {
  onAnalyze: (inputs: StartupInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isLoading }) => {
  const [formData, setFormData] = useState<StartupInput>({
    companyName: '',
    companyWebsite: '',
    founderInfo: '',
    pitchDeck: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnalyze(formData);
  };
  
  const isFormValid = formData.companyName && formData.companyWebsite && formData.pitchDeck;

  return (
    <div className="bg-brand-secondary p-6 rounded-xl shadow-lg sticky top-24">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Startup Details</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-brand-light">Company Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g., QuantumLeap AI"
            className="mt-1 block w-full bg-brand-accent/50 border-brand-accent rounded-md shadow-sm py-2 px-3 text-brand-text placeholder-brand-light/70 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            required
          />
        </div>
        <div>
          <label htmlFor="companyWebsite" className="block text-sm font-medium text-brand-light">Company Website</label>
          <input
            type="url"
            id="companyWebsite"
            name="companyWebsite"
            value={formData.companyWebsite}
            onChange={handleChange}
            placeholder="https://example.com"
            className="mt-1 block w-full bg-brand-accent/50 border-brand-accent rounded-md shadow-sm py-2 px-3 text-brand-text placeholder-brand-light/70 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            required
          />
        </div>
        <div>
          <label htmlFor="founderInfo" className="block text-sm font-medium text-brand-light">Founder(s) Info</label>
          <textarea
            id="founderInfo"
            name="founderInfo"
            value={formData.founderInfo}
            onChange={handleChange}
            rows={3}
            placeholder="Paste LinkedIn URLs or brief bios..."
            className="mt-1 block w-full bg-brand-accent/50 border-brand-accent rounded-md shadow-sm py-2 px-3 text-brand-text placeholder-brand-light/70 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="pitchDeck" className="block text-sm font-medium text-brand-light">Pitch Deck / Business Plan Text</label>
          <textarea
            id="pitchDeck"
            name="pitchDeck"
            value={formData.pitchDeck}
            onChange={handleChange}
            rows={8}
            placeholder="Paste the text content of the pitch deck or business plan..."
            className="mt-1 block w-full bg-brand-accent/50 border-brand-accent rounded-md shadow-sm py-2 px-3 text-brand-text placeholder-brand-light/70 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-brand-primary bg-cyan-400 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-secondary focus:ring-cyan-500 disabled:bg-brand-accent disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Generate Analysis'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;
