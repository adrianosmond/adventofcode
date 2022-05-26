import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

const currentDir = dirname(fileURLToPath(import.meta.url));

const input = readFileSync(resolve(currentDir, 'input21.txt'), 'utf8');

const data = input
  .replace(/[()]/g, '')
  .split('\n')
  .map((r) => r.split(' contains ').map((i) => i.split(/[,]? /)));

const possibilities = {};

const part1 = () => {
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

const part2 = () => {
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

console.log('part1', part1());
console.log('part2', part2());
