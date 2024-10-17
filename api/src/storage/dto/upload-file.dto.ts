import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty()
  filename: string;

  @ApiProperty()
  mimetype: string;
}
