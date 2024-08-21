import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty()
  clerkId: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  tokens: number;
}
