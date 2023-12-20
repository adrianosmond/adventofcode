import readInput from '../utils/readInput.js';
import { highestByKey } from '../utils/reducers.js';

const input = readInput();

const makeDate = (matches) =>
  new Date(
    Date.UTC(
      parseInt(matches[1], 10) + 500,
      parseInt(matches[2], 10) - 1,
      parseInt(matches[3], 10),
      parseInt(matches[4], 10),
      parseInt(matches[5], 10),
    ),
  );

const logs = input
  .split('\n')
  .sort()
  .map((str) => {
    const match = str.match(
      /^\[([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2})] (.*)/,
    );
    return [makeDate(match), match[6]];
  });

let guardNumber = -1;
let sleepStart = null;
let records = {};

const setGuardNumber = (str) => {
  guardNumber = parseInt(str.match(/Guard #([0-9]+)/)[1], 10);
};

logs.forEach(([date, action]) => {
  if (action.startsWith('Guard')) {
    setGuardNumber(action);
  } else if (action.startsWith('falls asleep')) {
    sleepStart = date;
  } else if (action.startsWith('wakes up')) {
    if (!records[guardNumber]) {
      records[guardNumber] = {
        id: guardNumber,
        totalSleep: 0,
        minutes: new Array(60).fill(0),
      };
    }
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

records = Object.values(records).map((r) => {
  const mostSleeps = Math.max(...r.minutes);
  return {
    ...r,
    mostSleeps,
    bestMinute: r.minutes.indexOf(mostSleeps),
  };
});

export const part1 = () => {
  const guard = records.reduce(highestByKey('totalSleep'), {
    totalSleep: -1,
  });
  return guard.id * guard.bestMinute;
};

export const part2 = () => {
  const guard = records.reduce(highestByKey('mostSleeps'), {
    mostSleeps: -1,
  });
  return guard.id * guard.bestMinute;
};
