import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  parseEPG(request: Request): string {
    console.log(request.body);
    return 'Monday: Nyhederne 6 – 10 / Dybvaaaaad 10 – 10:35';
  }
}
