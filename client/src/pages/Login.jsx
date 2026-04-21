import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Shield, User, Eye, EyeOff, TrendingUp, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      onLogin({ username });
      navigate('/dashboard');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-lg w-full relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 finance-gradient rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.3)] mx-auto mb-8 relative group"
          >
            <TrendingUp className="text-white w-10 h-10 group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
          
          <h1 className="text-5xl font-black tracking-tighter mb-3 uppercase italic">
            Quantum <span className="finance-text-gradient italic">Trade Solutions</span>
          </h1>
          <p className="text-slate-500 font-bold tracking-[0.3em] uppercase text-[10px]">Institutional Grade Asset Management</p>
        </div>

        <div className="erp-card p-10 rounded-[3rem] border-white/5 relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-[3rem] pointer-events-none"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <User className="w-3 h-3 text-indigo-400" /> Authorized Identity
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-bold text-slate-200 placeholder:text-slate-700"
                    placeholder="Enter terminal username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Shield className="w-3 h-3 text-indigo-400" /> Security Protocol
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    className="w-full bg-[#0a0a0a] border border-white/5 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-bold text-slate-200 pr-14 placeholder:text-slate-700"
                    placeholder="Enter access sequence"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 finance-gradient text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_50px_-5px_rgba(99,102,241,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  INITIALIZE SESSION
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Secure Environment
            </div>
            <div className="flex items-center gap-2 hover:text-indigo-400 cursor-pointer transition-colors">
              <Briefcase className="w-3 h-3" /> System Logs
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-600 text-[9px] font-bold uppercase tracking-[0.4em]">
            © 2026 Nexus Capital Markets • Restricted Access
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
