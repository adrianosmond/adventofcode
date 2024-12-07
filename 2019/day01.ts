import readInput from '../utils/readInput.ts';
import { strToIntArray } from '../utils/functions.ts';
import { sum } from '../utils/reducers.ts';

const input = strToIntArray(readInput());

const getFuelNeededForMass = (mass: number) => Math.floor(mass / 3) - 2;
const getFuelNeededIncludingFuelMass = (mass: number) => {
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
