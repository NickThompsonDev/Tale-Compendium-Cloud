import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageEntity } from './storage.entity'; // Your updated entity
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName = process.env.GCS_BUCKET_NAME;

  constructor(
    @InjectRepository(StorageEntity)
    private storageRepository: Repository<StorageEntity>,
  ) {
    this.storage = new Storage();
  }

  async uploadFileToGCS(
    buffer: Buffer,
    originalFilename: string,
    mimetype: string,
  ): Promise<{ id: number; filename: string; imageUrl: string }> {
    const bucket = this.storage.bucket(this.bucketName);

    // Generate a unique filename using UUID
    const extension = originalFilename.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;

    const file = bucket.file(filename);

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
  }

  async getFileUrlByStorageId(storageId: number): Promise<string> {
    const file = await this.storageRepository.findOne({
      where: { id: storageId },
    });

    if (!file) {
      throw new Error(`File with storage ID ${storageId} not found`);
    }

    return file.imageUrl;
  }
}
