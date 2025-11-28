import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Send, User, ShieldCheck } from 'lucide-react';

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { connections, sendMessage, supporters } = useData();
  const [activeConnectionId, setActiveConnectionId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter relevant connections
  const myConnections = connections.filter(c => 
    user?.role === 'survivor' ? c.survivorId === user.id : c.supporterId === user?.id
  );

  // Auto-select first connection if none selected
  useEffect(() => {
    if (!activeConnectionId && myConnections.length > 0) {
      setActiveConnectionId(myConnections[0].id);
    }
  }, [myConnections, activeConnectionId]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConnectionId, myConnections]);

  const activeConnection = myConnections.find(c => c.id === activeConnectionId);

  // Helper to get display name for the chat header
  const getChatPartnerName = (connection: any) => {
    if (user?.role === 'survivor') {
      const supporter = supporters.find(s => s.id === connection.supporterId);
      return supporter?.name || 'Supporter';
    } else {
      return connection.survivorAlias;
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConnectionId || !inputText.trim()) return;
    sendMessage(activeConnectionId, inputText);
    setInputText('');
  };

  if (myConnections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400">
        <div className="text-center">
            <h2 className="text-xl font-bold text-slate-600 mb-2">No active conversations</h2>
            <p>Connect with a supporter to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-slate-100 bg-slate-50 flex flex-col">
        <div className="p-4 border-b border-slate-200 font-bold text-slate-700">Conversations</div>
        <div className="overflow-y-auto flex-1">
          {myConnections.map(conn => (
            <button
              key={conn.id}
              onClick={() => setActiveConnectionId(conn.id)}
              className={`w-full text-left p-4 border-b border-slate-100 hover:bg-white transition-colors ${activeConnectionId === conn.id ? 'bg-white border-l-4 border-brand-500' : ''}`}
            >
              <div className="font-bold text-slate-800 text-sm truncate">{getChatPartnerName(conn)}</div>
              <div className="text-xs text-slate-500 truncate mt-1">
                {conn.messages[conn.messages.length - 1]?.content || 'No messages'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConnection ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                  {user?.role === 'survivor' ? <ShieldCheck /> : <User />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{getChatPartnerName(activeConnection)}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Secure Connection
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {activeConnection.messages.map(msg => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-xl text-sm ${
                      isMe 
                        ? 'bg-brand-600 text-white rounded-tr-none' 
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-100 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a secure message..."
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-brand-600 text-white p-3 rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">Select a conversation</div>
        )}
      </div>
    </div>
  );
};