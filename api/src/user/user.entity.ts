import { Entity, Column, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryColumn()
  @ApiProperty()
  clerkId: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  imageUrl: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column('float8')
  @ApiProperty()
  tokens: number;
}
