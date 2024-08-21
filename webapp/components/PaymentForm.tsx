import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useApiMutation } from '@/hooks/useApiMutation';
import api from '@/api';

interface PaymentFormProps {
    clientSecret: string;
    tokenAmount: number;
    dollarAmount: number;
    onClose: () => void;
    onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ clientSecret, tokenAmount, dollarAmount, onClose, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { toast } = useToast();
    const { user } = useUser();
    const addTokens = useApiMutation(api.users.addTokens);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!stripe || !elements || !user) {
            toast({ title: 'Error', description: 'Stripe, elements, or user is not available', variant: 'destructive' });
            return;
        }

        try {
            await elements.submit();
            const result = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: window.location.href,
                },
                redirect: 'if_required',
            });

            if (result.error) {
                toast({ title: result.error.message, variant: 'destructive' });
            } else if (result.paymentIntent?.status === 'succeeded') {
                await addTokens.mutate({ clerkId: user.id, tokens: tokenAmount });
                toast({ title: 'Payment successful! Tokens added to your account.', variant: 'default' });
                onSuccess();
            } else {
                toast({ title: 'Payment failed', variant: 'destructive' });
            }
        } catch (error) {
            if (error instanceof Error) {
                toast({ title: 'Error during payment processing', description: error.message, variant: 'destructive' });
            } else {
                toast({ title: 'Unknown error occurred', variant: 'destructive' });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
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
                    <Button variant="outline" onClick={onClose} className="text-white-1 hover:bg-orange-1">
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={!stripe}
                        className="text-white-1 bg-orange-1 py-2 px-4 font-extrabold hover:bg-black-1"
                    >
                        Pay ${dollarAmount.toFixed(2)}
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default PaymentForm;
