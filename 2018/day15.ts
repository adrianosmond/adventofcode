import readInput from '../utils/readInput.ts';
import { inputToCharGrid } from '../utils/functions.ts';
import { sumByKey } from '../utils/reducers.ts';

const input = readInput();

type Position = {
  row: number;
  col: number;
};

type Fighter = Position & {
  isElf: boolean;
  hitPoints: number;
  strength: number;
};

const readingOrder = (a: Position, b: Position): number =>
  a.row === b.row ? a.col - b.col : a.row - b.row;

const fewestHitpoints = (a: Fighter, b: Fighter): number =>
  a.hitPoints - b.hitPoints;

const inRange = (a: Position, b: Position): boolean =>
  (a.row - 1 === b.row && a.col === b.col) ||
  (a.row + 1 === b.row && a.col === b.col) ||
  (a.row === b.row && a.col - 1 === b.col) ||
  (a.row === b.row && a.col + 1 === b.col);

const getAdjacentSquares = (
  targets: Position[],
  cave: string[][],
): Position[] => {
  const dummy: string[] = [];
  const adj: Position[] = [];

  const testAndAdd = (row: number, col: number): void => {
    const str = `${row},${col}}`;
    if (cave[row][col] === '.' && dummy.indexOf(str) === -1) {
      dummy.push(str);
      adj.push({ row, col });
    }
  };

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    testAndAdd(target.row - 1, target.col);
    testAndAdd(target.row + 1, target.col);
    testAndAdd(target.row, target.col - 1);
    testAndAdd(target.row, target.col + 1);
  }
  return adj;
};

const manhattan = (from: Position, to: Position): number =>
  Math.abs(from.row - to.row) + Math.abs(from.col - to.col);

const createMap = (val: number, cave: string[][]): number[][] => {
  const map = [];
  for (let i = 0; i < cave.length; i++) {
    const row = [];
    for (let j = 0; j < cave[0].length; j++) {
      row.push(val);
    }
    map.push(row);
  }
  return map;
};

const addDistance = (
  from: Position,
  to: Position,
  cave: string[][],
): number => {
  const closedSet = [];
  let openSet = [from];
  const gScore = createMap(Number.MAX_SAFE_INTEGER, cave);
  gScore[from.row][from.col] = 0;
  const fScore = createMap(Number.MAX_SAFE_INTEGER, cave);
  fScore[from.row][from.col] = manhattan(from, to);

  while (openSet.length > 0) {
    openSet.sort((a, b) => fScore[a.row][a.col] - fScore[b.row][b.col]);
    const current = openSet[0];

    if (current.row === to.row && current.col === to.col) {
      return fScore[current.row][current.col];
    }

    openSet = openSet.filter(
      (x) => x.row !== current.row || x.col !== current.col,
    );
    closedSet.push(current);

    const neighbours = getAdjacentSquares([current], cave);
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      if (
        closedSet.findIndex(
          (x) => x.row === neighbour.row && x.col === neighbour.col,
        ) >= 0
      ) {
        continue;
      }

      const tentativeGScore = gScore[current.row][current.col] + 1;
      if (
        openSet.findIndex(
          (x) => x.row === neighbour.row && x.col === neighbour.col,
        ) < 0
      ) {
        openSet.push(neighbour);
      }
      if (tentativeGScore >= gScore[neighbour.row][neighbour.col]) {
        continue;
      }
      gScore[neighbour.row][neighbour.col] = tentativeGScore;
      fScore[neighbour.row][neighbour.col] =
        tentativeGScore + manhattan(neighbour, to);
    }
  }
  return -1;
};

const findClosestToTarget = (
  opts: Position[],
  target: Position,
  cave: string[][],
): (Position & { distance: number }) | null => {
  const options = [...opts]
    .map((t) => ({
      ...t,
      distance: addDistance(target, t, cave),
    }))
    .reduce((prevBest: (Position & { distance: number })[], curr) => {
      if (curr.distance === -1) return prevBest;
      if (prevBest.length === 0) return [curr];
      if (curr.distance < prevBest[0].distance) return [curr];
      if (curr.distance === prevBest[0].distance) return prevBest.concat(curr);
      return prevBest;
    }, []);
  if (options.length > 0) {
    options.sort(readingOrder);
    return options[0];
  }
  return null;
};

const makeFighter = (
  row: number,
  col: number,
  isElf: boolean,
  elfBoost = 0,
): Fighter => ({
  row,
  col,
  isElf,
  hitPoints: 200,
  strength: isElf ? 3 + elfBoost : 3,
});

const fightLoop = (
  elvesAndGoblins: Fighter[],
  map: string[][],
  elvesMayDie = true,
): number | false => {
  let fighters = [...elvesAndGoblins];
  const cave = [...map];
  let loops = 0;
  while (true) {
    for (let i = 0; i < fighters.length; i++) {
      const fighter = fighters[i];
      const targets = fighters.filter((f) => f.isElf !== fighter.isElf);
      if (targets.length === 0) {
        return loops * fighters.reduce(sumByKey('hitPoints'), 0);
      }
      let reachableWithoutMove = targets.filter((t) => inRange(fighter, t));
      let chosenTarget = null;
      if (reachableWithoutMove.length > 0) {
        reachableWithoutMove.sort(fewestHitpoints);
        [chosenTarget] = reachableWithoutMove;
      } else {
        const options = getAdjacentSquares(targets, cave);
        const moveTarget = findClosestToTarget(options, fighter, cave);
        if (moveTarget) {
          const moveOptions = getAdjacentSquares([fighter], cave);
          const bestFirstMove = findClosestToTarget(
            moveOptions,
            moveTarget,
            cave,
          );
          if (!bestFirstMove) throw new Error('No best first move found');
          cave[fighter.row][fighter.col] = '.';
          fighter.row = bestFirstMove.row;
          fighter.col = bestFirstMove.col;
          cave[fighter.row][fighter.col] = fighter.isElf ? 'E' : 'G';
          if (moveTarget.distance === 1) {
            reachableWithoutMove = targets.filter((t) => inRange(fighter, t));
            reachableWithoutMove.sort(fewestHitpoints);
            [chosenTarget] = reachableWithoutMove;
          }
        } else {
          continue;
        }
      }
      if (!chosenTarget) continue;
      chosenTarget.hitPoints -= fighter.strength;
      if (chosenTarget.hitPoints <= 0) {
        if (chosenTarget.isElf && !elvesMayDie) {
          // an elf died
          return false;
        }
        cave[chosenTarget.row][chosenTarget.col] = '.';
        if (fighters.indexOf(chosenTarget) < i) i--;
        fighters = fighters.filter((x) => x !== chosenTarget);
      }
    }
    fighters.sort(readingOrder);
    loops++;
  }
};

const makeFighters = (cave: string[][], elfBoost = 0): Fighter[] => {
  const fighters = [];
  for (let i = 0; i < cave.length; i++) {
    const row = cave[i];
    for (let j = 0; j < row.length; j++) {
      const cell = row[j];
      if (cell === 'E') {
        fighters.push(makeFighter(i, j, true, elfBoost));
      }
      if (cell === 'G') {
        fighters.push(makeFighter(i, j, false));
      }
    }
  }
  return fighters;
};

export const part1 = () => {
  const cave = inputToCharGrid(input);
  const fighters = makeFighters(cave);
  return fightLoop(fighters, cave);
};

export const part2 = () => {
  const cave = inputToCharGrid(input);
  // try different numbers for the 2nd param
  const fighters = makeFighters(cave, 31);
  return fightLoop(fighters, cave, false);
};
