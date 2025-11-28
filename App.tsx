import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { EvidenceCollection } from './pages/EvidenceCollection';
import { Support } from './pages/Support';
import { Dossiers } from './pages/Dossiers';
import { Messages } from './pages/Messages';
import { Auth } from './pages/Auth';

// Simple Hash Router Implementation for SPA
const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  // Route Guard
  const renderPage = () => {
    // Public Routes
    if (currentPage === 'home') return <Landing onNavigate={setCurrentPage} />;
    if (currentPage === 'login') return <Auth onNavigate={setCurrentPage} initialMode="login" />;
    if (currentPage === 'register-survivor') return <Auth onNavigate={setCurrentPage} initialMode="register" initialRole="survivor" />;
    if (currentPage === 'register-supporter') return <Auth onNavigate={setCurrentPage} initialMode="register" initialRole="supporter" />;
    if (currentPage === 'support') return <Support />;

    // Protected Routes Redirect
    if (!user) {
       return <Landing onNavigate={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'collect':
        return <EvidenceCollection onNavigate={setCurrentPage} />;
      case 'dossiers':
        return <Dossiers onNavigate={setCurrentPage} />;
      case 'messages':
        return <Messages />;
      default:
        return <Landing onNavigate={setCurrentPage} />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}