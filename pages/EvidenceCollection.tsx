import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Save, AlertCircle, Loader2 } from 'lucide-react';

export const EvidenceCollection: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { addEvidence, isAnalyzing } = useData();
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<any>('twitter');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    await addEvidence(content, platform, new Date(date).toISOString());
    onNavigate('dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto">
        <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Log New Evidence</h1>
            <p className="text-slate-500">Securely document harassment. This data is encrypted locally.</p>
        </header>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
            
            {/* Platform & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Platform</label>
                    <select 
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50"
                    >
                        <option value="twitter">X (Twitter)</option>
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="email">Email</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Date of Incident</label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Content / Transcription</label>
                <p className="text-xs text-slate-400">Paste the text of the message, post, or transcript here.</p>
                <textarea 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g. User @badactor posted: 'I know where you live...'"
                    className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50 resize-none font-mono text-sm"
                    required
                />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
                <AlertCircle className="shrink-0" size={20} />
                <p>
                    <strong>Tip:</strong> Upon saving, our AI will automatically analyze this text to determine severity and categorize the threat type for your records.
                </p>
            </div>

            <div className="pt-4 flex justify-end gap-3">
                <button 
                    type="button" 
                    onClick={() => onNavigate('dashboard')}
                    className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
                    disabled={isAnalyzing}
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="px-6 py-3 bg-brand-600 text-white font-bold rounded-lg shadow-md hover:bg-brand-700 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isAnalyzing}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Log Securely
                        </>
                    )}
                </button>
            </div>
        </form>
    </div>
  );
};