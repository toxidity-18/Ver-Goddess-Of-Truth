import React from 'react';
import { Shield, Lock, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Landing: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();

  // If already logged in, show 'Go to Dashboard'
  if (user) {
    onNavigate('dashboard');
    return null;
  }

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="text-center py-16 space-y-6">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
          Reclaim Your <span className="text-brand-600">Digital Safety</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Veritas helps you securely collect evidence of online harassment, analyze it with AI, and connect with verified professionals who can help.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button 
            onClick={() => onNavigate('register-survivor')}
            className="px-8 py-4 bg-brand-600 text-white rounded-lg font-bold shadow-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2"
          >
            I Need Help (Survivor) <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => onNavigate('register-supporter')}
            className="px-8 py-4 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold hover:bg-slate-50 transition-colors"
          >
            I Want to Help (Professional)
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-4">
          <Lock size={14} className="inline mr-1" />
          Secure, Encrypted & Anonymous by default
        </p>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
            <Shield size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Collection</h3>
          <p className="text-slate-600">
            Log evidence securely. We generate a digital chain of custody hash for every item, creating a timeline that stands up to scrutiny.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
            <CheckCircle size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">AI Analysis</h3>
          <p className="text-slate-600">
            Our AI engine classifies threats, determines severity, and organizes chaos into structured, actionable episodes.
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-6">
            <Users size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Support</h3>
          <p className="text-slate-600">
            Connect anonymously with vetted lawyers, therapists, and NGOs who specialize in digital abuse cases.
          </p>
        </div>
      </section>

      {/* Stats/Trust */}
      <section className="bg-slate-900 text-white rounded-3xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-8">Empowering Survivors Globally</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-brand-400 mb-2">10k+</div>
            <div className="text-slate-400">Evidence Items Secured</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-400 mb-2">500+</div>
            <div className="text-slate-400">Verified Supporters</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-brand-400 mb-2">100%</div>
            <div className="text-slate-400">Client-Side Privacy</div>
          </div>
        </div>
      </section>
    </div>
  );
};