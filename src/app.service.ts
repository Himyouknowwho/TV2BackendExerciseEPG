import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { toDate } from 'date-fns';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  parseEPG(request: Request): string {
    console.log(request.body);
    return 'Monday: Nyhederne 6 – 10 / Dybvaaaaad 10 – 10:35';
  }

  getTimeFromSeconds(seconds: number): string {
    const date = toDate(seconds * 1000);
    const timeString = date.toISOString().split('T')[1].split(':');

    return `${timeString[0]}${
      timeString[1] !== '00' ? ':' + timeString[1] : ''
    }`;
  }
}
