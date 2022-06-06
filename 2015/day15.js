import { readInput } from '../utils/functions.js';
import { product } from '../utils/reducers.js';

const input = readInput();
const CAPACITY = 100;
const ingredients = Object.fromEntries(
  input
    .split('\n')
    .map((ingredient) => ingredient.split(/[:,] /))
    .map(([i, ...properties]) => [
      i.toLowerCase(),
      Object.fromEntries(
        properties.map((prop) =>
          prop.split(' ').map((x, idx) => (idx === 0 ? x : parseInt(x, 10))),
        ),
      ),
    ]),
);

function* getCombinations() {
  for (let sugar = 0; sugar <= CAPACITY; sugar++) {
    for (let sprinkles = 0; sprinkles <= CAPACITY - sugar; sprinkles++) {
      for (let candy = 0; candy <= CAPACITY - (sugar + sprinkles); candy++) {
        const chocolate = CAPACITY - (sugar + sprinkles + candy);
        yield [sugar, sprinkles, candy, chocolate];
      }
    }
  }
}

const getScoreForProperty = (property, sugar, sprinkles, candy, chocolate) =>
  ingredients.sugar[property] * sugar +
  ingredients.sprinkles[property] * sprinkles +
  ingredients.candy[property] * candy +
  ingredients.chocolate[property] * chocolate;

const getCookieScore = (sugar, sprinkles, candy, chocolate) =>
  ['capacity', 'durability', 'flavor', 'texture']
    .map((property) =>
      Math.max(
        0,
        getScoreForProperty(property, sugar, sprinkles, candy, chocolate),
      ),
    )
    .reduce(product);

const part1 = () => {
  let best = 0;
  for (const [sugar, sprinkles, candy, chocolate] of getCombinations()) {
    best = Math.max(getCookieScore(sugar, sprinkles, candy, chocolate), best);
  }
  return best;
};

const part2 = () => {
  let best = 0;
  for (const [sugar, sprinkles, candy, chocolate] of getCombinations()) {
    const calories = getScoreForProperty(
      'calories',
      sugar,
      sprinkles,
      candy,
      chocolate,
    );
    if (calories !== 500) continue;
    best = Math.max(getCookieScore(sugar, sprinkles, candy, chocolate), best);
  }
  return best;
};

console.log('part1', part1());
console.log('part2', part2());
