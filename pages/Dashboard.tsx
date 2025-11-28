import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { FileText, Plus, Activity, UserCheck, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { EvidenceCard } from '../components/EvidenceCard';

export const Dashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { evidence, dossiers, connections, updateConnectionStatus } = useData();

  if (user?.role === 'supporter') {
    return <SupporterDashboard onNavigate={onNavigate} connections={connections} updateConnectionStatus={updateConnectionStatus} />;
  }

  return <SurvivorDashboard onNavigate={onNavigate} evidence={evidence} dossiers={dossiers} connections={connections} />;
};

// --- Survivor Dashboard ---
const SurvivorDashboard: React.FC<{ 
  onNavigate: (page: string) => void;
  evidence: any[]; 
  dossiers: any[];
  connections: any[];
}> = ({ onNavigate, evidence, dossiers, connections }) => {
  const criticalItems = evidence.filter(e => e.classification?.severity === 'critical' || e.classification?.severity === 'high').length;
  const recentEvidence = evidence.slice(0, 3);
  const activeConnections = connections.filter(c => c.status === 'active');

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-2">Status of your evidence and support network.</p>
      </header>

      {/* Quick Actions / Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
            onClick={() => onNavigate('collect')}
            className="bg-brand-600 text-white p-6 rounded-xl shadow-lg cursor-pointer hover:bg-brand-700 transition-colors flex flex-col justify-between h-40"
        >
            <div className="bg-brand-500 w-10 h-10 rounded-full flex items-center justify-center">
                <Plus size={24} />
            </div>
            <div>
                <h3 className="font-bold text-xl">Log Evidence</h3>
                <p className="text-brand-100 text-sm">Add screenshots or text</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
            <div className="flex justify-between items-start">
                <div className="bg-red-50 text-red-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <Activity size={24} />
                </div>
                <span className="text-2xl font-bold text-slate-900">{criticalItems}</span>
            </div>
            <div>
                <h3 className="font-bold text-slate-800">High Severity Items</h3>
                <p className="text-slate-500 text-sm">Requires attention</p>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-40">
             <div className="flex justify-between items-start">
                <div className="bg-teal-50 text-teal-600 w-10 h-10 rounded-full flex items-center justify-center">
                    <FileText size={24} />
                </div>
                <span className="text-2xl font-bold text-slate-900">{dossiers.length}</span>
            </div>
            <div>
                <h3 className="font-bold text-slate-800">Generated Dossiers</h3>
                <p className="text-slate-500 text-sm">Ready for export</p>
            </div>
        </div>
      </div>

       {/* Active Connections */}
       {activeConnections.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Active Support</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {activeConnections.map(conn => (
              <div key={conn.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                   <p className="font-bold text-slate-800">Connected Professional</p>
                   <p className="text-xs text-slate-500">Status: {conn.status}</p>
                </div>
                <button 
                  onClick={() => onNavigate('messages')}
                  className="px-4 py-2 bg-brand-100 text-brand-700 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-brand-200"
                >
                  <MessageSquare size={16} /> Chat
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Activity */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Recent Evidence</h2>
            {evidence.length > 0 && (
                <button onClick={() => onNavigate('collect')} className="text-brand-600 text-sm font-semibold hover:underline">
                    Add New
                </button>
            )}
        </div>
        
        {evidence.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Plus size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No evidence logged yet</h3>
                <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start collecting evidence securely. Your data is encrypted and only accessible by you.</p>
                <button onClick={() => onNavigate('collect')} className="text-brand-600 font-bold hover:underline">Start Collection</button>
            </div>
        ) : (
            <div className="grid gap-4">
                {recentEvidence.map(item => (
                    <EvidenceCard key={item.id} item={item} />
                ))}
            </div>
        )}
      </section>

      {/* Support Widget */}
      <section className="bg-indigo-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
            <h2 className="text-2xl font-bold mb-2">Need professional help?</h2>
            <p className="text-indigo-200 max-w-lg">
                Connect anonymously with verified lawyers and therapists who specialize in digital rights and trauma recovery.
            </p>
        </div>
        <button 
            onClick={() => onNavigate('support')}
            className="px-6 py-3 bg-white text-indigo-900 rounded-lg font-bold hover:bg-indigo-50 transition-colors whitespace-nowrap"
        >
            Find a Supporter
        </button>
      </section>
    </div>
  );
};

// --- Supporter Dashboard ---
const SupporterDashboard: React.FC<{ 
  onNavigate: (page: string) => void;
  connections: any[];
  updateConnectionStatus: (id: string, status: any) => void;
}> = ({ onNavigate, connections, updateConnectionStatus }) => {
  const pendingRequests = connections.filter(c => c.status === 'pending');
  const activeCases = connections.filter(c => c.status === 'active');

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Professional Dashboard</h1>
        <p className="text-slate-500 mt-2">Manage your cases and connection requests.</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-3xl font-bold text-brand-600 mb-1">{activeCases.length}</div>
             <div className="text-slate-600 font-medium">Active Cases</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-3xl font-bold text-orange-500 mb-1">{pendingRequests.length}</div>
             <div className="text-slate-600 font-medium">Pending Requests</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="text-3xl font-bold text-slate-900 mb-1">4.9</div>
             <div className="text-slate-600 font-medium">Average Rating</div>
        </div>
      </div>

      {/* Requests */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock size={20} className="text-orange-500" />
          Pending Requests
        </h2>
        {pendingRequests.length === 0 ? (
          <div className="p-8 bg-slate-50 rounded-xl text-center text-slate-500">No pending requests.</div>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{req.survivorAlias}</h3>
                    <p className="text-xs text-slate-400">Requested: {new Date(req.lastUpdated).toLocaleDateString()}</p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Pending Review</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg mb-4 text-slate-700 text-sm italic border-l-4 border-slate-300">
                  "{req.messages[0]?.content}"
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => updateConnectionStatus(req.id, 'active')}
                    className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-bold hover:bg-brand-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Accept Case
                  </button>
                  <button 
                    onClick={() => updateConnectionStatus(req.id, 'closed')}
                    className="flex-1 bg-white text-slate-600 border border-slate-300 py-2 rounded-lg font-bold hover:bg-slate-50 flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Active Cases */}
      <section>
        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <UserCheck size={20} className="text-green-600" />
          Active Cases
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {activeCases.map(c => (
             <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:shadow-md transition-shadow">
               <div>
                 <h3 className="font-bold text-slate-900">{c.survivorAlias}</h3>
                 <p className="text-xs text-slate-500">Last msg: {new Date(c.lastUpdated).toLocaleDateString()}</p>
               </div>
               <button 
                 onClick={() => onNavigate('messages')}
                 className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800"
               >
                 <MessageSquare size={16} /> Open Chat
               </button>
             </div>
          ))}
          {activeCases.length === 0 && (
            <div className="col-span-2 p-8 bg-slate-50 rounded-xl text-center text-slate-500">No active cases.</div>
          )}
        </div>
      </section>
    </div>
  );
};