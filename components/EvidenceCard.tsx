import React from 'react';
import { AlertCircle, Clock, Globe, Hash } from 'lucide-react';
import { EvidenceItem } from '../types';

export const EvidenceCard: React.FC<{ item: EvidenceItem }> = ({ item }) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getSeverityColor(item.classification?.severity)}`}>
            {item.classification?.severity || 'Pending'}
          </span>
          <span className="text-slate-400 text-sm flex items-center gap-1">
            <Globe size={12} /> {item.platform}
          </span>
        </div>
        <div className="text-slate-400 text-xs flex items-center gap-1">
          <Clock size={12} />
          {new Date(item.timestamp).toLocaleDateString()}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-slate-800 whitespace-pre-wrap font-mono text-sm bg-slate-50 p-3 rounded border border-slate-100">
          "{item.content}"
        </p>
      </div>

      {item.classification && (
        <div className="bg-brand-50 rounded-lg p-3 mb-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-brand-600 mt-0.5 shrink-0" size={16} />
            <div>
              <p className="text-xs font-bold text-brand-800 uppercase mb-1">
                AI Analysis: {item.classification.category.replace('_', ' ')}
              </p>
              <p className="text-sm text-brand-900 leading-relaxed">
                {item.classification.summary}
              </p>
              <p className="text-xs text-brand-600 mt-1">Confidence: {Math.round(item.classification.confidence * 100)}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-100">
        <Hash size={10} />
        <span className="truncate">Digital Signature: {item.hash}</span>
      </div>
    </div>
  );
};