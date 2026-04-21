import React from 'react';
import { motion } from 'framer-motion';

const Step4 = ({ formData, handleSubmit, prevStep, loading }) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
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
        <h2 className="text-4xl font-black mb-3 finance-text-gradient uppercase tracking-tight italic">Review Profile</h2>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-8 bg-indigo-500/30"></div>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Step 03: Final Security Validation</p>
          <div className="h-px w-8 bg-indigo-500/30"></div>
        </div>
      </div>

      <div className="erp-card p-10 rounded-4xl border-white/5 space-y-6 mb-10 relative overflow-hidden group">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Full Entity Name</p>
            <p className="text-lg font-bold text-slate-100 italic">{formData.full_name}</p>
          </div>

          <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Mobile Access</p>
            <p className="text-lg font-bold text-slate-100">{formData.mobile}</p>
          </div>

          <div className="p-6 bg-black/40 rounded-2xl border border-white/5">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Vault Status (PAN)</p>
            <p className="text-lg font-bold text-indigo-400 font-mono tracking-widest">{maskValue(formData.pan)}</p>
          </div>

          <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
            <p className="text-[9px] text-indigo-400/50 uppercase font-black tracking-widest mb-1">Total Allocation</p>
            <p className="text-2xl font-black text-white italic">{formatCurrency(formData.deposit_amount)}</p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative mt-1">
              <input
                type="checkbox"
                required
                className="peer hidden"
                checked={formData.agreed_terms}
                onChange={(e) => handleSubmit(e, 'checkbox')}
              />
              <div className="w-5 h-5 border-2 border-slate-700 rounded bg-black/40 peer-checked:bg-indigo-500 peer-checked:border-indigo-500 transition-all flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-loose group-hover:text-slate-300 transition-colors">
              I acknowledge the <span className="text-indigo-400 underline italic">Risk Disclosure Protocol</span> and agree to the Terms & Conditions of the Quantum Trade System.
            </span>
          </label>
        </div>
      </div>

      <div className="flex gap-6">
        <button
          type="button"
          onClick={prevStep}
          disabled={loading}
          className="flex-1 py-5 border border-white/5 bg-white/5 text-slate-400 font-black rounded-2xl hover:bg-white/10 hover:text-white transition-all uppercase text-[10px] tracking-[0.2em] disabled:opacity-30"
        >
          Edit Strategy
        </button>
        <button
          onClick={(e) => handleSubmit(e, 'submit')}
          disabled={loading || !formData.agreed_terms}
          className="flex-2 py-5 finance-gradient text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_50px_-5px_rgba(99,102,241,0.5)] hover:scale-[1.02] transition-all uppercase text-[10px] tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>Execute Confirmation</>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Step4;
