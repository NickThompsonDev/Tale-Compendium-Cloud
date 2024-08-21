// src/storage/storage.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { StorageEntity } from './storage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StorageEntity])],
  providers: [StorageService],
  controllers: [StorageController],
  exports: [StorageService], // Export if needed in other modules
})
export class StorageModule {}
