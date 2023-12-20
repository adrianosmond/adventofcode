import readInput from '../utils/readInput.js';
import { splitAndMapInputLines } from '../utils/functions.js';

const input = readInput();
const data = splitAndMapInputLines(
  input.replace(/[()]/g, ''),
  ' contains ',
  (i) => i.split(/[,]? /),
);

const possibilities = {};

export const part1 = () => {
  const allIngredients = data.map(([i]) => i).flat();
  data.forEach(([ingredients, allergens]) => {
    allergens.forEach((allergen) => {
      if (!possibilities[allergen]) {
        possibilities[allergen] = ingredients;
      } else {
        possibilities[allergen] = [...possibilities[allergen]].filter((i) =>
          ingredients.includes(i),
        );
      }
    });
  });

  const possibleAllergens = Object.values(possibilities).flat();
  const allergyFree = allIngredients.filter(
    (i) => !possibleAllergens.includes(i),
  );

  return allergyFree.length;
};

export const part2 = () => {
  let changed = true;
  const done = [];

  while (changed) {
    changed = false;
    Object.entries(possibilities).forEach(([allergen, ingredients], index) => {
      if (ingredients.length === 1 && !done.includes(allergen)) {
        changed = true;
        done.push(allergen);
        Object.entries(possibilities).forEach(([a, i], idx) => {
          if (idx === index) return;
          possibilities[a] = i.filter((x) => x !== ingredients[0]);
        });
      }
    });
  }

  return Object.entries(possibilities)
    .map(([a, i]) => [a, i[0]])
    .sort((a, b) => (a[0] < b[0] ? -1 : 1))
    .map((a) => a[1])
    .join(',');
};
