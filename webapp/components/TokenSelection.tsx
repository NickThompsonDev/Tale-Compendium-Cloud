import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { tokenAmounts } from '@/constants';
import Image from 'next/image';

interface TokenSelectionProps {
    onProceed: (amount: number, price: number) => void;
    onClose: () => void; // Add this line
}

const TokenSelection: React.FC<TokenSelectionProps> = ({ onProceed, onClose }) => {
    const [selectedToken, setSelectedToken] = useState<{ amount: number, price: number } | null>(null);

    return (
        <div className="flex flex-col gap-4">
            {tokenAmounts.map((token) => (
                <Button
                    key={token.amount}
                    variant="outline"
                    className={`text-white-1 py-2 px-4 font-extrabold transition-all duration-500 hover:bg-orange-1 ${selectedToken?.amount === token.amount ? 'border-orange-500 bg-orange-1' : 'border-white'}`}
                    onClick={() => setSelectedToken(token)}
                >
                    ${token.price} for {token.amount} Tokens
                </Button>
            ))}
            <div className="mt-6 flex justify-between items-center">
                <div className="flex justify-start">
                    <Image
                        src="/icons/powered-by-stripe-outline-logo.wine.svg"
                        alt="Stripe"
                        width={200}
                        height={1}
                        className=""
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <Button 
                        variant="outline" 
                        className="text-white-1 hover:bg-orange-1" 
                        onClick={onClose} // Attach onClose to Cancel button
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => selectedToken && onProceed(selectedToken.amount, selectedToken.price)}
                        className="text-white-1 bg-orange-1 py-2 px-4 font-extrabold hover:bg-black-1"
                        disabled={!selectedToken}
                    >
                        Pay ${selectedToken?.price.toFixed(2) || 0}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TokenSelection;
