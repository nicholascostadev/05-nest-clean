import {
  Uploader,
  UploadParams,
} from '@/domain/forum/application/storage/uploader';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { EnvService } from '../env/env.service';
import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client;

  constructor(private envService: EnvService) {
    const accountId = this.envService.get('CLOUDFLARE_ACCOUNT_ID');
    const accessKeyId = this.envService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.envService.get('AWS_SECRET_ACCESS_KEY');

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID();
    const bucketName = this.envService.get('AWS_BUCKET_NAME');

    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: uniqueFileName,
        Body: body,
        ContentType: fileType,
      }),
    );

    return {
      url: uniqueFileName,
    };
  }
}
