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
import { StorageEntity } from './storage.entity';
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
  @ApiOperation({ summary: 'Upload a file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully.',
    type: StorageEntity,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StorageEntity> {
    this.logger.log(`Uploading file: ${file.originalname}`);
    const savedFile = await this.storageService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );

    // Log the URL where the file can be accessed
    const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}/storage/${savedFile.id}`;
    this.logger.log(`File uploaded with URL: ${fileUrl}`);

    return savedFile;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a file by ID' })
  @ApiResponse({
    status: 200,
    description: 'File retrieved successfully.',
    type: Buffer,
  })
  async getFileById(
    @Param('id') id: number,
    @Res() res: Response,
  ): Promise<void> {
    this.logger.log(`Retrieving file with ID: ${id}`);
    const file = await this.storageService.getFileWithMimeType(id);
    if (!file) {
      this.logger.warn(`File with ID: ${id} not found`);
      res.status(404).send('File not found');
      return;
    }
    this.logger.log(`File with ID: ${id} retrieved successfully`);

    // Use the WEBAPP_URL environment variable
    const allowedOrigin = process.env.WEBAPP_URL || 'http://localhost:3000';

    // Set the CORS headers for cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Set the Content-Type and Content-Disposition headers
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );
    res.send(file.file);
  }
}
