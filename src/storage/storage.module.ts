import { Module } from '@nestjs/common';
import { StorageService } from './service/storage.service';
import { StoredFile } from './entity/stored-file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageCronService } from './service/storage-cron.service';
import { FileMetadata } from 'src/file/entity/file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoredFile]), FileMetadata],
  providers: [StorageService, StorageCronService],
  exports: [StorageService],
})
export class StorageModule {}
