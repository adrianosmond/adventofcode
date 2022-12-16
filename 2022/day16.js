import { readInput } from '../utils/functions.js';

const input = readInput();

const data = input
  .replace(/Valve /g, '')
  .replace(/ has flow rate=/g, ', ')
  .replace(/; tunnel(s)? lead(s)? to valve(s)?/g, ',')
  .split('\n')
  .map((line) => line.split(', '))
  .map(([v, f, ...t]) => [v, parseInt(f, 10), ...t]);

const network = Object.fromEntries(
  data.map(([v, flowRate, ...tunnels]) => [v, { flowRate, tunnels }]),
);

const getShortestDistance = (start, end) => {
  const bestDistances = Object.fromEntries(
    data.map(([v]) => [v, Number.MAX_SAFE_INTEGER]),
  );
  bestDistances[start] = 0;

  const queue = [start];
  while (queue.length > 0) {
    const pos = queue.shift();
    const currentDistance = bestDistances[pos];
    network[pos].tunnels.forEach((destination) => {
      if (currentDistance + 1 < bestDistances[destination]) {
        queue.push(destination);
        bestDistances[destination] = currentDistance + 1;
      }
    });
  }
  return bestDistances[end];
};

const makePaths = () => {
  const allPaths = [];
  const distances = Object.fromEntries(
    data.filter(([v, f]) => v === 'AA' || f > 0).map(([v]) => [v, {}]),
  );

  Object.keys(distances).forEach((pos1) => {
    Object.keys(distances).forEach((pos2) => {
      if (distances[pos1][pos2]) return;
      const distance = getShortestDistance(pos1, pos2);
      distances[pos1][pos2] = distance;
      distances[pos2][pos1] = distance;
    });
  });

  const queue = [
    {
      time: 1,
      position: 'AA',
      path: 'AA',
      released: 0,
      releasedPerMin: 0,
      valves: data.filter(([, f]) => f > 0).map(([v]) => v),
    },
  ];

  while (queue.length > 0) {
    const state = queue.shift();
    const { time, position, path, released, releasedPerMin, valves } = state;

    allPaths.push({
      path,
      releasedAfter30: released + (30 - time) * releasedPerMin,
      releasedAfter26: time > 26 ? -1 : released + (26 - time) * releasedPerMin,
    });

    valves.forEach((destination) => {
      const { flowRate } = network[destination];
      const travelAndOpenTime = distances[position][destination] + 1;

      if (time + travelAndOpenTime <= 30) {
        queue.push({
          time: time + travelAndOpenTime,
          position: destination,
          path: `${path},${destination}`,
          released: released + travelAndOpenTime * releasedPerMin + flowRate,
          releasedPerMin: releasedPerMin + flowRate,
          valves: valves.filter((v) => v !== destination),
        });
      }
    });
  }
  return allPaths;
};

const paths = makePaths();

const part1 = () => {
  paths.sort((a, b) => b.releasedAfter30 - a.releasedAfter30);
  return paths[0].releasedAfter30;
};

const part2 = () => {
  const doneIn26 = paths
    .filter((p) => p.releasedAfter26 > 0)
    .sort((a, b) => b.releasedAfter26 - a.releasedAfter26);

  let best = 0;
  for (let p1 = 0; p1 < doneIn26.length; p1++) {
    const path1 = doneIn26[p1];
    const p1Parts = path1.path.split(',');
    for (let p2 = p1 + 1; p2 < doneIn26.length; p2++) {
      const path2 = doneIn26[p2];
      // Since we sorted the paths by their pressure released, if the current
      // path1 + path2 combination is less than the best we've seen we can
      // just skip all the rest of the possible path2s, as they'll be less
      if (path1.releasedAfter26 + path2.releasedAfter26 < best) break;
      if (p1Parts.every((p) => p === 'AA' || path2.path.indexOf(p) < 0)) {
        if (path1.releasedAfter26 + path2.releasedAfter26 > best) {
          best = path1.releasedAfter26 + path2.releasedAfter26;
        }
      }
    }
  }
  return best;
};

console.log('part1', part1());
console.log('part2', part2());
