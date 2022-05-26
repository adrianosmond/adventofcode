/**
 * This puzzle was a text adventure game: https://adventofcode.com/2019/day/25
 * This code allows you to play the game yourself but doesn't give a generic
 * solution to all inputs. I played and solved it manually
 */
import readlineSync from 'readline-sync';
import input from './input25.js';
import { intComputer } from './intComputer.js';

const toAsciiArray = (str) => str.split('').map((char) => char.charCodeAt(0));

let str = '';
const inputs = [];

for (const output of intComputer(input, inputs)) {
  if (output !== 10) {
    str += String.fromCharCode(output);
  } else {
    console.log(str);
    if (str === 'Command?') {
      const cmd = readlineSync.prompt();
      inputs.push(...toAsciiArray(`${cmd}\n`));
    }
    str = '';
  }
}
