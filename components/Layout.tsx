import React from 'react';
import { Shield, Home, PlusCircle, Users, FileText, LogOut, Menu, X, MessageSquare, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const PanicButton = () => {
  const handlePanic = () => {
    // Immediate redirect to a neutral site
    window.location.href = "https://www.weather.com";
  };

  return (
    <button
      onClick={handlePanic}
      className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-full shadow-xl flex items-center gap-2 font-bold transition-transform hover:scale-105"
      title="Quick Exit (Esc)"
    >
      <LogOut size={24} />
      <span>Quick Exit</span>
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const { connections } = useData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Simple unread indicator mock
  const hasActiveConnections = connections.some(c => c.status === 'active' || c.status === 'pending');

  const NavItem = ({ page, icon: Icon, label }: { page: string; icon: any; label: string }) => (
    <button
      onClick={() => {
        onNavigate(page);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentPage === page
          ? 'bg-brand-50 text-brand-700 font-semibold'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-calm-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2 text-brand-700 font-bold text-xl">
          <Shield className="fill-current" />
          <span>Veritas</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-100 hidden md:flex items-center gap-2 text-brand-700 font-bold text-2xl cursor-pointer" onClick={() => onNavigate('home')}>
          <Shield className="fill-current" size={32} />
          <span>Veritas</span>
        </div>

        <div className="p-4 flex-1 space-y-2 overflow-y-auto">
          {user ? (
            <>
              <div className="px-4 py-2 mb-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Signed in as
                </p>
                <p className="font-medium text-slate-800 truncate">{user.alias || user.name}</p>
                <p className="text-xs text-brand-600 capitalize">{user.role}</p>
              </div>

              <NavItem page="dashboard" icon={Home} label="Dashboard" />
              
              {user.role === 'survivor' && (
                <>
                  <NavItem page="collect" icon={PlusCircle} label="Collect Evidence" />
                  <NavItem page="dossiers" icon={FileText} label="My Dossiers" />
                  <NavItem page="support" icon={Users} label="Find Support" />
                </>
              )}

              {user.role === 'supporter' && (
                 <>
                   {/* Supporter specific links can go here */}
                 </>
              )}

              {(hasActiveConnections || user.role === 'supporter') && (
                 <NavItem page="messages" icon={MessageSquare} label="Messages" />
              )}
            </>
          ) : (
            <>
              <NavItem page="home" icon={Home} label="Home" />
              <NavItem page="support" icon={Users} label="Resources" />
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-100">
          {user ? (
            <button
              onClick={() => {
                logout();
                onNavigate('home');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('login')}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen p-4 md:p-8 relative">
        <div className="max-w-6xl mx-auto pb-24">
          {children}
        </div>
      </main>

      <PanicButton />
    </div>
  );
};