import input from './input18.js';

const map = input.split('\n').map((r) => r.split(''));

function getAdjacent(row, col) {
  const adj = {
    open: 0,
    trees: 0,
    lumberYard: 0,
  };
  const iMin = Math.max(0, row - 1);
  const iMax = Math.min(map.length - 1, row + 1);
  for (let i = iMin; i <= iMax; i++) {
    const jMin = Math.max(0, col - 1);
    const jMax = Math.min(map[row].length - 1, col + 1);
    for (let j = jMin; j <= jMax; j++) {
      if (i === row && j === col) continue;
      if (map[i][j] === '.') adj.open++;
      if (map[i][j] === '|') adj.trees++;
      if (map[i][j] === '#') adj.lumberYard++;
    }
  }

  return adj;
}

const doCycle = (adj) => {
  let lumber = 0;
  let wooded = 0;
  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const { trees, lumberYard } = adj[row][col];
      if (map[row][col] === '.') {
        if (trees >= 3) {
          map[row][col] = '|';
          wooded++;
        }
      } else if (map[row][col] === '|') {
        if (lumberYard >= 3) {
          map[row][col] = '#';
          lumber++;
        } else {
          wooded++;
        }
      } else if (map[row][col] === '#') {
        if (!(lumberYard >= 1 && trees >= 1)) {
          map[row][col] = '.';
        } else {
          lumber++;
        }
      }
    }
  }
  return [lumber, wooded];
};

const day18part1 = () => {
  let lumber = 0;
  let wooded = 0;
  for (let i = 0; i < 10; i++) {
    const adj = map.map((r, rIdx) =>
      r.map((c, cIdx) => getAdjacent(rIdx, cIdx)),
    );
    [lumber, wooded] = doCycle(adj);
  }
  return lumber * wooded;
};

const day18part2 = () => {
  const target = 1000000000;
  const patternSize = 1000;
  const seen = {};
  const scores = new Array(patternSize);
  for (let i = 11; i < patternSize; i++) {
    const adj = map.map((r, rIdx) =>
      r.map((c, cIdx) => getAdjacent(rIdx, cIdx)),
    );
    const [lumber, wooded] = doCycle(adj);

    const score = lumber * wooded;
    if (seen[score] && scores[i - 1] === scores[seen[score] - 1]) {
      const repeat = i - seen[score];
      const multiple = Math.floor((target - i) / repeat);
      const finalOffset = target - (i + multiple * repeat);
      return scores[i - finalOffset];
    }
    scores[i] = score;
    seen[score] = i;
  }
  throw new Error('No pattern found. Try increasing patternSize');
};

console.log('part1:', day18part1());
console.log('part2:', day18part2());
