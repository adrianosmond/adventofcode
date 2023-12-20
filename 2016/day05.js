import md5 from 'spark-md5';
import readInput from '../utils/readInput.js';

const input = readInput();

let password = '';
let password2 = '________';

let i = 0;
let charsSolved = 0;

while (charsSolved < 8) {
  const hash = md5.hashBinary(`${input}${i}`);

  if (hash.startsWith('00000')) {
    if (password.length < 8) {
      password += hash.substr(5, 1);
    }
    const pos = parseInt(hash.substr(5, 1), 10);
    if (pos < password2.length && password2[pos] === '_') {
      password2 = password2.split('');
      password2[pos] = hash.substr(6, 1);
      password2 = password2.join('');
      charsSolved++;
    }
  }
  i++;
}

export const part1 = () => password;

export const part2 = () => password2;
