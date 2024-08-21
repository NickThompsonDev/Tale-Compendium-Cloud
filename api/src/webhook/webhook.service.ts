import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Webhook } from 'svix';
import { IncomingHttpHeaders } from 'http';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  async validateClerkWebhook(req: Request): Promise<any> {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      this.logger.error('CLERK_WEBHOOK_SECRET is not defined');
      throw new Error('CLERK_WEBHOOK_SECRET is not defined');
    }

    const payloadString = await this.getRawBody(req);
    const svixHeaders = this.getSvixHeaders(req.headers);

    const wh = new Webhook(webhookSecret);
    try {
      const event = wh.verify(payloadString, svixHeaders);
      this.logger.log(`Received webhook event: ${event}`);
      return event;
    } catch (error) {
      this.logger.error('Error verifying webhook:', error.message);
      return undefined;
    }
  }

  private async getRawBody(req: Request): Promise<string> {
    const rawBody = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (chunk) => chunks.push(chunk));
      req.on('end', () => resolve(Buffer.concat(chunks)));
      req.on('error', reject);
    });
    return rawBody.toString('utf8');
  }

  private getSvixHeaders(headers: IncomingHttpHeaders): Record<string, string> {
    const svixHeaders: Record<string, string> = {};
    for (const header of ['svix-id', 'svix-timestamp', 'svix-signature']) {
      if (typeof headers[header] === 'string') {
        svixHeaders[header] = headers[header] as string;
      } else {
        throw new Error(`Missing or malformed header: ${header}`);
      }
    }
    return svixHeaders;
  }
}
