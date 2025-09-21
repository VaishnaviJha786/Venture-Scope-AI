
import React from 'react';
import type { AnalysisSection } from '../types';

const RatingBar: React.FC<{ rating: number }> = ({ rating }) => {
  const width = `${rating * 10}%`;
  const getColor = (r: number) => {
    if (r >= 8) return 'bg-green-500';
    if (r >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full bg-brand-accent/50 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${getColor(rating)} transition-all duration-500 ease-out`}
        style={{ width: width }}
      ></div>
    </div>
  );
};

const ListItem: React.FC<{ text: string; isPro: boolean }> = ({ text, isPro }) => {
    const icon = isPro ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1.707-10.293a1 1 0 00-1.414 1.414L8.586 10l-1.707 1.707a1 1 0 101.414 1.414L10 11.414l1.707 1.707a1 1 0 101.414-1.414L11.414 10l1.707-1.707a1 1 0 00-1.414-1.414L10 8.586 8.293 7.707z" clipRule="evenodd" />
        </svg>
    );

    return (
        <li className="flex items-start space-x-2">
            {icon}
            <span className="text-sm text-brand-light">{text}</span>
        </li>
    );
}

const AnalysisCard: React.FC<{ section: AnalysisSection }> = ({ section }) => {
  return (
    <div className="bg-brand-primary/50 rounded-lg p-5 flex flex-col space-y-4 shadow-md hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300">
      <div>
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-semibold text-brand-text">{section.title}</h3>
          <span className="font-bold text-lg">{section.rating}<span className="text-sm text-brand-light">/10</span></span>
        </div>
        <RatingBar rating={section.rating} />
      </div>
      
      <p className="text-sm text-brand-light flex-grow">{section.details}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-accent/50">
        <div>
          <h4 className="font-semibold text-green-400 mb-2">Pros</h4>
          <ul className="space-y-2">
            {(section.pros || []).map((pro, i) => <ListItem key={i} text={pro} isPro={true} />)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-400 mb-2">Cons</h4>
          <ul className="space-y-2">
            {(section.cons || []).map((con, i) => <ListItem key={i} text={con} isPro={false} />)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;
