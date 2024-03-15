import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from '../entity/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
  ) {}

  async findOne(key: string): Promise<Session | null> {
    return await this.sessionRepository.findOneBy({ token: key });
  }

  async findValid(token: string): Promise<Session | null> {
    return await this.sessionRepository
      .createQueryBuilder('session')
      .where('session.validUntil > :date', {
        date: new Date(Date.now()),
      })
      .andWhere({
        token: token,
        used: false,
      })
      .getOne();
  }

  async createSession(validTo: Date): Promise<Session | null> {
    const session = new Session();
    session.validUntil = validTo;

    await this.sessionRepository.save(session);
    return session;
  }

  async isValidSession(token: string) {
    return (
      (await this.sessionRepository
        .createQueryBuilder('session')
        .where('session.validUntil > :date', {
          date: new Date(Date.now()),
        })
        .andWhere({
          token: token,
          used: false,
        })
        .getCount()) > 0
    );
  }

  async markSessionAsUsed(token: string): Promise<boolean> {
    const update = await this.sessionRepository
      .createQueryBuilder()
      .update({
        used: true,
      })
      .where('validUntil > :date', {
        date: new Date(Date.now()),
      })
      .andWhere({
        token: token,
        used: false,
      })
      .execute();

    return update.affected > 0;
  }
}
