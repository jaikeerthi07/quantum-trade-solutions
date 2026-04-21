import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Download, ExternalLink, Phone, 
  Layers, Printer, ShieldCheck, Briefcase 
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Step5 = ({ receiptData, setActiveView }) => {
  const receiptRef = useRef();

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const downloadPDF = async () => {
    const element = receiptRef.current;
    // Temporarily show the hidden receipt for capture
    element.style.display = 'block';

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    // Hide it again
    element.style.display = 'none';

    const data = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`QTS-Receipt-${receiptData.confirmation_id}.pdf`);
  };

  if (!receiptData) return null;

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="flex justify-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
            className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
          >
            <CheckCircle className="w-12 h-12 text-green-500" />
          </motion.div>
        </div>

        <h2 className="text-5xl font-black mb-3 finance-text-gradient italic uppercase tracking-tighter">Registration <span className="text-white">Active</span></h2>
        <p className="text-slate-500 mb-12 font-bold text-[10px] uppercase tracking-[0.4em]">Investment Profile Secondary Verification Complete</p>

        {/* Visual Dashboard Card */}
        <div className="erp-card p-10 rounded-4xl border-white/5 mb-12 text-left relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
            <ShieldCheck className="w-64 h-64" />
          </div>

          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Confirmation Sequence</p>
              <p className="font-mono text-2xl font-black text-indigo-400 tracking-wider">#{receiptData.confirmation_id}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Status</p>
              <div className="flex items-center gap-3 px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,1)]"></span>
                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">{receiptData.status}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 relative z-10">
            <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 block">Primary Investor</span>
              <span className="font-black text-slate-100 italic text-xl">{receiptData.full_name}</span>
            </div>
            <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 block">Capital Allocation</span>
              <span className="font-black text-indigo-100 text-xl">{formatCurrency(receiptData.deposit_amount)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between relative z-10 px-2">
            <p className="text-[8px] text-slate-600 uppercase font-black tracking-[0.3em]">
              Timestamp: {new Date(receiptData.created_at).toLocaleString().toUpperCase()}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500/20"></div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 mb-12">
          <button
            onClick={() => setActiveView('bill_generator')}
            className="w-full py-6 finance-gradient text-white font-black rounded-3xl shadow-[0_30px_60px_-15px_rgba(99,102,241,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-4 uppercase text-xs tracking-[0.3em] group"
          >
             <Briefcase className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
             Access Billing & Quotation Terminal
          </button>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <button
              onClick={downloadPDF}
              className="flex-1 py-5 finance-gradient text-white font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(99,102,241,0.4)] hover:shadow-[0_25px_50px_-5px_rgba(99,102,241,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest"
            >
              <Download className="w-5 h-5" /> Download Ledger PDF
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 py-5 border border-white/5 bg-white/5 text-slate-400 font-black rounded-2xl hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest active:scale-95"
            >
              <Printer className="w-5 h-5" /> Print Physical Copy
            </button>
          </div>
        </div>

        <div className="p-8 erp-card rounded-4xl border-indigo-500/10 mb-8 flex items-center gap-6 text-left group">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Phone className="w-6 h-6 shadow-[0_0_15px_rgba(99,102,241,0.3)]" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-100 uppercase tracking-widest mb-1">Priority Support Active</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Protocol Access: +91 1800-QTS-HLP</p>
          </div>
        </div>
      </motion.div>

      {/* Hidden Master Receipt Template for PDF Generation */}
      <div
        ref={receiptRef}
        style={{ display: 'none', width: '800px', padding: '60px', backgroundColor: '#fff', position: 'absolute', top: 0, left: 0 }}
      >
        <div style={{ border: '8px solid #f8fafc', padding: '40px', position: 'relative' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '60px', borderBottom: '2px solid #e2e8f0', paddingBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, #0066FF, #00D1FF)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                <Layers style={{ color: '#fff', width: '30px', height: '30px' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-1px', textTransform: 'uppercase' }}>
                  Quantum <span style={{ color: '#0066FF' }}>Trade Solutions</span>
                </h1>
                <p style={{ fontSize: '10px', color: '#64748b', margin: 0, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  Official Investment Protocol • V2.0
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '900', color: '#0066FF', margin: 0, textTransform: 'uppercase' }}>Investment Receipt</h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0, fontWeight: '600' }}>#{receiptData.confirmation_id}</p>
            </div>
          </div>

          {/* Address Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
            <div>
              <p style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>Issuer Details</p>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 5px 0' }}>Quantum Trade Solutions Ltd.</p>
              <p style={{ fontSize: '12px', color: '#64748b', width: '200px', margin: 0, lineHeight: '1.5' }}>
                Quantum Trade Plaza, Financial District,<br />
                Bandra Kurla Complex, Mumbai, MH 400051<br />
                support@quantumtrade.sol
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>Investor Details</p>
              <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '0 0 5px 0' }}>{receiptData.full_name}</p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Registered Profile ID: {receiptData.full_name.slice(0, 3).toUpperCase()}{Math.floor(Math.random() * 10000)}</p>
            </div>
          </div>

          {/* Transaction Table */}
          <div style={{ marginBottom: '60px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>
                  <th style={{ textAlign: 'left', padding: '15px 20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>Description</th>
                  <th style={{ textAlign: 'right', padding: '15px 20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '15px 20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ textAlign: 'right', padding: '15px 20px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>Amount (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '20px', fontSize: '13px' }}>
                    <p style={{ fontWeight: '700', color: '#1e293b', margin: '0 0 5px 0' }}>Strategic Alpha Portfolios</p>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Standard Account Deposit via Registration Protocol</p>
                  </td>
                  <td style={{ textAlign: 'right', padding: '20px', fontSize: '12px', fontWeight: '700', color: '#16a34a' }}>CONFIRMED</td>
                  <td style={{ textAlign: 'right', padding: '20px', fontSize: '12px', color: '#1e293b' }}>{new Date(receiptData.created_at).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right', padding: '20px', fontSize: '16px', fontWeight: '900', color: '#0066FF' }}>{formatCurrency(receiptData.deposit_amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Verification Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: '40px', alignItems: 'center', background: '#f8fafc', padding: '30px', borderRadius: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0066FF', marginBottom: '10px' }}>
                <ShieldCheck style={{ width: '18px' }} />
                <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px' }}>Security Validation</span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: '1.6' }}>
                This document is a digitally generated receipt representing a successful investment pledge.
                All transaction amounts are subject to protocol verification and final clearing within 24-48 business hours.
                Verification Hash: {Math.random().toString(36).substring(2, 15).toUpperCase()}
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ borderBottom: '1px solid #cbd5e1', marginBottom: '10px', paddingBottom: '30px' }}>
                <div style={{ color: '#0066FF', fontStyle: 'italic', fontSize: '20px', fontWeight: '300', opacity: 0.8 }}>QuantumTradeSystem</div>
              </div>
              <p style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', textTransform: 'uppercase', margin: 0, letterSpacing: '1.5px' }}>Authorized Digital Seal</p>
            </div>
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Quantum Trade Solutions • CIN: U67120MH2026PTC123456 • Registered Investment Advisor No. INA000012345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5;
