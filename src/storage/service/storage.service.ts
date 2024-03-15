import { Injectable } from '@nestjs/common';
import { FileMetadata } from 'src/file/entity/file.entity';
import { StoredFile } from '../entity/stored-file.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StorageService {
  constructor(
    @InjectRepository(StoredFile)
    private storedFileRepository: Repository<StoredFile>,
  ) {}

  async createFile(b64Contents: string, fileMetadata: FileMetadata): Promise<StoredFile> {
    const newFile = new StoredFile();
    newFile.b64Contents = b64Contents;
    newFile.fileMetadata = fileMetadata;

    return this.storedFileRepository.save(newFile);
  }
}
