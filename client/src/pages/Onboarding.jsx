import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Step2 from '../components/Steps/Step2';
import Step3 from '../components/Steps/Step3';
import Step4 from '../components/Steps/Step4';
import Step5 from '../components/Steps/Step5';

const Onboarding = ({ 
  step, 
  formData, 
  setFormData, 
  nextStep, 
  prevStep, 
  handleSubmit, 
  loading, 
  receiptData,
  setActiveView
}) => {
  return (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <Step2 
          formData={formData} 
          setFormData={setFormData} 
          nextStep={nextStep} 
          prevStep={prevStep} 
        />
      )}
      {step === 2 && (
        <Step3 
          formData={formData} 
          setFormData={setFormData} 
          nextStep={nextStep} 
          prevStep={prevStep} 
        />
      )}
      {step === 3 && (
        <Step4 
          formData={formData} 
          handleSubmit={handleSubmit} 
          prevStep={prevStep} 
          loading={loading} 
        />
      )}
      {step === 4 && (
        <Step5 
          receiptData={receiptData} 
          setActiveView={setActiveView}
        />
      )}
    </AnimatePresence>
  );
};

export default Onboarding;
