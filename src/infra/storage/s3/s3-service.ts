import { inject, injectable } from 'inversify';
import { IStorageService } from '../storage-service';
import TYPES from '@src/core/types';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@injectable()
export class S3Service implements IStorageService {
  constructor(@inject(TYPES.S3Client) private readonly s3Client: S3Client) {}

  async saveImage(base64: string, name: string, contentType: string): Promise<void> {
    const binaryImageData = Buffer.from(base64, 'base64');

    const s3UploadCommand = new PutObjectCommand({
      Bucket: 'patinhaslivresfotos',
      Key: name,
      Body: binaryImageData,
      ContentType: contentType,
    });

    await this.s3Client.send(s3UploadCommand);
  }
}
