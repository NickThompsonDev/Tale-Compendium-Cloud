import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
  ): Promise<Stripe.PaymentIntent> {
    return await this.stripe.paymentIntents.create({
      amount,
      currency,
    });
  }
}
