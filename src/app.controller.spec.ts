import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as request from 'supertest';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    const baseURL = 'http://localhost:3000/';
    const baseAPIRequest = request(baseURL);

    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
    it('should return a days program in a human readable form', async () => {
      const req = await baseAPIRequest
        .post('epg/parse')
        .send(mondayJSON)
        .expect(201)
        .then(async (response) => {
          expect(response.text.replace(/\s/g, '')).toEqual(
            humanReadableMonday.replace(/\s/g, ''), //replace whitespaces to only compare content
          );
        });
    });

    it('should return a full weeks program in a human readable form', async () => {
      const req = await baseAPIRequest
        .post('epg/parse')
        .send(fullProgramJson)
        .expect(201)
        .then(async (response) => {
          expect(response.text.replace(/\s/g, '')).toEqual(
            fullHumanReadableProgram.replace(/\s/g, ''), //replace whitespaces to only compare content
          );
        });
    });
  });
});

const mondayJSON = {
  monday: [
    {
      title: 'Nyhederne',
      state: 'begin',
      time: 21600,
    },
    {
      title: 'Nyhederne',
      state: 'end',
      time: 36000,
    },
    {
      title: 'Dybvaaaaad',
      state: 'begin',
      time: 36000,
    },
    {
      title: 'Dybvaaaaad',
      state: 'begin',
      time: 38100,
    },
  ],
};

const humanReadableMonday = `Monday: Nyhederne 6 - 10 / Dybvaaaaad 10 - 10:35\n
Tuesday: Nothing aired today\n
Wednesday: Nothing aired today\n
Thursday: Nothing aired today\n
Friday: Nothing aired today\n
Saturday: Nothing aired today\n
Sunday: Nothing aired today\n`;

const fullHumanReadableProgram = `Monday: Nyhederne 6 - 10 / Dybvaaaaad 10 - 10:35
Tuesday: Nothing aired today
Wednesday: Nyhederne 6 - 12, 21 - 21:30 / Fodbold 14 - 15:30
Thursday: ESL 12 - 13 / ESLPro 23 - 1
Friday: Nothing aired today
Saturday: Comedy 14:30 - 16:30 / Nybyggerne 22:40 - 1:30
Sunday: Dybvaaaaad 11:30 - 12`;

const fullProgramJson = {
  monday: [
    {
      title: 'Nyhederne',
      state: 'begin',
      time: 21600,
    },
    {
      title: 'Nyhederne',
      state: 'end',
      time: 36000,
    },
    {
      title: 'Dybvaaaaad',
      state: 'begin',
      time: 36000,
    },
    {
      title: 'Dybvaaaaad',
      state: 'begin',
      time: 38100,
    },
  ],
  tuesday: [],
  wednesday: [
    {
      title: 'Nyhederne',
      state: 'begin',
      time: 21600,
    },
    {
      title: 'Nyhederne',
      state: 'end',
      time: 43200,
    },
    {
      title: 'Fodbold',
      state: 'begin',
      time: 50400,
    },
    {
      title: 'Fodbold',
      state: 'end',
      time: 55800,
    },
    {
      title: 'Nyhederne',
      state: 'begin',
      time: 75600,
    },
    {
      title: 'Nyhederne',
      state: 'end',
      time: 77400,
    },
  ],
  thursday: [
    {
      title: 'ESL',
      state: 'begin',
      time: 43200,
    },
    {
      title: 'ESL',
      state: 'end',
      time: 46800,
    },
    {
      title: 'ESLPro',
      state: 'begin',
      time: 82800,
    },
  ],
  friday: [
    {
      title: 'ESLPro',
      state: 'end',
      time: 3600,
    },
  ],
  saturday: [
    {
      title: 'Comedy',
      state: 'begin',
      time: 52200,
    },
    {
      title: 'Comedy',
      state: 'end',
      time: 59400,
    },
    {
      title: 'Nybyggerne',
      state: 'begin',
      time: 81600,
    },
  ],
  sunday: [
    {
      title: 'Nybyggerne',
      state: 'end',
      time: 5400,
    },
    {
      title: 'Dybvaaaaad',
      state: 'begin',
      time: 41400,
    },
    {
      title: 'Dybvaaaaad',
      state: 'end',
      time: 43200,
    },
  ],
};
