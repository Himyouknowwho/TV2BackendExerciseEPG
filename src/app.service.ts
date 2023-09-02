import { Injectable } from '@nestjs/common';
import { toDate } from 'date-fns';

interface showInstance {
  title: string;
  day?: string;
  state: string;
  time: number;
  clock?: string;
  startClock?: string;
  endClock?: string;
}
interface show {
  title: string;
  day: string;
  runtimes: runtime[];
}
interface runtime {
  startTime: string;
  endTime: string;
}
const weekDays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];
@Injectable()
export class AppService {
  parseEPG(programJSON: JSON): string {
    const program = programJSON;

    //create show objects from each start and end of show
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

    //compose showslist with all of their runtimes on each of their given days
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
        // check if this show already has a spot on the given day, and merge in runtime to runtimelist if true
        const indexOfShow = showList.findIndex(
          (element) => element.day === show.day && element.title === show.title,
        );
        if (indexOfShow > -1) {
          showList[indexOfShow].runtimes.push(show.runtimes[0]);
        } else {
          showList.push(show);
        }
      }
    }
    let result = '';
    weekDays.forEach((day) => {
      result +=
        this.makeDayHumanReadable(day, this.filterByDay(showList, day)) + '\n';
    });

    return result;
  }

  uppercaseFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  makeDayHumanReadable(day: string, showList: show[]): string {
    let result = `${this.uppercaseFirstLetter(day)}: `;
    if (showList.length > 0) {
      showList.forEach((show) => {
        result += `${show.title} `;
        for (let i = 0; i < show.runtimes.length; i++) {
          result += `${this.readableRuntime(show.runtimes[i])}`;
          if (i + 1 < show.runtimes.length) {
            result += ', ';
          }
        }
        result += ' / ';
      });
      result = result.substring(0, result.length - 3);
    } else {
      result += 'Nothing aired today';
    }
    return result;
  }

  readableRuntime(runtime: runtime): string {
    return runtime.startTime + ' - ' + runtime.endTime;
  }

  filterByDay(showList: show[], day: string): any {
    return showList.filter((show) => {
      return show.day === day;
    });
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

    return `${
      timeString[0].charAt(0) === '0' ? timeString[0].charAt(1) : timeString[0]
    }${timeString[1] !== '00' ? ':' + timeString[1] : ''}`;
  }
}
