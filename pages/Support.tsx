import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { Star, Clock, MapPin, MessageCircle, ShieldCheck, X, Send } from 'lucide-react';

export const Support: React.FC = () => {
  const { supporters, requestConnection } = useData();
  const { user } = useAuth();
  
  const [selectedSupporter, setSelectedSupporter] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleConnectClick = (supporterId: string) => {
    setSelectedSupporter(supporterId);
    setShowModal(true);
  };

  const handleSendRequest = () => {
    if (selectedSupporter && message.trim()) {
      requestConnection(selectedSupporter, message);
      setShowModal(false);
      setMessage('');
      setSelectedSupporter(null);
      alert("Connection request sent securely!");
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900">Verified Support Network</h1>
        <p className="text-slate-500 mt-2">Find vetted professionals who understand digital safety and trauma.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {supporters.map(supporter => (
            <div key={supporter.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
                {/* Avatar / Side */}
                <div className="bg-slate-50 p-6 flex flex-col items-center justify-center md:w-64 border-r border-slate-100">
                    <div className="relative mb-4">
                        <img 
                            src={supporter.avatarUrl} 
                            alt={supporter.name} 
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm"
                        />
                        {supporter.verified && (
                            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white" title="Verified Professional">
                                <ShieldCheck size={14} />
                            </div>
                        )}
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-1 text-yellow-500 font-bold mb-1">
                            <Star size={16} fill="currentColor" />
                            <span>{supporter.rating}</span>
                            <span className="text-slate-400 font-normal text-xs">({supporter.reviews} reviews)</span>
                        </div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">{supporter.profession.replace('_', ' ')}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-slate-900">{supporter.name}</h3>
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                <Clock size={12} /> {supporter.responseTime}
                            </span>
                        </div>
                        
                        <p className="text-slate-600 mb-4 text-sm leading-relaxed">{supporter.bio}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {supporter.specializations.map(spec => (
                                <span key={spec} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <div className="text-xs text-slate-400 flex gap-4">
                             <span className="flex items-center gap-1"><MapPin size={12} /> Remote / Online</span>
                             <span className="flex items-center gap-1">English, Spanish</span>
                        </div>
                        {user?.role === 'survivor' && (
                          <button 
                            onClick={() => handleConnectClick(supporter.id)}
                            className="px-4 py-2 bg-brand-600 text-white text-sm font-bold rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2"
                          >
                              <MessageCircle size={16} />
                              Connect Anonymously
                          </button>
                        )}
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Connection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Connect Anonymously</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-blue-800 text-sm mb-4">
              <ShieldCheck className="inline-block mr-1 mb-1" size={16} />
              Your identity is hidden. The supporter will only see your alias <strong>{user?.alias}</strong>.
            </div>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Briefly describe your situation (e.g., 'I am experiencing harassment on Twitter and need legal advice on a restraining order...')"
              className="w-full h-32 p-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Cancel</button>
              <button 
                onClick={handleSendRequest}
                disabled={!message.trim()}
                className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Send size={16} /> Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};