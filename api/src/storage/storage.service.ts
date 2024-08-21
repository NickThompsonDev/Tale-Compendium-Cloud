import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StorageEntity } from './storage.entity';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(StorageEntity)
    private readonly storageRepository: Repository<StorageEntity>,
  ) {}

  async uploadFile(
    buffer: Buffer,
    filename: string,
    mimetype: string,
  ): Promise<StorageEntity> {
    const file = this.storageRepository.create({
      buffer,
      filename,
      mimetype, // Save the MIME type here
    });
    return this.storageRepository.save(file);
  }

  async getFileById(id: number): Promise<StorageEntity> {
    return this.storageRepository.findOne({ where: { id } });
  }

  async getFileWithMimeType(
    id: number,
  ): Promise<{ file: Buffer; mimetype: string; filename: string }> {
    const file = await this.getFileById(id);
    if (!file) {
      throw new Error('File not found');
    }
    return {
      file: file.buffer,
      mimetype: file.mimetype,
      filename: file.filename,
    };
  }

  async getFileUrl(id: number): Promise<string> {
    const url = `${process.env.BASE_URL}/storage/${id}`;
    return url;
  }
}
