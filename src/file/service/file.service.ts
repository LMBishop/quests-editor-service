import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileMetadata } from '../entity/file.entity';
import { FilePurpose } from '../entity/purpose.entity';
import { DataSource, Repository } from 'typeorm';
import { Session } from '../../session/entity/session.entity';
import { StorageService } from 'src/storage/service/storage.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileMetadata)
    private fileMetadataRepository: Repository<FileMetadata>,

    @InjectRepository(FilePurpose)
    private filePurposeRepository: Repository<FilePurpose>,

    private readonly storageService: StorageService,
    private readonly dataSource: DataSource,
  ) {}

  async createFile(
    b64Contents: string,
    purpose: string,
    validTo: Date,
    session: Session,
  ): Promise<FileMetadata | null> {
    const filePurpose = await this.filePurposeRepository.findOneBy({ name: purpose });
    if (!filePurpose) {
      throw new NotFoundException(`Unknown file purpose: ${filePurpose}`);
    }

    const file = new FileMetadata();
    file.purpose = filePurpose;
    file.session = session;
    file.validUntil = validTo;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.fileMetadataRepository.save(file);
      await this.storageService.createFile(b64Contents, file);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw err;
    } finally {
      queryRunner.release();
    }

    return file;
  }

  async markFileAsUsed(fileKey: string): Promise<boolean> {
    const update = await this.fileMetadataRepository
      .createQueryBuilder()
      .update({
        used: true,
      })
      .where('validUntil > :date', {
        date: new Date(Date.now()),
      })
      .andWhere({
        key: fileKey,
        used: false,
      })
      .execute();

    return update.affected > 0;
  }

  async fetchFileContents(fileKey: string): Promise<string | null> {
    const file = await this.fileMetadataRepository.findOne({
      relations: {
        contents: true,
      },
      where: {
        key: fileKey,
      },
    });

    return file?.contents?.b64Contents;
  }

  async findManyValid(sessionToken: string): Promise<FileMetadata[]> {
    return this.fileMetadataRepository
      .createQueryBuilder('file')
      .innerJoinAndSelect('file.session', 'session', 'session.token = :token', { token: sessionToken })
      .leftJoinAndSelect('file.purpose', 'purpose')
      .where('file.used = :used', { used: false })
      .getMany();
  }
}
