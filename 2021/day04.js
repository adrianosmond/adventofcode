import { sum } from '../utils/reducers.js';
import readInput from '../utils/readInput.js';
import { multilineStrToIntArrays, strToIntArray } from '../utils/functions.js';

const input = readInput();

const MARKED = -1;

const getStartState = () => {
  let [numbers, ...boards] = input.split('\n\n');

  numbers = strToIntArray(numbers, ',');
  boards = boards.map((board) => multilineStrToIntArrays(board, /\s+/));

  return [numbers, boards];
};

const isWinningBoard = (board) => {
  const allMarkedScore = MARKED * board.length;
  for (let i = 0; i < board.length; i++) {
    if (
      board[i].reduce(sum) === allMarkedScore ||
      board.map((b) => b[i]).reduce(sum) === allMarkedScore
    ) {
      return true;
    }
  }
};

const mark = (board, number) => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === number) {
        board[i][j] = MARKED;
      }
    }
  }
};

const getScore = (board, number) =>
  board
    .flat()
    .filter((n) => n !== MARKED)
    .reduce(sum) * number;

const part1 = () => {
  const [numbers, boards] = getStartState();
  while (true) {
    const number = numbers.shift();
    for (let i = 0; i < boards.length; i++) {
      mark(boards[i], number);
      if (isWinningBoard(boards[i])) {
        return getScore(boards[i], number);
      }
    }
  }
};

const part2 = () => {
  const [numbers, boards] = getStartState();
  const hasWon = new Array(boards.length).fill(0);
  while (true) {
    const number = numbers.shift();
    for (let i = 0; i < boards.length; i++) {
      if (hasWon[i]) continue;
      mark(boards[i], number);
      if (isWinningBoard(boards[i])) {
        hasWon[i] = 1;
        if (hasWon.reduce(sum) === boards.length) {
          return getScore(boards[i], number);
        }
      }
    }
  }
};

console.log('part1', part1());
console.log('part2', part2());
