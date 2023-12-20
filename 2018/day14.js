import readInput from '../utils/readInput.js';
import { strToIntArray } from '../utils/functions.js';

const input = parseInt(readInput(), 10);

const makeRecipes = (numRecipes, target, breakCondition) => {
  const recipes = Array(numRecipes);
  recipes[0] = 3;
  recipes[1] = 7;
  let maxRecipe = 1;
  let elf1 = 0;
  let elf2 = 1;

  while (maxRecipe < recipes.length) {
    const newScore = recipes[elf1] + recipes[elf2];
    if (newScore > 9) {
      maxRecipe++;
      recipes[maxRecipe] = Math.floor(newScore / 10);
      if (breakCondition === 2) {
        let matches = true;
        for (let i = 0; i < target.length && matches; i++) {
          matches = recipes[maxRecipe - i] === target[target.length - 1 - i];
        }
        if (matches) {
          break;
        }
      }
    }
    maxRecipe++;
    recipes[maxRecipe] = newScore % 10;
    elf1 += 1 + recipes[elf1];
    while (elf1 > maxRecipe) {
      elf1 -= maxRecipe + 1;
    }
    elf2 += 1 + recipes[elf2];
    while (elf2 > maxRecipe) {
      elf2 -= maxRecipe + 1;
    }
    if (breakCondition === 1) {
      if (maxRecipe >= target + 10) {
        break;
      }
    } else if (breakCondition === 2) {
      let matches = true;
      for (let i = 0; i < target.length && matches; i++) {
        matches = recipes[maxRecipe - i] === target[target.length - 1 - i];
      }
      if (matches) {
        break;
      }
    }
  }
  return [recipes, maxRecipe];
};

export const part1 = () => {
  const target = input;
  const [recipes] = makeRecipes(10 + target, target, 1);
  return recipes
    .filter((_, idx) => idx >= target && idx < target + 10)
    .join('');
};

export const part2 = () => {
  const target = strToIntArray(input.toString(), '');
  const [, maxRecipe] = makeRecipes(21000000, target, 2);
  return maxRecipe - target.length + 1;
};
