import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { Activity } from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080B10] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-emerald-400 flex items-center justify-center animate-pulse shadow-lg shadow-brand-500/20">
          <Activity className="w-5 h-5 text-black" />
        </div>
        <p className="text-xs font-mono text-slate-400">Loading DropyHub Partner Portal...</p>
      </div>
    );
  }

  return user ? <DashboardPage /> : <LoginPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
