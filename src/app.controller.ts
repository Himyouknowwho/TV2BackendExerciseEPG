import { Controller, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('epg')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('parse')
  parseEPG(@Req() request: Request): string {
    return this.appService.parseEPG(request.body);
  }
}
