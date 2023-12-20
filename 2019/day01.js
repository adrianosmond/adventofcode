import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';
import { sum } from '../utils/reducers.js';

const input = strToIntArray(readInput());

const getFuelNeededForMass = (mass) => Math.floor(mass / 3) - 2;
const getFuelNeededIncludingFuelMass = (mass) => {
  let totalFuelMass = 0;
  let lastFuelMass = getFuelNeededForMass(mass);
  while (lastFuelMass > 0) {
    totalFuelMass += lastFuelMass;
    lastFuelMass = getFuelNeededForMass(lastFuelMass);
  }
  return totalFuelMass;
};

export const part1 = () => input.map(getFuelNeededForMass).reduce(sum);

export const part2 = () =>
  input.map(getFuelNeededIncludingFuelMass).reduce(sum);
