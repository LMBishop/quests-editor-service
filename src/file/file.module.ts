import { Module } from '@nestjs/common';
import { FileController } from './controller/file.controller';
import { SessionModule } from '../session/session.module';
import { FileMetadata } from './entity/file.entity';
import { FilePurpose } from './entity/purpose.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './service/file.service';
import { Session } from 'src/session/entity/session.entity';
import { StorageModule } from 'src/storage/storage.module';
import { StoredFile } from 'src/storage/entity/stored-file.entity';

@Module({
  imports: [SessionModule, StorageModule, TypeOrmModule.forFeature([FileMetadata, FilePurpose, Session, StoredFile])],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
