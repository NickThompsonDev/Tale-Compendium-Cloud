import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  tokens: number;
}
