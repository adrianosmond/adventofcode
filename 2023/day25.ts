import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import readlineSync from 'readline-sync';
import readInput from '../utils/readInput.ts';

const input = readInput();

const connections = Object.fromEntries(
  input.split('\n').map((l) => {
    const [from, to] = l.split(': ');
    return [from, Object.fromEntries(to.split(' ').map((s) => [s, true]))];
  }),
);

let graph = 'graph G {\n';
Object.entries(connections).forEach(([from, edges]) => {
  Object.keys(edges).forEach((to) => {
    graph += `  ${from} -- ${to}\n`;
  });
});

graph += '}';

Object.entries(connections).forEach(([from, to]) => {
  Object.keys(to).forEach((k) => {
    if (!connections[k]) connections[k] = {};
    connections[k][from] = true;
  });
});

const makeAndOpenSVG = () => {
  const dotFilePath = process.argv[2].replace('day25.js', 'graph.dot');
  const svgFilePath = process.argv[2].replace('day25.js', 'graph.svg');
  writeFileSync(dotFilePath, graph);
  console.log('Generating SVG...');
  execSync(`neato -Tsvg ${dotFilePath} -o ${svgFilePath}`);
  execSync(`open ${svgFilePath}`);
};

export const part1 = () => {
  console.log("We're going to make an SVG of the graph of connections.");
  try {
    makeAndOpenSVG();
    console.log('Please enter the first connection you want to cut');
    console.log('Enter the two nodes separated by a space');
    console.log('e.g. abc xyz');
    const cuts = [];
    // In my input the answer was
    // rfq lsk
    // prk gpz
    // zhg qdv
    while (cuts.length < 3) {
      const c = readlineSync.prompt();
      if (/[a-z]{3} [a-z]{3}/.test(c)) {
        const [c1, c2] = c.trim().split(' ');
        if (connections[c1][c2]) {
          cuts.push([c1, c2]);
        } else {
          console.log(
            `There isn't a connection between "${c1}" and "${c2}" in the graph`,
          );
        }
      } else {
        console.log(
          "Something doesn't look write with that... Maybe try again?",
        );
      }
    }
    const start = Object.keys(connections)[0];
    const queue = [start];
    const seen: Record<string, boolean> = {};
    while (queue.length > 0) {
      const pos = queue.shift()!;
      seen[pos] = true;
      for (const c of Object.keys(connections[pos])) {
        if (c in seen) continue;
        if (
          (cuts[0][0] === pos && cuts[0][1] === c) ||
          (cuts[0][1] === pos && cuts[0][0] === c) ||
          (cuts[1][0] === pos && cuts[1][1] === c) ||
          (cuts[1][1] === pos && cuts[1][0] === c) ||
          (cuts[2][0] === pos && cuts[2][1] === c) ||
          (cuts[2][1] === pos && cuts[2][0] === c)
        ) {
          continue;
        }
        queue.push(c);
        seen[c] = true;
      }
    }
    const numSeen = Object.keys(seen).length;
    const numUnseen = Object.keys(connections).length - numSeen;
    if (numSeen * numUnseen === 0)
      console.log("I think you might've chosen the wrong connections to cut");
    return numSeen * numUnseen;
  } catch {
    console.log(
      'In order to run this you have to have graphvis installed and have neato available in your path',
    );
    return 0;
  }
};
