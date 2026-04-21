import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Users, Search, Mail, Phone, CreditCard, 
  Calendar, CheckCircle, Shield, Briefcase, ShieldCheck, 
  TrendingUp, Eye, EyeOff, Trash2, Fingerprint, Lock
} from 'lucide-react';
import axios from 'axios';

const Customers = ({ onStartOnboarding }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Visibility toggles for form
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showPan, setShowPan] = useState(false);
  
  // Visibility for ledger records
  const [visibleVaults, setVisibleVaults] = useState({});

  const toggleVault = (id) => {
    setVisibleVaults(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const [formData, setFormData] = useState({
    custom_id: '',
    full_name: '',
    date_of_joining: new Date().toISOString().split('T')[0],
    email: '',
    mobile: '',
    aadhaar: '',
    pan: '',
    referral_code: ''
  });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('/api/users');
      setCustomers(res.data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/users', formData);
      setFormData({
        custom_id: '',
        full_name: '',
        date_of_joining: new Date().toISOString().split('T')[0],
        email: '',
        mobile: '',
        aadhaar: '',
        pan: '',
        referral_code: ''
      });
      await fetchCustomers();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create record';
      const details = err.response?.data?.details ? `\nDetails: ${err.response.data.details}` : '';
      alert(`${errorMsg}${details}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('CRITICAL: Delete this institutional record forever?')) return;
    try {
        await axios.delete(`/api/users/${id}`);
        await fetchCustomers();
    } catch (err) {
        alert('Failed to purge record');
    }
  };

  return (
    <div className="space-y-10 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">
            Quantum <span className="finance-text-gradient italic">Trade Solutions</span>
          </h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="h-[2px] w-12 finance-gradient"></div>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Institutional Ledger Terminal v4.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="erp-card px-8 py-4 rounded-3xl flex items-center gap-4 border-indigo-500/20">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Portfolios</p>
                    <span className="text-xl font-black text-slate-100 italic tracking-tighter">{customers.length} RECORDS</span>
                </div>
            </div>
        </div>
      </div>

      {/* Horizontal Registration Form */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="erp-card p-10 rounded-4xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
            <UserPlus className="w-32 h-32" />
          </div>

          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
            <TrendingUp className="w-4 h-4 text-indigo-400" /> Authorized Entity Registration
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
              {/* ID & Date Row */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Customer ID</label>
                <div className="relative">
                    <input 
                    type="text" required placeholder="CUST-000"
                    className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100 placeholder:text-slate-800"
                    value={formData.custom_id}
                    onChange={(e) => setFormData({...formData, custom_id: e.target.value.toUpperCase()})}
                    />
                    <Eye className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 opacity-20" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Joining Date</label>
                <input 
                  type="date" required
                  className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100"
                  value={formData.date_of_joining}
                  onChange={(e) => setFormData({...formData, date_of_joining: e.target.value})}
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Full Legal Name</label>
                <div className="relative">
                    <input 
                    type="text" required placeholder="Enter primary authorize name"
                    className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100 placeholder:text-slate-800"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    />
                    <Eye className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 opacity-20" />
                </div>
              </div>

              {/* Contact & Docs Row */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Email Access</label>
                <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                    <input 
                        type="email" required placeholder="client@address.com"
                        className="w-full pl-12 pr-12 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100 placeholder:text-slate-800"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <Eye className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 opacity-20" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Mobile Access</label>
                <div className="relative">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700" />
                    <input 
                        type="text" required maxLength="10" placeholder="Primary contact"
                        className="w-full pl-12 pr-12 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100 placeholder:text-slate-800"
                        value={formData.mobile}
                        onChange={(e) => setFormData({...formData, mobile: e.target.value.replace(/\D/g, '')})}
                    />
                    <Eye className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 opacity-20" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Aadhaar Vault</label>
                <div className="relative">
                    <input 
                    type={showAadhaar ? "text" : "password"} required maxLength="12" placeholder="Primary ID number"
                    className="w-full px-5 pr-12 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100"
                    value={formData.aadhaar}
                    onChange={(e) => setFormData({...formData, aadhaar: e.target.value.replace(/\D/g, '')})}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowAadhaar(!showAadhaar)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors"
                    >
                        {showAadhaar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">PAN Vault</label>
                <div className="relative">
                    <input 
                    type={showPan ? "text" : "password"} required maxLength="10" placeholder="Secondary ID sequence"
                    className="w-full px-5 pr-12 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100 uppercase"
                    value={formData.pan}
                    onChange={(e) => setFormData({...formData, pan: e.target.value.toUpperCase()})}
                    />
                    <button 
                        type="button"
                        onClick={() => setShowPan(!showPan)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors"
                    >
                        {showPan ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Referral Code</label>
                <div className="relative">
                    <input 
                    type="text" placeholder="REF-CODE"
                    className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100 placeholder:text-slate-800"
                    value={formData.referral_code}
                    onChange={(e) => setFormData({...formData, referral_code: e.target.value.toUpperCase()})}
                    />
                    <TrendingUp className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 opacity-20" />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="px-12 py-5 finance-gradient text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_50px_-5px_rgba(99,102,241,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
              >
                {loading ? 'Committing...' : (
                  <>
                    <CheckCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
                    AUTHORIZE PROFILE
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Full-Width Secured Ledger */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full"
      >
        <div className="erp-card p-10 rounded-4xl h-full relative overflow-hidden flex flex-col">
          <div className="absolute bottom-0 right-0 p-10 opacity-[0.03]">
            <Shield className="w-80 h-80" />
          </div>

          <div className="flex items-center justify-between mb-10">
            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-4">
              <span className="flex items-center gap-4"><div className="w-8 h-[2px] finance-gradient"></div> Secured Ledger</span>
            </h2>
            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{customers.length} RECORDS SYNCED</span>
            </div>
          </div>

          {fetching ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-6">
              <div className="w-12 h-12 border-4 border-white/5 border-t-indigo-500 rounded-full animate-spin"></div>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Synchronizing Portfolio Ledger...</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 grayscale opacity-10 text-center">
              <Users className="w-24 h-24 mb-6" />
              <p className="font-black uppercase tracking-[0.4em] text-sm">Registry Empty</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
              <AnimatePresence mode="popLayout">
              {customers.map((customer) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  key={customer.id}
                  className="p-8 bg-white/5 rounded-4xl border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 transition-all group relative overflow-hidden"
                >
                  <div className="flex flex-col h-full gap-6">
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 bg-[#0a0a0a] border border-white/5 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/10 group-hover:scale-110 transition-all duration-500">
                        <Users className="w-7 h-7 text-indigo-400" />
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded text-[9px] font-black uppercase tracking-widest">
                            {customer.custom_id}
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => onStartOnboarding(customer)}
                                className="p-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-lg transition-all flex items-center gap-2 group/btn"
                            >
                                <TrendingUp className="w-3.5 h-3.5" />
                                <span className="text-[8px] font-black uppercase tracking-widest hidden group-hover/btn:block">Invest</span>
                            </button>
                            <button 
                                onClick={() => toggleVault(customer.id)}
                                className={`p-2 rounded-lg transition-all ${visibleVaults[customer.id] ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-500 hover:text-indigo-400'}`}
                            >
                                {visibleVaults[customer.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button 
                                onClick={() => handleDelete(customer.id)}
                                className="p-2 bg-white/5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-black text-slate-100 uppercase tracking-tight text-xl mb-6 group-hover:finance-text-gradient transition-all">{customer.full_name}</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-slate-500 bg-black/20 p-4 rounded-2xl border border-white/5 group-hover:border-indigo-500/10 transition-all">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-indigo-400/50" />
                                <span className="text-[11px] font-bold tracking-tight text-slate-300">{customer.email}</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 bg-black/20 p-4 rounded-2xl border border-white/5 group-hover:border-indigo-500/10 transition-all">
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-indigo-400/50" />
                                <span className="text-[11px] font-bold tracking-tight text-slate-300">{customer.mobile}</span>
                            </div>
                        </div>

                        {/* Vault Data */}
                        <motion.div 
                            animate={{ height: visibleVaults[customer.id] ? 'auto' : 0, opacity: visibleVaults[customer.id] ? 1 : 0 }}
                            className="overflow-hidden space-y-3"
                        >
                            <div className="flex items-center justify-between text-slate-500 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                                <div className="flex items-center gap-3">
                                    <Fingerprint className="w-4 h-4 text-indigo-400" />
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Aadhaar Vault</span>
                                        <span className="text-[11px] font-mono font-bold text-indigo-100">{customer.aadhaar}</span>
                                    </div>
                                </div>
                                <Shield className="w-3.5 h-3.5 text-indigo-400/50" />
                            </div>
                            <div className="flex items-center justify-between text-slate-500 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-4 h-4 text-indigo-400" />
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">PAN Vault</span>
                                        <span className="text-[11px] font-mono font-bold text-indigo-100">{customer.pan}</span>
                                    </div>
                                </div>
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400/50" />
                            </div>
                            {customer.referral_code && (
                                <div className="flex items-center justify-between text-slate-500 bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-4 h-4 text-indigo-400" />
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Referral Attribution</span>
                                            <span className="text-[11px] font-mono font-bold text-indigo-100">{customer.referral_code}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {!visibleVaults[customer.id] && (
                            <div className="flex items-center gap-2 justify-center py-2 opacity-30">
                                <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                                <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                                <div className="w-1 h-1 rounded-full bg-slate-500"></div>
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                    Joined: {customer.date_of_joining ? new Date(customer.date_of_joining).toLocaleDateString() : 'N/A'}
                                </span>
                            </div>
                            <Shield className="w-4 h-4 text-green-500/30" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Hover Trace Effect */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-indigo-500 group-hover:w-full transition-all duration-700"></div>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Customers;
