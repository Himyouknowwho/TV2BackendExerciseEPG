import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { toDate } from 'date-fns';

  //TODO: need to find a way to cluster shows with multiple runtimes a day together
  //NOTE: we can propably expect the input list to always have the show start and end time paired in chronological order.
  //NOTE: i want to be agnostic of days of week... if the input list starts on a sunday, then it would not return correctly
  //TODO:need a way to link shows that span multiple days...

  //TODO:function for composing a show object
  // should it be an object containing all runtimes on a day,
  //or should it be that each show runtime becomes an object
interface showInstance {
  title: string;
  day?: string;
  state: string;
  time: number;
  clock?: string;
  startClock?: string;
  endClock?: string;
}
interface runtime {
  startTime: string;
  endTime: string;
}
interface show {
  title: string;
  day: string;
  runtimes: runtime[];
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  parseEPG(programJSON: JSON): any {
    const program = programJSON;
    const showInstanceList: Array<showInstance> = [];
    for (const [day, value] of Object.entries(program)) {
      const list = value as Array<showInstance>;
      list.forEach((element) => {
        const show = element as showInstance;
        show.day = day;
        show.clock = this.getClockFromSeconds(show.time);
        showInstanceList.push(show);
      });
    }

    const showList: show[] = [];
    for (let i = 0; i < showInstanceList.length; i++) {
      if (
        showInstanceList[i].state === 'begin' &&
        showInstanceList[i].title === showInstanceList[i + 1]?.title
      ) {
        const show = this.composeShowFromInstances(
          showInstanceList[i],
          showInstanceList[i + 1],
        );
        if ()
        showList.push(show);
      }
    }
    console.log('shows', showList);
    return showList;
    // return 'Monday: Nyhederne 6 – 10 / Dybvaaaaad 10 – 10:35';
  }

  composeShowFromInstances(
    startingInstance: showInstance,
    endingInstance?: showInstance,
  ): show {
    const runtime: runtime = {
      startTime: startingInstance.clock,
      endTime: endingInstance.clock,
    };
    const show: show = {
      title: startingInstance.title,
      day: startingInstance.day,
      runtimes: [runtime],
    };
    return show;
  }
  getClockFromSeconds(seconds: number): string {
    const date = toDate(seconds * 1000);
    const timeString = date.toISOString().split('T')[1].split(':');

    return `${timeString[0]}${
      timeString[1] !== '00' ? ':' + timeString[1] : ''
    }`;
  }
}
