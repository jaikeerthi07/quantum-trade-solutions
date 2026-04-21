import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, Table, PieChart, CheckCircle, 
  ArrowRight, Download, BrainCircuit, Wallet,
  Calendar, Info, AlertCircle
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const InvestmentPlans = ({ onSelectPlan, setActiveView }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const plans = useMemo(() => {
    const p = [];
    for (let i = 1; i <= 50; i++) {
        let tier = 'Standard';
        if (i > 10) tier = 'Premium';
        if (i > 25) tier = 'Elite';
        if (i > 40) tier = 'Institutional';
        
        p.push({
            id: i,
            amount: i * 100000,
            label: `${i} Lakh${i > 1 ? 's' : ''}`,
            tier: tier
        });
    }
    return p;
  }, []);

  const profitRate = 0.03; // 3% profit

  // Corrections Table Data Calculation
  const tableData = useMemo(() => {
    if (!selectedPlan) return [];
    const data = [];
    let currentBalance = selectedPlan.amount;
    for (let month = 1; month <= 12; month++) {
      const profit = currentBalance * profitRate;
      const endingBalance = currentBalance + profit;
      data.push({
        month: `Month ${month}`,
        opening: currentBalance.toFixed(2),
        profit: profit.toFixed(2),
        ending: endingBalance.toFixed(2)
      });
      currentBalance = endingBalance;
    }
    return data;
  }, [selectedPlan]);

  // Graph Data (Normal Growth vs ML Forecast)
  const graphData = useMemo(() => {
    if (!selectedPlan) return [];
    const data = [];
    let base = selectedPlan.amount;
    let forecast = selectedPlan.amount;
    
    for (let month = 0; month <= 24; month++) {
      // Normal 3% growth
      if (month > 0) base = base * (1 + profitRate);
      
      // ML Forecast (Mocked with slight random variance and a bit higher trend)
      const variance = (Math.random() - 0.5) * 0.01; // +/- 1% randomness
      const trendBoost = month > 12 ? 0.005 : 0; // Better returns after 1 year
      if (month > 0) forecast = forecast * (1 + profitRate + variance + trendBoost);

      data.push({
        name: month === 0 ? 'Start' : `M${month}`,
        standard: Math.round(base),
        ml_forecast: Math.round(forecast)
      });
    }
    return data;
  }, [selectedPlan]);

  const handlePlanClick = (plan) => {
    setSelectedPlan(plan);
    setShowAnalytics(true);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
          Strategic <span className="finance-text-gradient">Investment Tiers</span>
        </h1>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">
          Select a repository size to initiate capital growth protocols
        </p>
      </div>

      {/* Plan Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={() => handlePlanClick(plan)}
            className={`cursor-pointer erp-card p-6 rounded-4xl border transition-all relative overflow-hidden group ${
              selectedPlan?.id === plan.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-indigo-500/30'
            }`}
          >
            <div className={`absolute top-0 right-0 p-4 opacity-[0.05] group-hover:scale-125 transition-transform ${selectedPlan?.id === plan.id ? 'opacity-20' : ''}`}>
              <Wallet className="w-16 h-16" />
            </div>
            
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 transition-all ${
              selectedPlan?.id === plan.id ? 'bg-indigo-500 text-white' : 'bg-white/5 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white'
            }`}>
              <CheckCircle className={`w-5 h-5 ${selectedPlan?.id === plan.id ? 'opacity-100' : 'opacity-20 group-hover:opacity-100'}`} />
            </div>

            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{plan.tier}</p>
            <h3 className="text-2xl font-black text-white tracking-tighter mb-4 italic">₹{plan.label}</h3>
            
            <div className="flex items-center gap-2 text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
              <span>View Analytics</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAnalytics && selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-[#050505]/90 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="erp-card w-full max-w-6xl max-h-[90vh] overflow-y-auto p-8 md:p-12 rounded-4xl border-white/10 bg-[#0a0a0a] relative shadow-2xl"
            >
              {/* Close Button */}
              <button 
                onClick={() => { setShowAnalytics(false); setSelectedPlan(null); }}
                className="absolute top-8 right-8 p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-95 z-50"
              >
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Close Terminal</span>
                    <AlertCircle className="w-5 h-5" />
                </div>
              </button>

              <div className="space-y-10">
                {/* Analytics Header */}
                <div>
                   <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">
                     Analytics Terminal: <span className="finance-text-gradient">₹{selectedPlan.label}</span>
                   </h2>
                   <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.4em]">Protocol Authorization T-minus 0 • {selectedPlan.tier} Stratagem</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Corrections Table */}
                  <div className="lg:col-span-1 p-6 bg-white/5 rounded-3xl border border-white/5 space-y-6">
                    <div className="flex items-center gap-3">
                      <Table className="w-5 h-5 text-indigo-400" />
                      <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">Growth Correction Table (3%)</h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[10px] font-bold text-slate-400 border-collapse">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="py-3 px-2 uppercase tracking-tighter">Period</th>
                            <th className="py-3 px-2 uppercase tracking-tighter text-right">Opening</th>
                            <th className="py-3 px-2 uppercase tracking-tighter text-right text-indigo-400">Profit</th>
                            <th className="py-3 px-2 uppercase tracking-tighter text-right">Ending</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.slice(0, 10).map((row, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/10 transition-colors">
                              <td className="py-3 px-2 text-slate-500">{row.month}</td>
                              <td className="py-3 px-2 text-right">₹{parseInt(row.opening).toLocaleString()}</td>
                              <td className="py-3 px-2 text-right text-green-400/70">+₹{parseInt(row.profit).toLocaleString()}</td>
                              <td className="py-3 px-2 text-right text-slate-100">₹{parseInt(row.ending).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-4 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 flex items-center gap-3">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                        <p className="text-[10px] text-slate-500">Auto-calculated growth based on cumulative 3% protocol per month.</p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Graphs & ML Forecast */}
                  <div className="lg:col-span-2 p-6 bg-white/5 rounded-3xl border border-white/5 space-y-8 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PieChart className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">Predictive Velocity Terminal</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Standard</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">ML Forecast</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-h-[350px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={graphData}>
                          <defs>
                            <linearGradient id="colorML" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#475569" 
                            fontSize={8} 
                            tickLine={false} 
                            axisLine={false}
                            interval={3}
                          />
                          <YAxis 
                            stroke="#475569" 
                            fontSize={8} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#0a0a0a', 
                              border: '1px solid rgba(255,255,255,0.05)', 
                              borderRadius: '16px',
                              fontSize: '10px',
                              color: '#fff' 
                            }}
                            itemStyle={{ color: '#6366f1' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="ml_forecast" 
                            stroke="#6366f1" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorML)" 
                          />
                          <Area 
                            type="monotone" 
                            dataKey="standard" 
                            stroke="#475569" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            fill="transparent" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="p-5 bg-black/40 rounded-3xl border border-white/5 flex items-center gap-4 group">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BrainCircuit className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">ML Model Analysis</p>
                          <h4 className="text-xs font-bold text-slate-200">High Growth Probability: 87%</h4>
                        </div>
                      </div>
                      <div className="p-5 bg-black/40 rounded-3xl border border-white/5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Projected Returns</p>
                          <h4 className="text-xs font-bold text-slate-200">₹{(graphData[graphData.length-1].ml_forecast / 100000).toFixed(1)} Lakhs @ 24M</h4>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-8 mt-auto">
                        <button 
                            onClick={() => setActiveView('billing', { plan: selectedPlan })}
                            className="px-12 py-5 finance-gradient text-white font-black rounded-3xl shadow-xl hover:scale-[1.02] transition-all flex items-center gap-4 uppercase text-xs tracking-widest group"
                        >
                            Authorize Capital Assignment
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!selectedPlan && (
        <div className="py-20 flex flex-col items-center justify-center text-center opacity-20 grayscale-50">
          <AlertCircle className="w-20 h-20 mb-6 text-indigo-400" />
          <h2 className="text-xl font-black uppercase tracking-[0.2em] text-white">Selection Pending</h2>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Activate a matrix tier to view detailed growth analytics</p>
        </div>
      )}
    </div>
  );
};

export default InvestmentPlans;
