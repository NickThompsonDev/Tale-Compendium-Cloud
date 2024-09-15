import { Injectable, Logger } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageEntity } from './storage.entity'; // Your updated entity
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName = process.env.GCS_BUCKET_NAME;
  private readonly logger = new Logger(StorageService.name);

  constructor(
    @InjectRepository(StorageEntity)
    private storageRepository: Repository<StorageEntity>,
  ) {
    try {
      this.logger.log(
        `GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
      );
      this.storage = new Storage();
      this.logger.log('Google Cloud Storage initialized successfully');
    } catch (error) {
      this.logger.error(
        'Error initializing Google Cloud Storage:',
        error.message,
      );
      throw new Error('GCS initialization failed');
    }
  }

  async uploadFileToGCS(
    buffer: Buffer,
    originalFilename: string,
    mimetype: string,
  ): Promise<{ id: number; filename: string; imageUrl: string }> {
    try {
      const bucket = this.storage.bucket(this.bucketName);

      // Generate a unique filename
      const extension = originalFilename.split('.').pop();
      const filename = `${uuidv4()}.${extension}`;

      const file = bucket.file(filename);

      // Upload file to GCS
      await file.save(buffer, {
        metadata: {
          contentType: mimetype,
        },
      });

      const imageUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;

      // Save the file information to PostgreSQL
      const newFile = this.storageRepository.create({
        filename,
        mimetype,
        imageUrl,
      });

      const savedFile = await this.storageRepository.save(newFile);
      return { id: savedFile.id, filename, imageUrl };
    } catch (error) {
      this.logger.error(
        'Error uploading file to GCS or saving to DB:',
        error.message,
      );
      throw new Error('File upload failed');
    }
  }

  async getFileUrlByStorageId(storageId: number): Promise<string> {
    try {
      const file = await this.storageRepository.findOne({
        where: { id: storageId },
      });

      if (!file) {
        throw new Error(`File with storage ID ${storageId} not found`);
      }

      return file.imageUrl;
    } catch (error) {
      this.logger.error('Error retrieving file URL:', error.message);
      throw error;
    }
  }
}
