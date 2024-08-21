import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class NPC {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number;

  @Column()
  @ApiProperty()
  npcName: string;

  @Column('text')
  @ApiProperty()
  npcDescription: string;

  @Column()
  @ApiProperty()
  armorClass: number;

  @Column()
  @ApiProperty()
  hitPoints: number;

  @Column()
  @ApiProperty()
  speed: number;

  @Column()
  @ApiProperty()
  str: number;

  @Column()
  @ApiProperty()
  dex: number;

  @Column()
  @ApiProperty()
  con: number;

  @Column()
  @ApiProperty()
  int: number;

  @Column()
  @ApiProperty()
  wis: number;

  @Column()
  @ApiProperty()
  cha: number;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  skills: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  senses: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  languages: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  challenge: number;

  @Column()
  @ApiProperty()
  proficiencyBonus: number;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  specialTraits: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  actions: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  imageUrl: string;

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  imageStorageId: number;

  @Column()
  @ApiProperty()
  author: string;

  @Column()
  @ApiProperty()
  authorId: string;

  @Column()
  @ApiProperty()
  authorImageUrl: string;

  @Column()
  @ApiProperty()
  views: number;
}
