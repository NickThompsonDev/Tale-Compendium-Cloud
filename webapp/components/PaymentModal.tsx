import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/lib/stripeClient';
import TokenSelection from './TokenSelection';
import PaymentForm from './PaymentForm';
import SuccessMessage from './SuccessMessage';
import api from '@/api';
import { tokenAmounts } from '@/constants';
import { Appearance } from '@stripe/stripe-js';

interface PaymentPageProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const appearance: Appearance = {
  theme: 'night',
  labels: 'floating'
};

const PaymentPage: React.FC<PaymentPageProps> = ({ open, onClose, userId }) => {
  const [step, setStep] = useState<'selection' | 'payment' | 'success'>('selection');
  const [selectedToken, setSelectedToken] = useState<{ amount: number, price: number } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const handleProceedToPayment = async (amount: number) => {
    if (!userId) {
      console.error('User not logged in');
      return;
    }

    const tokenData = tokenAmounts.find(token => token.amount === amount);
    if (!tokenData) {
      throw new Error('Invalid token amount selected');
    }
    setSelectedToken(tokenData);

    try {
      // Call your API to create a payment intent
      const response = await api.stripe.createPaymentIntent({
        amount: tokenData.price * 100, // Convert to cents
        currency: 'usd',
      });

      if (response?.clientSecret) {
        setClientSecret(response.clientSecret);
        setStep('payment');
      } else {
        throw new Error('Failed to create payment intent');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const handlePaymentSuccess = () => {
    setStep('success');
  };

  const handleClose = () => {
    setStep('selection');
    setSelectedToken(null);
    setClientSecret(null);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-50 mx-auto my-16 w-full max-w-lg p-6 bg-black-1 rounded-lg shadow-lg border border-white">
        {step === 'selection' && <TokenSelection onProceed={handleProceedToPayment} onClose={handleClose}/>}
        {step === 'payment' && clientSecret && selectedToken && (
          <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
            <PaymentForm
              clientSecret={clientSecret}
              tokenAmount={selectedToken.amount}
              dollarAmount={selectedToken.price}
              onClose={handleClose}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        )}
        {step === 'success' && <SuccessMessage onClose={handleClose} />}
      </div>
    </div>
  );
};


const PaymentModal: React.FC<PaymentPageProps> = ({ open, onClose, userId }) => (
  <Elements stripe={stripePromise}>
    <PaymentPage open={open} onClose={onClose} userId={userId} />
  </Elements>
);

export default PaymentModal;
