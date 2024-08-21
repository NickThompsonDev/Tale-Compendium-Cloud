// SuccessMessage.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

interface SuccessMessageProps {
  onClose: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ onClose }) => (
  <div className="flex flex-col items-center gap-4">
    <h2 className="text-xl font-bold text-white-1">Payment Successful!</h2>
    <p className="text-white-1">Your payment was successful, and tokens have been added to your account.</p>
    <Button onClick={onClose} className="text-white-1 bg-orange-1 py-2 px-4 font-extrabold hover:bg-black-1">
      Close
    </Button>
  </div>
);

export default SuccessMessage;
