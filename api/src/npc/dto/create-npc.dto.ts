import { ApiProperty } from '@nestjs/swagger';

export class CreateNpcDto {
  @ApiProperty()
  npcName: string;

  @ApiProperty()
  npcDescription: string;

  @ApiProperty()
  armorClass: number;

  @ApiProperty()
  hitPoints: number;

  @ApiProperty()
  speed: number;

  @ApiProperty()
  str: number;

  @ApiProperty()
  dex: number;

  @ApiProperty()
  con: number;

  @ApiProperty()
  int: number;

  @ApiProperty()
  wis: number;

  @ApiProperty()
  cha: number;

  @ApiProperty({ required: false })
  skills: string;

  @ApiProperty({ required: false })
  senses: string;

  @ApiProperty({ required: false })
  languages: string;

  @ApiProperty({ required: false })
  challenge: number;

  @ApiProperty()
  proficiencyBonus: number;

  @ApiProperty({ required: false })
  specialTraits: string;

  @ApiProperty({ required: false })
  actions: string;

  @ApiProperty({ required: false })
  imageUrl: string;

  @ApiProperty({ required: false })
  imageStorageId: number;

  @ApiProperty()
  author: string;

  @ApiProperty()
  authorId: number;

  @ApiProperty()
  authorImageUrl: string;

  @ApiProperty()
  views: number;
}
