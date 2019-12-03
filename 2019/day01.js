const input = require('./input01'); // array of integers;

const getFuel = mass => Math.floor(mass / 3) - 2;
const sum = (a, b) => a + b;

console.log('part 1:', input.map(getFuel).reduce(sum));

const inclFuelMass = input.map(mod => {
  let totalFuelMass = 0;
  let lastFuelMass = getFuel(mod);
  while (lastFuelMass > 0) {
    totalFuelMass += lastFuelMass;
    lastFuelMass = getFuel(lastFuelMass);
  }
  return totalFuelMass;
});

console.log('part 2:', inclFuelMass.reduce(sum));
