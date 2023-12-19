import { multilineStrToIntArrays, readInput } from '../utils/functions.js';

const input = readInput();
const ports = multilineStrToIntArrays(input, '/');

const getFittingPieces = (port, pieces) =>
  pieces.filter((p) => p[0] === port || p[1] === port);

const getStrongestBridge = (port, remainingPieces) => {
  const options = getFittingPieces(port, remainingPieces);
  if (options.length === 0) {
    return 0;
  }
  return Math.max(
    ...options.map((p) => {
      const nextPort = p[0] === port ? p[1] : p[0];
      const remainingOptions = remainingPieces.filter((opt) => opt !== p);
      return p[0] + p[1] + getStrongestBridge(nextPort, remainingOptions);
    }),
  );
};

console.log('part1:', getStrongestBridge(0, ports));

const getLongestBridge = (port, remainingPieces) => {
  const options = getFittingPieces(port, remainingPieces);
  if (options.length === 0) {
    // no connecting piecees left
    return {
      strength: 0,
      length: 0,
    };
  }
  return options
    .map((p) => {
      const nextPort = p[0] === port ? p[1] : p[0];
      const remainingOptions = remainingPieces.filter((opt) => opt !== p);
      const { strength, length } = getLongestBridge(nextPort, remainingOptions);
      return {
        strength: p[0] + p[1] + strength,
        length: 1 + length,
      };
    })
    .reduce(
      (prev, curr) => {
        if (curr.length > prev.length) {
          return curr;
        }
        if (curr.length === prev.length) {
          return curr.strength > prev.strength ? curr : prev;
        }
        return prev;
      },
      {
        strength: -1,
        length: -1,
      },
    );
};

console.log('part2:', getLongestBridge(0, ports).strength);
