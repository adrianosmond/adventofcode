import readInput from '../utils/readInput.js';

const input = readInput();
const TIME_LIMIT = 2503;
const DISTANCE_INDEX = 3;
const POINTS_INDEX = 4;

const data = input
  .replace(/ can fly/g, '')
  .replace(/ km\/s for/g, '')
  .replace(/,? seconds./g, '')
  .replace(/but then must rest for /g, '')
  .split('\n')
  .map((s) => s.split(' '))
  .map(([, speed, travelTime, restTime]) => [
    parseInt(speed, 10),
    parseInt(travelTime, 10),
    parseInt(travelTime, 10) + parseInt(restTime, 10),
  ]);

const getDistance = ([speed, travelTime, cycleTime]) => {
  const cycleDistance = speed * travelTime;
  const numFullCycles = Math.floor(TIME_LIMIT / cycleTime);
  const remainingTime = TIME_LIMIT - numFullCycles * cycleTime;
  return (
    numFullCycles * cycleDistance + speed * Math.min(remainingTime, travelTime)
  );
};

const isMoving = (time, travelTime, cycleTime) => time % cycleTime < travelTime;

const part1 = () => Math.max(...data.map(getDistance));

const part2 = () => {
  const dataWithPoints = data.map((d) => [...d, 0, 0]);
  let bestDistance = 0;

  for (let time = 0; time < TIME_LIMIT; time++) {
    dataWithPoints.forEach((reindeer) => {
      const [speed, travelTime, cycleTime] = reindeer;
      if (isMoving(time, travelTime, cycleTime)) {
        reindeer[DISTANCE_INDEX] += speed;
        bestDistance = Math.max(bestDistance, reindeer[DISTANCE_INDEX]);
      }
    });

    dataWithPoints.forEach((reindeer) => {
      if (reindeer[DISTANCE_INDEX] === bestDistance) {
        reindeer[POINTS_INDEX]++;
      }
    });
  }

  return Math.max(...dataWithPoints.map((d) => d[POINTS_INDEX]));
};

console.log('part1', part1());
console.log('part2', part2());
