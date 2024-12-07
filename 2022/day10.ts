import readInput from '../utils/readInput.ts';

const input = readInput();
const instructions = input.split('\n').map((i) => {
  const [instr, val] = i.split(' ');
  return [instr, val && parseInt(val, 10)];
});

export const part1 = () => {
  let cycle = 1;
  let x = 1;
  let strengthCheck = 20;
  let strength = 0;
  instructions.forEach(([instruction, value]) => {
    if (cycle >= strengthCheck) {
      strength += strengthCheck * x;
      strengthCheck += 40;
    }
    switch (instruction) {
      case 'addx': {
        if (cycle + 1 === strengthCheck) {
          strength += strengthCheck * x;
          strengthCheck += 40;
        }
        cycle += 2;
        x += value as number;
        break;
      }
      default: {
        cycle++;
      }
    }
  });
  return strength;
};

export const part2 = () => {
  let image = '';
  let currentPixel = 0;
  let spritePosition = 1;
  const drawPixel = () => {
    if (Math.abs(spritePosition - currentPixel) <= 1) {
      image += '#';
    } else {
      image += ' ';
    }
    if (currentPixel === 39) {
      image += '\n';
      currentPixel = -1;
    }
  };
  instructions.forEach(([instruction, value]) => {
    if (instruction === 'addx') {
      drawPixel();
      currentPixel++;
      drawPixel();
      currentPixel++;
      spritePosition += value as number;
    } else {
      drawPixel();
      currentPixel++;
    }
  });
  return image;
};
