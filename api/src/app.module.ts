import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NpcController } from './npc/npc.controller';
import { NpcService } from './npc/npc.service';
import { NPC } from './npc/npc.entity';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { User } from './user/user.entity';
import { OpenaiController } from './openai/openai.controller';
import { OpenaiService } from './openai/openai.service';
import { StripeController } from './stripe/stripe.controller';
import { StripeService } from './stripe/stripe.service';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookService } from './webhook/webhook.service';
import { StorageModule } from './storage/storage.module';
import { NpcModule } from './npc/npc.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'user',
      password: process.env.DATABASE_PASSWORD || 'password',
      database: process.env.DATABASE_NAME || 'mydatabase',
      autoLoadEntities: true,
      synchronize: true, // Disable in production
    }),
    TypeOrmModule.forFeature([NPC, User]),
    StorageModule,
    NpcModule,
  ],
  controllers: [
    NpcController,
    UserController,
    OpenaiController,
    StripeController,
    WebhookController,
  ],
  providers: [
    NpcService,
    UserService,
    OpenaiService,
    StripeService,
    WebhookService,
  ],
})
export class AppModule {}
