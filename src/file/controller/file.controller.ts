import { Body, Controller, ForbiddenException, Get, GoneException, Param, Post } from '@nestjs/common';
import { SessionService } from '../../session/service/session.service';
import { SessionTokenDto } from '../dto/session-key.dto';
import { CreateFileDto } from '../dto/create-file.dto';
import { FileService } from '../service/file.service';

@Controller('file')
export class FileController {
  constructor(
    private readonly sessionService: SessionService,
    private readonly fileService: FileService,
  ) {}

  @Post('retrieve-keys')
  async use(@Body() sessionTokenDto: SessionTokenDto) {
    const sessionMarkedAsUsed = await this.sessionService.markSessionAsUsed(sessionTokenDto.token);

    if (!sessionMarkedAsUsed) {
      throw new ForbiddenException();
    }

    const files = await this.fileService.findManyValid(sessionTokenDto.token);

    return {
      files: files.map((file) => ({
        key: file.key,
        purpose: file.purpose?.name,
        validUntil: file.validUntil,
      })),
    };
  }

  @Post('create')
  async create(@Body() createFileDto: CreateFileDto) {
    const session = await this.sessionService.findValid(createFileDto.token);

    if (!session) {
      throw new ForbiddenException();
    }

    const data = JSON.stringify(createFileDto.data);
    const b64EncodedData = Buffer.from(data).toString('base64');
    const validTo = new Date(Date.now() + 1000 * 60 * 30);

    const file = await this.fileService.createFile(b64EncodedData, createFileDto.purpose, validTo, session);
    return {
      creationDate: file.creationDate,
      validUntil: file.validUntil,
      purpose: file.purpose,
      session: {
        validUntil: file.session.validUntil,
      },
    };
  }

  @Get('retrieve-file/:key')
  async retrieve(@Param('key') key: string) {
    const fileMarkedAsUsed = await this.fileService.markFileAsUsed(key);

    if (!fileMarkedAsUsed) {
      throw new ForbiddenException();
    }

    const fileData = await this.fileService.fetchFileContents(key);
    if (!fileData) {
      throw new GoneException('This file has been deleted');
    }

    const json = JSON.parse(Buffer.from(fileData, 'base64').toString('utf8'));

    return {
      data: json,
    };
  }
}
