import readInput from '../utils/readInput.js';

const input = readInput();

const ips = input.split('\n');

const getSupernet = (ip) => ip.replace(/\[[a-z]+\]/g, '|');
const getHypernet = (ip) =>
  ip
    .replace(/^[a-z]+\[/, '')
    .replace(/\][a-z]+$/, '')
    .replace(/\][a-z]+\[/g, '|');

const hasABBA = (s) => {
  for (let i = 0; i < s.length - 3; i++) {
    if (s[i] === s[i + 3] && s[i] !== s[i + 1] && s[i + 1] === s[i + 2]) {
      return true;
    }
  }
  return false;
};

const getABAs = (s) => {
  const abas = [];
  for (let i = 0; i < s.length - 2; i++) {
    if (s[i] === s[i + 2] && s[i] !== s[i + 1]) {
      abas.push(s.substr(i, 3));
    }
  }
  return abas;
};

export const part1 = () =>
  ips.filter((ip) => {
    const supernet = getSupernet(ip);
    const hypernet = getHypernet(ip);
    if (hasABBA(hypernet)) return false;
    return hasABBA(supernet);
  }).length;

export const part2 = () =>
  ips.filter((ip) => {
    const supernet = getSupernet(ip);
    const hypernet = getHypernet(ip);
    const abas = getABAs(supernet);
    for (let i = 0; i < abas.length; i++) {
      const aba = abas[i];
      const bab = aba[1] + aba[0] + aba[1];
      if (hypernet.includes(bab)) {
        return true;
      }
    }
    return false;
  }).length;
