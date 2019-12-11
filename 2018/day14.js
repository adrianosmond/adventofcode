const input = require('./input14');

function day14part1() {
  const target = input;
  const recipes = Array(10 + target);
  recipes[0] = 3;
  recipes[1] = 7;
  let maxRecipe = 1;
  let elf1 = 0;
  let elf2 = 1;

  while (maxRecipe < target + 10) {
    const newScore = recipes[elf1] + recipes[elf2];
    if (newScore > 9) {
      maxRecipe++;
      recipes[maxRecipe] = Math.floor(newScore / 10);
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
  }
  return recipes
    .filter((d, idx) => idx >= target && idx < target + 10)
    .join('');
}

function day14part2() {
  const target = input
    .toString()
    .split('')
    .map(i => parseInt(i, 10));

  const recipes = Array(25000000);
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
      let matches = true;
      for (let i = 0; i < target.length && matches; i++) {
        matches =
          matches && recipes[maxRecipe - i] === target[target.length - 1 - i];
      }
      if (matches) {
        break;
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
    let matches = true;
    for (let i = 0; i < target.length && matches; i++) {
      matches =
        matches && recipes[maxRecipe - i] === target[target.length - 1 - i];
    }
    if (matches) {
      break;
    }
  }
  return maxRecipe - target.length + 1;
}

console.log('part1:', day14part1());
console.log('part2:', day14part2());
