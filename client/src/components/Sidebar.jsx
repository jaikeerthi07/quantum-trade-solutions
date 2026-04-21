import React from 'react';
import {
  Users,
  Shield,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Settings,
  LogOut,
  Layers,
  Briefcase,
  FileText,
  ArrowDownCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ onLogout, activeView, setActiveView }) => {
  const navItems = [
    { id: 'registry', name: 'Client Registry', icon: Users },
    { id: 'investment_plans', name: 'Investment Plans', icon: FileCheck },
    { id: 'billing', name: 'Billing', icon: FileText },
    { id: 'quotation', name: 'Quotation', icon: TrendingUp },
    { id: 'withdraw', name: 'Withdrawals', icon: ArrowDownCircle },
    { id: 'security', name: 'Access Control', icon: Shield },
  ];

  return (
    <aside className="w-80 h-screen bg-[#0a0a0a] border-r border-white/5 flex flex-col sticky top-0 z-40">
      {/* Sidebar Header */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 finance-gradient rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic">
            Quantum <span className="finance-text-gradient italic">Trade Solutions</span>
          </span>
        </div>

        <div className="bg-white/5 p-5 rounded-4xl border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:rotate-12 transition-transform">
            <Briefcase className="w-12 h-12" />
          </div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Authenticated Terminal</p>
          <div className="text-sm font-bold text-slate-200 tracking-tight uppercase">Institutional v4.2</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 mt-12 space-y-16 overflow-y-auto custom-scrollbar pb-20">
        <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] px-4 mb-6">
          System Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === activeView;
          return (
            <div
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex items-center gap-4 px-5 py-4 rounded-3xl transition-all duration-500 group cursor-pointer
                ${isActive ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                ${isActive ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'bg-[#0a0a0a] border border-white/5 group-hover:border-white/20'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className={`text-xs font-black tracking-widest uppercase ${isActive ? 'text-slate-100' : ''}`}>
                  {item.name}
                </div>
              </div>
              {isActive && (
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-6 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/5 transition-all rounded-3xl group font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-rose-500/10"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
