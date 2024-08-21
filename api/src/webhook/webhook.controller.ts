import { Controller, Logger, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { WebhookService } from './webhook.service';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(
    private readonly userService: UserService,
    private readonly webhookService: WebhookService,
  ) {}

  @Post('clerk')
  async handleClerkWebhook(@Req() req: Request, @Res() res: Response) {
    const event = await this.webhookService.validateClerkWebhook(req);
    if (!event) {
      this.logger.warn('Invalid webhook request received');
      return res.status(400).send('Invalid request');
    }
    this.logger.log(`Handling event: ${event.type}`);

    switch (event.type) {
      case 'user.created':
        this.logger.log('Creating new user...');
        await this.userService.createUser({
          email: event.data.email_addresses[0].email_address,
          imageUrl: event.data.image_url,
          name: event.data.first_name!,
          tokens: event.data.tokens,
        });
        this.logger.log('User created successfully');
        break;
      case 'user.updated':
        this.logger.log('Updating user...');
        await this.userService.updateUser({
          clerkId: event.data.clerkId,
          imageUrl: event.data.image_url,
          email: event.data.email_addresses[0].email_address,
          tokens: event.data.tokens,
        });
        this.logger.log('User updated successfully');
        break;
      case 'user.deleted':
        this.logger.log('Deleting user...');
        await this.userService.deleteUser(event.data.id);
        this.logger.log('User deleted successfully');
        break;
      default:
        this.logger.warn(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).send();
  }
}
