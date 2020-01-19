import { Injectable, OnModuleInit } from '@nestjs/common';
import { InstagramStorageService } from './instagram-storage.service';
import { IcLogger } from './logger';
import { RedisService } from './redis.service';

@Injectable()
export class SchedulerService implements OnModuleInit {
  private readonly SCHEDULER_TICK_INTERVAL = 10000;
  private readonly WORKER_ID = 1;
  constructor(
    private readonly instagramStorage: InstagramStorageService,
    private readonly redis: RedisService,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('SchedulerService');
  }
  onModuleInit() {
    this.tick();
  }

  async tick() {
    this.logger.debug('tick');
    const campaigns = await this.instagramStorage.getActiveCampaigns(
      this.WORKER_ID,
    );
    if (campaigns.length > 0) {
      this.logger.debug(`tick: Got ${campaigns.length} active campaigns`);
      campaigns.forEach(c =>
        this.redis.publishCampaignQuest(c.id, {
          expireDuration: '3 seconds',
          type: { id: 1, typeName: 'post_message' },
        }),
      );
    }
    setTimeout(() => this.tick(), this.SCHEDULER_TICK_INTERVAL);
  }
}
