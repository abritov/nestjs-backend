import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@mobizerg/nest-ioredis';
import { Redis } from 'ioredis';
import { InstagramQuestEntity } from '../entities';
import { Observable, fromEvent } from 'rxjs';
import { IcLogger } from './logger';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly logger: IcLogger,
  ) {
    this.logger.setContext('RedisService');
  }

  static createCampaignChannelName(campaignId: number) {
    return `channel:${campaignId}`;
  }

  static createCampaignQuestsChannelName(campaignId: number) {
    return `campaign_quests:${campaignId}`;
  }

  publishCampaignQuest(campaignId: number, quest: InstagramQuestEntity) {
    this.logger.debug(
      `publishCampaignQuest ${campaignId} ${JSON.stringify(quest)}`,
    );
    return this.redis.publish(
      RedisService.createCampaignQuestsChannelName(campaignId),
      JSON.stringify(quest),
    );
  }

  async getInstagramQuests(
    campaignId: number,
  ): Promise<Observable<InstagramQuestEntity>> {
    this.logger.debug(`getInstagramQuests ${campaignId}`);
    const channelId = RedisService.createCampaignQuestsChannelName(campaignId);
    await this.redis.subscribe(channelId);
    return fromEvent<InstagramQuestEntity>(this.redis, channelId);
  }
}