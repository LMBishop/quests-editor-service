import { Injectable } from '@nestjs/common';
import { FilePurpose } from 'src/file/entity/purpose.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class SeedingService {
  constructor(private readonly entityManager: EntityManager) {}

  async seed(): Promise<void> {
    await this.entityManager.save(FilePurpose, [
      {
        id: 1,
        name: 'QUESTS_FILE',
      },
      {
        id: 2,
        name: 'CATEGORIES_FILE',
      },
      {
        id: 3,
        name: 'ITEMS_FILE',
      },
      {
        id: 4,
        name: 'MAIN_CONFIGURATION_FILE',
      },
    ]);
  }
}
