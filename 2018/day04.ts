import readInput from '../utils/readInput.ts';
import { highestByKey } from '../utils/reducers.ts';

const input = readInput();

const makeDate = (matches: RegExpMatchArray) =>
  new Date(
    Date.UTC(
      parseInt(matches[1], 10) + 500,
      parseInt(matches[2], 10) - 1,
      parseInt(matches[3], 10),
      parseInt(matches[4], 10),
      parseInt(matches[5], 10),
    ),
  );

const parseLog = (str: string): [Date, string] => {
  const match = str.match(
    /^\[([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2})] (.*)/,
  );
  if (!match) throw new Error(`Invalid log format: ${str}`);
  return [makeDate(match), match[6]];
};

const logs = input.split('\n').sort().map(parseLog);

let guardNumber = -1;
let sleepStart: Date | null = null;
type GuardRecord = {
  id: number;
  totalSleep: number;
  minutes: number[];
  mostSleeps: number;
  bestMinute: number;
};
const emptyGuardRecord: GuardRecord = {
  totalSleep: -1,
  id: 0,
  minutes: [],
  bestMinute: 0,
  mostSleeps: -1,
};

const records: Record<number, GuardRecord> = {};

const setGuardNumber = (str: string) => {
  const match = str.match(/Guard #([0-9]+)/);
  if (!match) throw new Error(`Invalid guard format: ${str}`);
  guardNumber = parseInt(match[1], 10);
};

logs.forEach(([date, action]: [Date, string]) => {
  if (action.startsWith('Guard')) {
    setGuardNumber(action);
  } else if (action.startsWith('falls asleep')) {
    sleepStart = date;
  } else if (action.startsWith('wakes up')) {
    if (!records[guardNumber]) {
      records[guardNumber] = {
        ...emptyGuardRecord,
        id: guardNumber,
        totalSleep: 0,
        minutes: new Array(60).fill(0),
      };
    }
    if (sleepStart === null) throw new Error('Sleep start is null');
    records[guardNumber].totalSleep +=
      (date.getTime() - sleepStart.getTime()) / 60000;
    for (
      let time = sleepStart.getTime();
      time < date.getTime();
      time += 60000
    ) {
      records[guardNumber].minutes[new Date(time).getMinutes()]++;
    }
  }
});

const recordsArray = Object.values(records).map((r: GuardRecord) => {
  const mostSleeps = Math.max(...r.minutes);
  return {
    ...r,
    mostSleeps,
    bestMinute: r.minutes.indexOf(mostSleeps),
  };
});

export const part1 = () => {
  const guard = recordsArray.reduce(highestByKey('totalSleep'), {
    ...emptyGuardRecord,
    totalSleep: -1,
  });
  return guard.id * guard.bestMinute;
};

export const part2 = () => {
  const guard = recordsArray.reduce(highestByKey('mostSleeps'), {
    ...emptyGuardRecord,
    mostSleeps: -1,
  });
  return guard.id * guard.bestMinute;
};
