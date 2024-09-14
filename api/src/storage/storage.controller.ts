import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Param,
  Res,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name);

  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a file for storage' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully.',
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ id: number; filename: string; imageUrl: string }> {
    this.logger.log(`Uploading file: ${file.originalname}`);

    const { id, filename, imageUrl } =
      await this.storageService.uploadFileToGCS(
        file.buffer,
        file.originalname,
        file.mimetype,
      );

    this.logger.log(
      `File uploaded with ID: ${id}, filename: ${filename}, and URL: ${imageUrl}`,
    );
    return { id, filename, imageUrl };
  }

  @Get(':storageId')
  @ApiOperation({ summary: 'Get file by storage ID' })
  async getFileByStorageId(
    @Param('storageId') storageId: number,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Retrieving file for storage ID: ${storageId}`);
    const fileUrl = await this.storageService.getFileUrlByStorageId(storageId);
    res.redirect(fileUrl); // Redirect to the file URL in GCS
  }
}
