// src/storage/dto/upload-file.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDto {
  @ApiProperty()
  filename: string;

  @ApiProperty()
  mimetype: string;
}
