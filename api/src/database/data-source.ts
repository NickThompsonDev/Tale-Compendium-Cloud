import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { NPC } from '../npc/npc.entity';
import { User } from '../user/user.entity';
import { StorageEntity } from '../storage/storage.entity';

config(); // Load environment variables from .env.local

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER || 'user',
  password: process.env.DATABASE_PASSWORD || 'password',
  database: process.env.DATABASE_NAME || 'mydatabase',
  entities: [NPC, User, StorageEntity],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
