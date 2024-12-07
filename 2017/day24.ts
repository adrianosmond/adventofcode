import readInput from '../utils/readInput.ts';
import { multilineStrToIntArrays } from '../utils/functions.ts';

const input = readInput();
const ports = multilineStrToIntArrays(input, '/') as [number, number][];

const getFittingPieces = (port: number, pieces: [number, number][]) =>
  pieces.filter((p) => p[0] === port || p[1] === port);

const getStrongestBridge = (
  port: number,
  remainingPieces: [number, number][],
): number => {
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

export const part1 = () => getStrongestBridge(0, ports);

const getLongestBridge = (
  port: number,
  remainingPieces: [number, number][],
): {
  strength: number;
  length: number;
} => {
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

export const part2 = () => getLongestBridge(0, ports).strength;
