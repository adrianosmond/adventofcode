import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { intComputer } from './intComputer.js';

const input = strToIntArray(readInput(), ',');

export const part1 = () => intComputer(input, [1]).next().value;

export const part2 = () => intComputer(input, [2]).next().value;
