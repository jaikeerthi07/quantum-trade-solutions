import React from 'react';
import Sidebar from '../components/Sidebar';
import { ShieldCheck } from 'lucide-react';

const DashboardLayout = ({ children, onLogout, activeView, setActiveView }) => {
  return (
    <div className="flex bg-[#050505] min-h-screen text-slate-200">
      <Sidebar onLogout={onLogout} activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-purple-900/10 rounded-full blur-[120px] -z-10 animate-pulse-slow"></div>

        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl sticky top-0 z-30">
          <div>
            <h2 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Vault Status</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
              <span className="text-xs font-black text-slate-200 tracking-tight uppercase">Quantum Trade Solutions Terminal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Mutual Fund Protocol Active</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>

        {/* Footer Info */}
        <footer className="px-8 py-6 border-t border-white/5 text-center">
          <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[0.4em]">
            © 2026 Nexus Capital Markets • Global Compliance Dashboard
          </p>
        </footer>
      </main>
    </div>
  );
};

export default DashboardLayout;
