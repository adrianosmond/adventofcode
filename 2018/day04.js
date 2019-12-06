const input = require('./input04'); // multi line string

const makeDate = matches =>
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
  .map(str => {
    const match = str.match(
      /^\[([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2})] (.*)/,
    );
    return [makeDate(match), match[6]];
  });

let guardNumber = -1;
let sleepStart = null;
let records = {};

const setGuardNumber = str => {
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

records = Object.values(records).map(r => {
  const mostSleeps = Math.max(...r.minutes);
  return {
    ...r,
    mostSleeps,
    bestMinute: r.minutes.indexOf(mostSleeps),
  };
});

const part1BestGuard = records.reduce(
  (best, curr) => (curr.totalSleep > best.totalSleep ? curr : best),
  { totalSleep: -1 },
);

const part2BestGuard = records.reduce(
  (best, curr) => (curr.mostSleeps > best.mostSleeps ? curr : best),
  { mostSleeps: -1 },
);

console.log('part1:', part1BestGuard.id * part1BestGuard.bestMinute);
console.log('part2:', part2BestGuard.id * part2BestGuard.bestMinute);
