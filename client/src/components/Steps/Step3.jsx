import React from 'react';
import { motion } from 'framer-motion';

const Step3 = ({ formData, setFormData, nextStep, prevStep }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.deposit_amount < 100000 || formData.deposit_amount > 5000000) {
      return alert('Amount must be between ₹1,00,000 and ₹50,00,000');
    }
    nextStep();
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black mb-3 finance-text-gradient uppercase tracking-tight italic">Allocations</h2>
        <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-indigo-500/30"></div>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Step 02: Capital Allocation Strategy</p>
            <div className="h-px w-8 bg-indigo-500/30"></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="erp-card p-10 rounded-4xl border-white/5 space-y-12 relative overflow-hidden group">
          <div className="text-center">
            <div className="text-5xl font-black text-white italic tracking-tighter mb-8 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                {formatCurrency(formData.deposit_amount)}
            </div>
            <div className="px-6">
                <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="50000"
                    className="w-full h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    value={formData.deposit_amount}
                    onChange={(e) => setFormData({ ...formData, deposit_amount: parseInt(e.target.value) })}
                />
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest mt-4">
                    <span>min: ₹1L</span>
                    <span>target: 25L</span>
                    <span>max: ₹50L</span>
                </div>
            </div>
          </div>

          <div className="space-y-3 px-6">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1 text-center block">Manual Input Offset</label>
            <input
                type="number"
                required
                min="100000"
                max="5000000"
                className="w-full px-5 py-4 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-sm text-slate-100 placeholder:text-slate-800 text-center"
                value={formData.deposit_amount}
                onChange={(e) => setFormData({ ...formData, deposit_amount: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="flex gap-6">
          <button
            type="button"
            onClick={prevStep}
            className="flex-1 py-5 border border-white/5 bg-white/5 text-slate-400 font-black rounded-2xl hover:bg-white/10 hover:text-white transition-all uppercase text-[10px] tracking-[0.2em]"
          >
            Previous
          </button>
          <button
            type="submit"
            className="flex-2 py-5 finance-gradient text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_50px_-5px_rgba(99,102,241,0.5)] hover:scale-[1.02] transition-all uppercase text-[10px] tracking-[0.2em]"
          >
            Lock Allocation
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default Step3;
