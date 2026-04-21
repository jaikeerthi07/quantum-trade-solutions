import React, { useState } from 'react';
import Customers from './Customers';
import Onboarding from './Onboarding';
import InvestmentPlans from './InvestmentPlans';
import BillGenerator from './BillGenerator';
import Withdraw from './Withdraw';
import { Users } from 'lucide-react';
import axios from 'axios';

const DashboardHome = ({ activeView, setActiveView }) => {
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [targetCustomer, setTargetCustomer] = useState(null);
  
  const [onboardingFormData, setOnboardingFormData] = useState({
    user_id: null,
    full_name: '',
    mobile: '',
    aadhaar: '',
    pan: '',
    deposit_amount: 500000,
    agreed_terms: false
  });

  const startOnboarding = (customer) => {
    setOnboardingFormData({
      ...onboardingFormData,
      user_id: customer.id,
      full_name: customer.full_name,
      mobile: customer.mobile,
      aadhaar: customer.aadhaar,
      pan: customer.pan
    });
    setOnboardingStep(1); 
    setActiveView('investment_plans');
  };

  const handleNextStep = () => setOnboardingStep(prev => prev + 1);
  const handlePrevStep = () => setOnboardingStep(prev => prev - 1);

  const handleOnboardingSubmit = async (e, mode) => {
    if (e) e.preventDefault();
    
    if (mode === 'checkbox') {
        setOnboardingFormData(prev => ({ ...prev, agreed_terms: !prev.agreed_terms }));
        return;
    }

    setLoading(true);
    try {
      // 1. Create Investment
      const invRes = await axios.post('/api/investments', {
        user_id: onboardingFormData.user_id,
        deposit_amount: onboardingFormData.deposit_amount
      });
      
      const investment_id = invRes.data.investment_id;

      // 2. Confirm Investment
      await axios.post('/api/confirm', {
        investment_id,
        agreed_terms: onboardingFormData.agreed_terms
      });

      // 3. Get Receipt
      const receiptRes = await axios.get(`/api/receipt/${investment_id}`);
      setReceiptData(receiptRes.data);
      
      setOnboardingStep(4); // Show Step 5 (Receipt)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to process investment';
      const details = err.response?.data?.details ? `\nDetails: ${err.response.data.details}` : '';
      alert(`${errorMsg}${details}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetView = (view, data) => {
    if (view === 'bill_generator' || view === 'billing' || view === 'quotation') {
        if (data && data.plan) {
            setSelectedPlan(data.plan);
        }
    }
    setActiveView(view);
  };

  return (
    <>
      {activeView === 'registry' ? (
        <Customers onStartOnboarding={startOnboarding} />

      ) : activeView === 'investment_plans' ? (
        <InvestmentPlans 
          onSelectPlan={(plan) => setSelectedPlan(plan)}
          setActiveView={handleSetView}
        />
      ) : (activeView === 'bill_generator' || activeView === 'billing' || activeView === 'quotation') ? (
        <BillGenerator 
          plan={selectedPlan}
          customerData={onboardingFormData}
          setActiveView={handleSetView}
        />
      ) : activeView === 'withdraw' ? (
        <Withdraw />
      ) : (
        <Onboarding 
          step={onboardingStep}
          formData={onboardingFormData}
          setFormData={setOnboardingFormData}
          nextStep={handleNextStep}
          prevStep={handlePrevStep}
          handleSubmit={handleOnboardingSubmit}
          loading={loading}
          receiptData={receiptData}
          setActiveView={handleSetView}
        />
      )}
    </>
  );
};

export default DashboardHome;
