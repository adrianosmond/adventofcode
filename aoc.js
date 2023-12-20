console.log('Running', process.argv[2]);
const { part1, part2 } = await import(`./${process.argv[2]}`);

console.log('Part 1:');
console.log(part1());

if (part2) {
  console.log('\nPart 2:');
  console.log(part2());
} else {
  console.log('\nNo part 2 found');
}
