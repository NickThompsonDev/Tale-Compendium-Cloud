// src/storage/storage.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class StorageEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column({ type: 'bytea' })
  @ApiProperty()
  buffer: Buffer;

  @Column()
  @ApiProperty()
  filename: string;

  @Column()
  @ApiProperty()
  mimetype: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty()
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @ApiProperty()
  updatedAt: Date;
}
