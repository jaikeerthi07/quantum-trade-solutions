import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, Download, FileText, Wallet, 
  ShieldCheck, Layers, Printer, ArrowLeft, 
  TrendingUp, X, Briefcase, Globe, Phone, Mail
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BillGenerator = ({ plan, customerData, setActiveView }) => {
  const billRef = useRef();
  const [activeDocType, setActiveDocType] = useState('Invoice');
  const [isGenerating, setIsGenerating] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const maskValue = (val, visible = 4) => {
    if (!val) return 'N/A';
    return '*'.repeat(val.length - visible) + val.slice(-visible);
  };

  const downloadPDF = async (type) => {
    setIsGenerating(true);
    setActiveDocType(type);
    
    // Allow React to re-render the hidden template with new type
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const element = billRef.current;
    element.style.display = 'block';
    
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        });
        
        element.style.display = 'none';
        
        const data = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(data);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`QTS_${type}_${customerData.full_name?.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
        console.error('PDF Generation failed:', err);
    } finally {
        setIsGenerating(false);
    }
  };

  const downloadAll = async () => {
    await downloadPDF('Invoice');
    await new Promise(resolve => setTimeout(resolve, 500));
    await downloadPDF('Quotation');
  };

  if (!plan) return (
    <div className="flex flex-col items-center justify-center py-40 text-center space-y-6">
        <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center border border-rose-500/20">
            <X className="w-10 h-10 text-rose-500" />
        </div>
        <div>
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">No Active Plan Detected</h2>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-2">Operational protocols require an active repository selection</p>
        </div>
        <button 
            onClick={() => setActiveView('investment_plans')}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black border border-white/10 rounded-2xl transition-all uppercase text-[10px] tracking-widest"
        >
            <ArrowLeft className="w-4 h-4" /> Return to Terminal
        </button>
    </div>
  );

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto relative px-4 sm:px-0">
      {/* Floating Close Button for convenience */}
      <button 
        onClick={() => setActiveView('investment_plans')}
        className="fixed top-8 right-8 z-50 p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full text-white/50 hover:text-white hover:bg-black transition-all shadow-2xl active:scale-95"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
            <button 
                onClick={() => setActiveView('investment_plans')}
                className="p-4 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
                <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                    Document <span className="finance-text-gradient">Registry</span>
                </h1>
                <div className="flex items-center gap-4 mt-1">
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Finalize institutional commitment protocols</p>
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button 
                onClick={downloadAll}
                disabled={isGenerating}
                className="px-6 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
                <Download className="w-4 h-4" /> Download Both
            </button>
            <button 
                onClick={() => setActiveView('investment_plans')}
                className="px-6 py-4 bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.2em]"
              >
                <X className="w-4 h-4" /> Close
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Invoice Preview */}
        <motion.div 
            whileHover={{ y: -8 }}
            className="erp-card p-10 rounded-[3rem] border-white/5 bg-indigo-500/5 relative overflow-hidden group shadow-2xl"
        >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
                <FileText className="w-48 h-48" />
            </div>
            
            <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Briefcase className="text-white w-7 h-7" />
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest px-1">Doc Type</p>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Service Invoice</h3>
                </div>
            </div>

            <div className="space-y-6 mb-12 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Entity</p>
                        <p className="text-sm font-bold text-slate-200 truncate">{customerData.full_name}</p>
                    </div>
                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">PAN Ref</p>
                        <p className="text-sm font-bold text-slate-200">{maskValue(customerData.pan)}</p>
                    </div>
                </div>
                <div className="p-6 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                    <p className="text-[8px] text-indigo-400 uppercase font-black tracking-widest mb-1">Assignment Value</p>
                    <p className="text-3xl font-black text-white italic">{formatCurrency(plan.amount)}</p>
                </div>
            </div>

            <button 
                onClick={() => downloadPDF('Invoice')}
                disabled={isGenerating}
                className="w-full py-5 finance-gradient text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
                <Download className="w-4 h-4" /> Generate Legal Invoice
            </button>
        </motion.div>

        {/* Quotation Preview */}
        <motion.div 
            whileHover={{ y: -8 }}
            className="erp-card p-10 rounded-[3rem] border-white/5 bg-purple-500/5 relative overflow-hidden group shadow-2xl"
        >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform pointer-events-none">
                <TrendingUp className="w-48 h-48" />
            </div>

            <div className="flex justify-between items-start mb-10">
                <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <TrendingUp className="text-white w-7 h-7" />
                </div>
                <div className="text-right">
                    <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest px-1">Doc Type</p>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Growth Quotation</h3>
                </div>
            </div>

            <div className="space-y-6 mb-12 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Tier</p>
                        <p className="text-sm font-bold text-slate-200">{plan.tier}</p>
                    </div>
                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                        <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1">Aadhaar</p>
                        <p className="text-sm font-bold text-slate-200">{maskValue(customerData.aadhaar)}</p>
                    </div>
                </div>
                <div className="p-6 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                    <p className="text-[8px] text-purple-400 uppercase font-black tracking-widest mb-1">Est. Portfolio Value (12M)</p>
                    <p className="text-3xl font-black text-white italic">{formatCurrency(plan.amount * 1.36)}</p>
                </div>
            </div>

            <button 
                onClick={() => downloadPDF('Quotation')}
                disabled={isGenerating}
                className="w-full py-5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
                <Download className="w-4 h-4" /> Generate Strategic Quotation
            </button>
        </motion.div>
      </div>

      <div className="erp-card p-10 rounded-[3rem] border-indigo-500/10 flex flex-col md:flex-row items-center gap-10 group bg-[#0a0a0a]">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-4xl flex items-center justify-center border border-indigo-500/20 shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <ShieldCheck className="w-10 h-10 text-indigo-400" />
          </div>
          <div className="space-y-3">
              <h4 className="text-lg font-black text-white uppercase tracking-widest italic">Institutional Compliance Finalized</h4>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] leading-relaxed max-w-2xl">
                  These documents are generated under the <span className="text-indigo-400 italic">Nexus Alpha Protocol</span>. Any tampering with the cryptographic signatures or assignment values will invalidate the capital placement.
              </p>
          </div>
          <div className="md:ml-auto">
              <div className="flex -space-x-4">
                  {[1,2,3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-[#0a0a0a] bg-slate-800 flex items-center justify-center overflow-hidden">
                          <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="Verifier" className="w-full h-full grayscale opacity-50" />
                      </div>
                  ))}
              </div>
              <p className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-3 text-center">Protocol Verifiers</p>
          </div>
      </div>

      {/* Hidden Master Template for PDF Generation */}
      <div 
        ref={billRef}
        style={{ 
            display: 'none', 
            width: '800px', 
            padding: '60px', 
            backgroundColor: '#ffffff', 
            position: 'absolute', 
            top: 0, 
            left: 0,
            fontFamily: 'Inter, sans-serif'
        }}
      >
        <div style={{ border: '1px solid #f1f5f9', padding: '50px', position: 'relative' }}>
          {/* Header Watermark */}
          <div style={{ position: 'absolute', top: '50px', right: '50px', opacity: 0.1, pointerEvents: 'none' }}>
             {activeDocType === 'Invoice' ? <FileText size={120} /> : <TrendingUp size={120} />}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '80px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(99,102,241,0.2)' }}>
                <Layers style={{ color: '#fff', width: '35px', height: '35px' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '-1px' }}>
                  Quantum <span style={{ color: '#6366f1' }}>Trade Solutions</span>
                </h1>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0, fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px' }}>Institutional Asset Management</p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: activeDocType === 'Invoice' ? '#6366f1' : '#a855f7', margin: '0 0 5px 0', textTransform: 'uppercase' }}>
                {activeDocType === 'Invoice' ? 'Service Invoice' : 'Strategic Quotation'}
              </h2>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, fontWeight: '700' }}>#{activeDocType === 'Invoice' ? 'INV' : 'QT'}-{Math.random().toString(36).substring(7).toUpperCase()}</p>
              <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, fontWeight: '700' }}>DATE: {new Date().toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
            <div>
                <h3 style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>Issued By</h3>
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: '0 0 5px 0' }}>Quantum Trade Solutions</p>
                <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                    Gandhi Nagar,<br />
                    Karnataka, India<br />
                    <span style={{ fontWeight: '700' }}>CIN:</span> U74140KA2026PTC123456
                </p>
            </div>
            <div>
                <h3 style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '5px' }}>Issued To</h3>
                <p style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: '0 0 5px 0' }}>{customerData.full_name}</p>
                <div style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                    <p style={{ margin: '0 0 2px 0' }}><span style={{ fontWeight: '700' }}>Mobile:</span> +91 {customerData.mobile}</p>
                    <p style={{ margin: '0 0 2px 0' }}><span style={{ fontWeight: '700' }}>PAN Ref:</span> {maskValue(customerData.pan)}</p>
                    <p style={{ margin: '0 0 2px 0' }}><span style={{ fontWeight: '700' }}>Aadhaar Ref:</span> {maskValue(customerData.aadhaar)}</p>
                </div>
            </div>
          </div>

          <div style={{ marginBottom: '60px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #f1f5f9', background: '#f8fafc' }}>
                        <th style={{ textAlign: 'left', padding: '15px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b' }}>Description</th>
                        <th style={{ textAlign: 'right', padding: '15px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b' }}>Tier</th>
                        <th style={{ textAlign: 'right', padding: '15px', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#64748b' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '25px 15px', borderBottom: '1px solid #f1f5f9' }}>
                            <p style={{ fontSize: '13px', fontWeight: '800', color: '#1e293b', margin: '0 0 5px 0' }}>{activeDocType === 'Invoice' ? 'Capital Assignment Service' : 'Portfolio Growth Strategy'}</p>
                            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, lineHeight: '1.5', maxWidth: '300px' }}>
                                {activeDocType === 'Invoice' 
                                  ? 'Institutional grade capital placement orchestration with 3% recurring monthly growth protection.'
                                  : 'Predictive ML-based growth forecasting for a high-velocity capital repository.'}
                            </p>
                        </td>
                        <td style={{ textAlign: 'right', padding: '25px 15px', borderBottom: '1px solid #f1f5f9', fontSize: '12px', fontWeight: '700', color: '#6366f1' }}>{plan?.tier}</td>
                        <td style={{ textAlign: 'right', padding: '25px 15px', borderBottom: '1px solid #f1f5f9', fontSize: '16px', fontWeight: '900', color: '#0f172a' }}>{formatCurrency(plan?.amount)}</td>
                    </tr>
                </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '80px' }}>
            <div style={{ width: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', padding: '0 10px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', margin: 0 }}>Subtotal</p>
                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{formatCurrency(plan?.amount)}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '0 10px' }}>
                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#64748b', margin: 0 }}>GST (0%)</p>
                    <p style={{ fontSize: '11px', fontWeight: '800', color: '#1e293b', margin: 0 }}>₹0</p>
                </div>
                <div style={{ background: activeDocType === 'Invoice' ? '#6366f1' : '#a855f7', padding: '20px', borderRadius: '12px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', margin: 0, opacity: 0.8 }}>Total Value</p>
                    <p style={{ fontSize: '22px', fontWeight: '900', margin: 0 }}>{formatCurrency(plan?.amount)}</p>
                </div>
            </div>
          </div>

          {activeDocType === 'Quotation' && (
            <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '20px', marginBottom: '60px', borderLeft: '5px solid #a855f7' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', marginBottom: '15px' }}>Strategic Growth Forecast (12 Months)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    <div>
                        <p style={{ fontSize: '9px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Start Balance</p>
                        <p style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{formatCurrency(plan?.amount)}</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '9px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Est. Annual ROI</p>
                        <p style={{ fontSize: '14px', fontWeight: '800', color: '#22c55e', margin: 0 }}>+36.4%</p>
                    </div>
                    <div>
                        <p style={{ fontSize: '9px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginBottom: '5px' }}>Ending Portfolio</p>
                        <p style={{ fontSize: '14px', fontWeight: '800', color: '#6366f1', margin: 0 }}>{formatCurrency(plan?.amount * 1.364)}</p>
                    </div>
                </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', borderTop: '1px solid #f1f5f9', paddingTop: '40px' }}>
            <div>
                <p style={{ fontSize: '8px', color: '#94a3b8', lineHeight: '1.6', margin: 0 }}>
                    This document is digitally signed and valid for 72 hours from the date of issue.
                    Quantum Trade Solutions is a SEBI registered entity operating under the 
                    portfolio management regulations of 2026.
                </p>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '150px', height: '60px', marginLeft: 'auto', borderBottom: '1px solid #e2e8f0', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <p style={{ fontFamily: 'Dancing Script, cursive', fontSize: '20px', color: '#1e293b', margin: 0, opacity: 0.8 }}>QTS Authorized</p>
                </div>
                <p style={{ fontSize: '9px', fontWeight: '900', color: '#0f172a', textTransform: 'uppercase', margin: 0 }}>Authorized Authority</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillGenerator;
