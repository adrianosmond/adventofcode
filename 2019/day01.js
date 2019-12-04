const input = require('./input01'); // array of integers;

const getFuelNeededForMass = mass => Math.floor(mass / 3) - 2;
const getFuelNeededIncludingFuelMass = mass => {
  let totalFuelMass = 0;
  let lastFuelMass = getFuelNeededForMass(mass);
  while (lastFuelMass > 0) {
    totalFuelMass += lastFuelMass;
    lastFuelMass = getFuelNeededForMass(lastFuelMass);
  }
  return totalFuelMass;
};
const sum = (a, b) => a + b;

console.log('part 1:', input.map(getFuelNeededForMass).reduce(sum));
console.log('part 2:', input.map(getFuelNeededIncludingFuelMass).reduce(sum));
