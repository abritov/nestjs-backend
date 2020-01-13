import { Controller, Post, Body, Delete } from '@nestjs/common';
import { InstagramStorageService } from '../providers';
import { CreateInstagramDto, CreateInstagramCampaignDto } from '../dto';

@Controller('instagram')
export class InstagramController {
  constructor(private readonly instagramService: InstagramStorageService) {}

  @Post()
  async createAccount(@Body() account: CreateInstagramDto) {
    return this.instagramService.addAccount(account);
  }

  @Delete()
  async deleteAccount(@Body() accountId: number) {
    return this.instagramService.deleteAccount({ id: accountId });
  }

  @Post('/campaign')
  async createCampaign(@Body() campaign: CreateInstagramCampaignDto) {
    return this.instagramService.addCampaign(campaign);
  }
}
