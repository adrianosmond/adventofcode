const input = require('./input11');
const intComputer = require('./intComputer');

const MOVEMENTS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const NEW_HULL_PANEL = {
  painted: false,
  color: 0,
};

const getDimensions = hull => {
  let maxX = -1;
  let minX = 1;
  let maxY = -1;
  let minY = 1;

  const coords = Object.keys(hull).map(c =>
    c.split(',').map(i => parseInt(i, 10)),
  );

  coords.forEach(([x, y]) => {
    maxX = Math.max(x, maxX);
    minX = Math.min(x, minX);
    maxY = Math.max(y, maxY);
    minY = Math.min(y, minY);
  });

  return [minX, maxX, minY, maxY];
};

const hullRobot = startColor => {
  const robot = { x: 0, y: 0, direction: 1 };
  let coords = `${robot.x},${robot.y}`;
  const hull = {
    '0,0': { painted: false, color: startColor },
  };

  const inputs = [startColor];
  let outputIdx = 0;
  for (const output of intComputer(input, inputs)) {
    if (outputIdx % 2 === 0) {
      hull[coords].painted = true;
      hull[coords].color = output;
    } else {
      robot.direction += output === 0 ? 3 : 1;
      robot.direction %= 4;
      const movement = MOVEMENTS[robot.direction];
      robot.x += movement[0];
      robot.y += movement[1];
      coords = `${robot.x},${robot.y}`;
      if (!hull[coords]) {
        hull[coords] = { ...NEW_HULL_PANEL };
      }
      inputs.push(hull[coords].color);
    }
    outputIdx++;
  }
  return hull;
};

const day11part2 = () => {
  const hull = hullRobot(1);
  const [minX, maxX, minY, maxY] = getDimensions(hull);
  let painting = '';

  for (let y = maxY; y >= minY; y--) {
    painting += '\n';
    for (let x = minX; x <= maxX; x++) {
      const coords = `${x},${y}`;
      if (!hull[coords] || hull[coords].color === 0) {
        painting += ' ';
      } else {
        painting += '#';
      }
    }
  }

  return painting;
};

console.log('part1:', Object.values(hullRobot(0)).length);
console.log('part2:', day11part2());
