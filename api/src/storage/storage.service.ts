import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName = process.env.GCS_BUCKET_NAME;

  constructor() {
    this.storage = new Storage();
  }

  async uploadFileToGCS(
    buffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<{ storageId: number; url: string }> {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(filename);

    await file.save(buffer, {
      metadata: {
        contentType: mimetype,
      },
    });

    const url = `https://storage.googleapis.com/${this.bucketName}/${filename}`;
    const storageId = this.extractStorageIdFromUrl(url); // Simplify this logic as needed
    return { storageId, url };
  }

  async getFileUrlByStorageId(storageId: number): Promise<string> {
    // Return the URL where the image is stored, assuming storageId is the filename or part of it
    return `https://storage.googleapis.com/${this.bucketName}/${storageId}`;
  }

  private extractStorageIdFromUrl(url: string): number {
    // Logic to extract storageId from the file URL (if needed)
    return Number(url.split('/').pop().split('.')[0]);
  }
}
