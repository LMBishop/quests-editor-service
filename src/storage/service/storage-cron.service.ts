import { Injectable, Logger } from '@nestjs/common';
import { StoredFile } from '../entity/stored-file.entity';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class StorageCronService {
  private readonly logger = new Logger(StorageCronService.name);

  constructor(
    @InjectRepository(StoredFile)
    private storedFileRepository: Repository<StoredFile>,
  ) {}

  @Cron('0 30 * * * *')
  async deleteExpired() {
    const filesToDelete = await this.storedFileRepository.find({
      relations: {
        fileMetadata: true,
      },
      where: {
        fileMetadata: {
          validUntil: LessThan(new Date(Date.now())),
        },
      },
    });

    if (filesToDelete.length > 0) {
      await this.storedFileRepository.remove(filesToDelete);
      this.logger.log(`Deleted ${filesToDelete.length} expired files`);
    }
  }
}
