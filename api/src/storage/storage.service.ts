import { Injectable, Logger } from '@nestjs/common';
import { Storage as GCSStorage } from '@google-cloud/storage';
import * as Minio from 'minio';
import { BlobServiceClient } from '@azure/storage-blob';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageEntity } from './storage.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private gcsStorage: GCSStorage;
  private minioClient: Minio.Client;
  private azureBlobServiceClient: BlobServiceClient;
  private bucketName: string;
  private readonly logger = new Logger(StorageService.name);
  private isLocal: boolean;
  private isAzure: boolean;

  constructor(
    @InjectRepository(StorageEntity)
    private storageRepository: Repository<StorageEntity>,
  ) {
    // Determine the environment (local/docker, GKE, or AKS)
    const envType = process.env.ENV_TYPE || 'local';
    this.isLocal = envType === 'local';
    this.isAzure = envType === 'aks';
    this.bucketName = process.env.BUCKET_NAME || 'thumbnails'; // Bucket name for GCS, MinIO, or Azure Blob Container

    if (this.isLocal) {
      // Initialize MinIO for local storage
      this.logger.log('Initializing MinIO for local storage...');
      this.minioClient = new Minio.Client({
        endPoint: process.env.MINIO_ENDPOINT || 'minio',
        port: 9000,
        useSSL: false,
        accessKey: process.env.MINIO_ROOT_USER,
        secretKey: process.env.MINIO_ROOT_PASSWORD,
      });
    } else if (this.isAzure) {
      // Initialize Azure Blob Storage for AKS
      this.logger.log('Initializing Azure Blob Storage...');
      const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
      this.azureBlobServiceClient =
        BlobServiceClient.fromConnectionString(connectionString);
    } else {
      // Initialize Google Cloud Storage (GCS) for GKE
      this.logger.log(
        `GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
      );
      this.gcsStorage = new GCSStorage();
      this.logger.log('Google Cloud Storage initialized successfully');
    }
  }

  async uploadFileToGCS(
    buffer: Buffer,
    originalFilename: string,
    mimetype: string,
  ): Promise<{ id: number; filename: string; imageUrl: string }> {
    const bucket = this.gcsStorage.bucket(this.bucketName);

    const extension = originalFilename.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;

    const file = bucket.file(filename);

    await file.save(buffer, {
      metadata: {
        contentType: mimetype,
      },
    });

    const imageUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;

    const newFile = this.storageRepository.create({
      filename,
      mimetype,
      imageUrl,
    });

    const savedFile = await this.storageRepository.save(newFile);
    return { id: savedFile.id, filename, imageUrl };
  }

  async uploadFileToMinIO(
    buffer: Buffer,
    originalFilename: string,
    mimetype: string,
  ): Promise<{ id: number; filename: string; imageUrl: string }> {
    const extension = originalFilename.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;

    // Calculate the size of the file
    const size = buffer.length;

    // Upload the file with size and metadata
    await this.minioClient.putObject(
      this.bucketName,
      filename,
      buffer,
      size, // File size in bytes
      { 'Content-Type': mimetype }, // Metadata for content type
    );

    const minioBaseUrl = process.env.MINIO_PUBLIC_ENDPOINT?.startsWith('http')
      ? process.env.MINIO_PUBLIC_ENDPOINT
      : `http://${process.env.MINIO_PUBLIC_ENDPOINT}`;

    const imageUrl = `${minioBaseUrl}/${this.bucketName}/${filename}`;

    const newFile = this.storageRepository.create({
      filename,
      mimetype,
      imageUrl,
    });

    const savedFile = await this.storageRepository.save(newFile);
    return { id: savedFile.id, filename, imageUrl };
  }

  async uploadFileToAzure(
    buffer: Buffer,
    originalFilename: string,
    mimetype: string,
  ): Promise<{ id: number; filename: string; imageUrl: string }> {
    const extension = originalFilename.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;

    const containerClient = this.azureBlobServiceClient.getContainerClient(
      this.bucketName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: mimetype },
    });

    const imageUrl = blockBlobClient.url;

    const newFile = this.storageRepository.create({
      filename,
      mimetype,
      imageUrl,
    });

    const savedFile = await this.storageRepository.save(newFile);
    return { id: savedFile.id, filename, imageUrl };
  }

  async uploadFile(
    buffer: Buffer,
    originalFilename: string,
    mimetype: string,
  ): Promise<{ id: number; filename: string; imageUrl: string }> {
    if (this.isLocal) {
      // Use MinIO for local development
      return this.uploadFileToMinIO(buffer, originalFilename, mimetype);
    } else if (this.isAzure) {
      // Use Azure Blob Storage for AKS
      return this.uploadFileToAzure(buffer, originalFilename, mimetype);
    } else {
      // Use GCS for GKE
      return this.uploadFileToGCS(buffer, originalFilename, mimetype);
    }
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
