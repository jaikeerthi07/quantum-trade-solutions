import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowDownCircle, Search, Filter, Calendar, DollarSign, 
  Building, CheckCircle, Clock, XCircle, MoreHorizontal,
  Download, ArrowUpRight, Wallet, Users, LayoutGrid, FileText, Trash2
} from 'lucide-react';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Withdraw = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [error, setError] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    transaction_id: '',
    user_id: '',
    status: 'All statuses',
    bank: 'All banks',
    currency: 'INR',
    amount: ''
  });

  const banks = [
    "HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", 
    "Kotak Mahindra Bank", "IndusInd Bank", "Bank of Baroda", 
    "Punjab National Bank", "Canara Bank", "Union Bank of India", 
    "IDBI Bank", "Yes Bank", "Federal Bank", "Indian Bank", 
    "Central Bank of India", "Standard Chartered", "HSBC Bank"
  ];

  const fetchWithdrawals = async (overrideFilters = null) => {
    setFetching(true);
    setShowTable(true);
    setError(null);
    try {
      const activeFilters = overrideFilters || filters;
      const params = new URLSearchParams();
      
      if (activeFilters.status !== 'All statuses') params.append('status', activeFilters.status.trim());
      if (activeFilters.transaction_id.trim()) params.append('transaction_id', activeFilters.transaction_id.trim());
      if (activeFilters.user_id.trim()) params.append('user_id', activeFilters.user_id.trim());
      if (activeFilters.bank !== 'All banks') params.append('bank', activeFilters.bank.trim());
      if (activeFilters.amount.trim()) params.append('amount', activeFilters.amount.trim());
      
      const res = await axios.get(`/api/withdrawals?${params.toString()}`);
      setWithdrawals(res.data);
    } catch (err) {
      console.error('Error fetching withdrawals:', err);
      const errorMsg = err.response?.data?.error || err.message;
      const details = err.response?.data?.details ? ` (${err.response.data.details})` : '';
      setError(`System Error: ${errorMsg}${details}. Please verify server status.`);
    } finally {
      setFetching(false);
    }
  };

  const handleDeleteCustomer = async (userId) => {
    if (!window.confirm('CRITICAL: This will permanently delete the customer record and ALL associated withdrawal history. Proceed?')) return;
    
    try {
      await axios.delete(`/api/users/${userId}`);
      fetchWithdrawals(); // Refresh
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert('Failed to delete customer record.');
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleSaveWithdrawal = async () => {
    if (!filters.user_id || !filters.amount) {
      alert('CRITICAL: User ID and Amount are mandatory for record creation.');
      return;
    }

    if (!window.confirm(`Perform withdrawal of ${filters.amount} ${filters.currency} for User ${filters.user_id}?`)) return;

    setFetching(true);
    try {
      await axios.post('/api/withdrawals', {
        user_custom_id: filters.user_id,
        transaction_id: filters.transaction_id,
        amount: filters.amount,
        bank_name: filters.bank === 'All banks' ? '' : filters.bank,
        currency: filters.currency,
        status: filters.status === 'All statuses' ? 'PENDING' : filters.status
      });
      alert('SUCCESS: Withdrawal record synchronized and saved.');
      
      // Clear filters so the new record is visible at the top of the full list
      const defaultFilters = {
        transaction_id: '',
        user_id: '',
        status: 'All statuses',
        bank: 'All banks',
        currency: 'INR',
        amount: ''
      };
      setFilters(defaultFilters);
      fetchWithdrawals(defaultFilters); 
    } catch (err) {
      console.error('Save error:', err);
      const errorMsg = err.response?.data?.error || err.message;
      alert(`FAILED: ${errorMsg}. Check server connectivity.`);
    } finally {
      setFetching(false);
    }
  };

  const handleApplyFilter = () => {
    fetchWithdrawals();
  };

  const downloadCSV = () => {
    const headers = ["TRANSACTION ID", "USER ID", "CURRENCY", "STATUS", "AMOUNT", "BANK NAME"];
    const rows = withdrawals.map(w => [
      w.transaction_id,
      w.user_custom_id,
      w.currency,
      w.status,
      w.amount,
      w.bank_name
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "withdrawals_report.csv");
    document.body.appendChild(link);
    link.click();
  };

  const downloadPDF = () => {
    const doc = new jsPDF('p', 'pt');
    const tableData = withdrawals.map(w => [
      w.transaction_id,
      w.user_custom_id,
      w.currency,
      w.status,
      w.amount,
      w.bank_name
    ]);

    doc.autoTable({
      head: [["TRANS ID", "USER ID", "CURR", "STATUS", "AMOUNT", "BANK"]],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillStyle: '#6366f1' }
    });

    doc.save('withdrawals_report.pdf');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'CONFIRMED': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'REJECTED': return <XCircle className="w-4 h-4 text-rose-400" />;
      default: return <Clock className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-10 pb-24">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-white uppercase italic">
            Capital <span className="finance-text-gradient italic">Withdrawals</span>
          </h1>
          <div className="flex items-center gap-4 mt-3">
            <div className="h-[2px] w-12 finance-gradient"></div>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Transaction Disbursement Node v4.0</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
            <div className="erp-card px-8 py-4 rounded-3xl flex items-center gap-4 border-indigo-500/20">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <ArrowDownCircle className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Outflow</p>
                    <span className="text-xl font-black text-slate-100 italic tracking-tighter">
                      {withdrawals.reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0).toLocaleString()} INR
                    </span>
                </div>
            </div>
        </div>
      </div>

      {/* Simplified Filter Grid */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
      >
        <div className="erp-card p-10 rounded-4xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
            <Filter className="w-32 h-32" />
          </div>

          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-10 flex items-center gap-4">
            <LayoutGrid className="w-4 h-4 text-indigo-400" /> Disbursement Filtering
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 relative z-10">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Transaction ID</label>
              <input 
                type="text" placeholder="ID"
                className="w-full px-5 py-3.5 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-xs text-slate-100 placeholder:text-slate-800"
                value={filters.transaction_id}
                onChange={(e) => setFilters({...filters, transaction_id: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">User ID</label>
              <input 
                type="text" placeholder="User ID"
                className="w-full px-5 py-3.5 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-xs text-slate-100 placeholder:text-slate-800"
                value={filters.user_id}
                onChange={(e) => setFilters({...filters, user_id: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Amount</label>
              <input 
                type="text" placeholder="Amount"
                className="w-full px-5 py-3.5 bg-[#0a0a0a] border border-white/5 rounded-2xl focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-xs text-slate-100 placeholder:text-slate-800"
                value={filters.amount}
                onChange={(e) => setFilters({...filters, amount: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Currency</label>
              <select 
                className="w-full px-5 py-3.5 bg-[#0a0a0a] border border-white/5 rounded-2xl appearance-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-xs text-slate-100"
                value={filters.currency}
                onChange={(e) => setFilters({...filters, currency: e.target.value})}
              >
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Bank Name</label>
              <select 
                className="w-full px-5 py-3.5 bg-[#0a0a0a] border border-white/5 rounded-2xl appearance-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-xs text-slate-100"
                value={filters.bank}
                onChange={(e) => setFilters({...filters, bank: e.target.value})}
              >
                <option>All banks</option>
                {banks.map(bank => <option key={bank} value={bank}>{bank}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest px-1">Status</label>
              <select 
                className="w-full px-5 py-3.5 bg-[#0a0a0a] border border-white/5 rounded-2xl appearance-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold text-xs text-slate-100"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option>All statuses</option>
                <option value="CONFIRMED">Approved</option>
                <option value="PENDING">Pending</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="lg:col-span-3 flex items-end pt-4 gap-4">
              <button 
                className={`flex-1 py-5 font-black rounded-lg transition-all uppercase text-xs tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 ${
                    fetching 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/20'
                }`}
                onClick={handleApplyFilter}
                disabled={fetching}
              >
                {fetching ? (
                    <>
                        <div className="w-4 h-4 border-2 border-slate-700 border-t-emerald-500 rounded-full animate-spin"></div>
                        SYNCHRONIZING...
                    </>
                ) : (
                    <>
                        <Search className="w-4 h-4" /> 
                        APPLY FILTERS
                    </>
                )}
              </button>

              <button 
                className={`px-8 py-5 font-black rounded-lg transition-all uppercase text-xs tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 ${
                    fetching 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/20'
                }`}
                onClick={handleSaveWithdrawal}
                disabled={fetching}
              >
                {fetching ? (
                    <>
                        <div className="w-4 h-4 border-2 border-slate-700 border-t-indigo-500 rounded-full animate-spin"></div>
                        SAVING...
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4" />
                        SAVE AS NEW
                    </>
                )}
              </button>
              
              <button 
                className="px-8 py-5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest border border-white/5"
                onClick={() => {
                    const defaultFilters = {
                        transaction_id: '',
                        user_id: '',
                        status: 'All statuses',
                        bank: 'All banks',
                        currency: 'INR',
                        amount: ''
                    };
                    setFilters(defaultFilters);
                    fetchWithdrawals(defaultFilters);
                }}
              >
                CLEAR
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-8 pt-8 border-t border-white/5">
            <button className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 group opacity-50 cursor-not-allowed">
              COLUMN SETTINGS <ArrowDownCircle className="w-3.5 h-3.5" />
            </button>
            
            <div className="flex items-center gap-2">
                <button onClick={downloadCSV} className="px-6 py-2.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black text-slate-400 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">CSV</button>
                <button onClick={downloadPDF} className="px-6 py-2.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-black text-slate-400 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest">PDF</button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Simplified Withdrawal Ledger */}
      {showTable && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <div className="erp-card p-0 rounded-4xl h-full relative overflow-hidden flex flex-col border-white/5 min-h-[400px]">
            {fetching ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-12 h-12 border-4 border-white/5 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">Synchronizing Disbursement Node...</p>
              </div>
            ) : (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="py-8 px-8 text-[11px] font-black text-white uppercase tracking-widest border-r border-white/5">TRANSACTION ID</th>
                      <th className="py-8 px-8 text-[11px] font-black text-white uppercase tracking-widest border-r border-white/5">CUSTOMER NAME</th>
                      <th className="py-8 px-8 text-[11px] font-black text-white uppercase tracking-widest border-r border-white/5">USER ID</th>
                      <th className="py-8 px-8 text-[11px] font-black text-white uppercase tracking-widest border-r border-white/5">CURRENCY</th>
                      <th className="py-8 px-8 text-[11px] font-black text-white uppercase tracking-widest border-r border-white/5">AMOUNT</th>
                      <th className="py-8 px-8 text-[11px] font-black text-white uppercase tracking-widest border-r border-white/5">BANK NAME</th>
                      <th className="py-8 px-8 text-[11px] font-black text-white uppercase tracking-widest border-r border-white/5">STATUS</th>
                      <th className="py-8 px-8 text-[11px] font-black text-white uppercase tracking-widest">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {error ? (
                      <tr>
                        <td colSpan="8" className="py-24 text-center">
                          <div className="flex flex-col items-center justify-center text-rose-500/50">
                            <XCircle className="w-16 h-16 mb-4" />
                            <p className="font-black uppercase tracking-[0.2em] text-[10px]">{error}</p>
                          </div>
                        </td>
                      </tr>
                    ) : withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-32 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <Wallet className="w-8 h-8 text-slate-700" />
                            </div>
                            <p className="font-black uppercase tracking-[0.4em] text-white text-[11px] mb-2">No Disbursement Records Matrix Found</p>
                            <p className="text-slate-600 font-bold text-[9px] uppercase tracking-widest">Verify your search parameters or synchronize node state</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {withdrawals.map((item) => (
                          <motion.tr 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            key={item.id}
                            className="group hover:bg-white/2 transition-colors border-b border-white/5"
                          >
                            <td className="py-8 px-8 border-r border-white/5 font-mono text-xs font-bold text-slate-300">
                              {item.transaction_id}
                            </td>
                            <td className="py-8 px-8 border-r border-white/5 text-xs font-bold text-slate-100 uppercase tracking-tight">
                              {item.full_name}
                            </td>
                            <td className="py-8 px-8 border-r border-white/5 font-mono text-xs font-bold text-slate-300">
                              {item.user_custom_id}
                            </td>
                            <td className="py-8 px-8 border-r border-white/5 text-xs font-bold text-slate-300">
                              {item.currency}
                            </td>
                            <td className="py-8 px-8 border-r border-white/5 text-xs font-black text-slate-100">
                              {parseFloat(item.amount).toLocaleString()}
                            </td>
                            <td className="py-8 px-8 border-r border-white/5 text-xs font-bold text-slate-300 uppercase tracking-tight">
                              {item.bank_name}
                            </td>
                            <td className="py-8 px-8 border-r border-white/5">
                              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-xl border ${
                                item.status === 'CONFIRMED' ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400' : 
                                item.status === 'REJECTED' ? 'bg-rose-500/5 border-rose-500/20 text-rose-400' : 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                              }`}>
                                {getStatusIcon(item.status)}
                                <span className="text-[10px] font-black uppercase tracking-widest">
                                    {item.status === 'CONFIRMED' ? 'Approved' : item.status}
                                </span>
                              </div>
                            </td>
                            <td className="py-8 px-8 text-center">
                                <button 
                                    onClick={() => handleDeleteCustomer(item.user_id)}
                                    className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all group"
                                    title="Delete Customer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Withdraw;
