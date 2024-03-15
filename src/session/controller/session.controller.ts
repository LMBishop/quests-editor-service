import { Controller, Post } from '@nestjs/common';
import { SessionService } from '../service/session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('create')
  async create() {
    const validTo = new Date(Date.now() + 1000 * 60 * 15);

    const session = await this.sessionService.createSession(validTo);

    return {
      token: session.token,
      creationDate: session.creationDate,
      validUntil: session.validUntil,
    };
  }
}
