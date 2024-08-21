import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { StripeService } from './stripe.service';

@ApiTags('stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  @ApiOperation({ summary: 'Create a payment intent' })
  @ApiResponse({
    status: 201,
    description: 'Payment intent created successfully.',
  })
  async createPaymentIntent(
    @Body() { amount, currency }: { amount: number; currency: string },
  ) {
    return await this.stripeService.createPaymentIntent(amount, currency);
  }
}
