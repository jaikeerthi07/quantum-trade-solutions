import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Step2 = ({ formData, setFormData, nextStep, prevStep }) => {
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showPan, setShowPan] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.mobile.match(/^[0-9]{10}$/)) return alert('Invalid mobile number');
    if (!formData.aadhaar.match(/^[0-9]{12}$/)) return alert('Invalid Aadhaar number');
    if (!formData.pan.match(/[A-Z]{5}[0-9]{4}[A-Z]/)) return alert('Invalid PAN format');
    nextStep();
  };

  const maskValue = (val, length) => {
    if (!val) return '';
    return '*'.repeat(val.length - 4) + val.slice(-4);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black mb-3 finance-text-gradient uppercase tracking-tight italic">KYC Verification</h2>
        <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-indigo-500/30"></div>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Step 01: Secure Identity Authentication</p>
            <div className="h-px w-8 bg-indigo-500/30"></div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="erp-card p-10 rounded-4xl border-white/5 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
            <Eye className="w-32 h-32" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Mobile Access Key</label>
              <div className="relative">
                <input
                    type="text"
                    required
                    maxLength="10"
                    placeholder="Enter 10-digit number"
                    className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100 placeholder:text-slate-800"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Aadhaar Vault Sequence</label>
              <div className="relative">
                <input
                    type={showAadhaar ? "text" : "password"}
                    required
                    maxLength="12"
                    placeholder="12-digit vault ID"
                    className="w-full px-5 pr-12 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100 placeholder:text-slate-800"
                    value={formData.aadhaar}
                    onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value.replace(/\D/g, '') })}
                />
                <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors"
                    onClick={() => setShowAadhaar(!showAadhaar)}
                >
                    {showAadhaar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-3 md:col-span-2">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">PAN Vault Sequence</label>
              <div className="relative">
                <input
                    type={showPan ? "text" : "password"}
                    required
                    maxLength="10"
                    placeholder="Enter alphanumeric PAN"
                    className="w-full px-5 pr-12 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100 uppercase placeholder:text-slate-800"
                    value={formData.pan}
                    onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
                />
                <button
                    type="button"
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-indigo-400 transition-colors"
                    onClick={() => setShowPan(!showPan)}
                >
                    {showPan ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-5 border border-white/5 bg-white/5 text-slate-400 font-black rounded-2xl hover:bg-white/10 hover:text-white transition-all uppercase text-[10px] tracking-[0.2em]"
          >
            Abort Protocol
          </button>
          <button
            type="submit"
            className="flex-2 py-5 finance-gradient text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_50px_-5px_rgba(99,102,241,0.5)] hover:scale-[1.02] transition-all uppercase text-[10px] tracking-[0.2em]"
          >
            Validate Identity
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Step2;
