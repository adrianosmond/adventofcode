const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'input12.txt'), 'utf8');

const connections = input.split('\n').map((r) => r.split('-'));
const graph = {};
connections.forEach(([a, b]) => {
  if (!graph[a]) graph[a] = { big: a === a.toUpperCase(), connections: [b] };
  else graph[a].connections.push(b);

  if (!graph[b]) graph[b] = { big: b === b.toUpperCase(), connections: [a] };
  else graph[b].connections.push(a);
});

const hasDuplicate = (p) => {
  const small = p.filter((s) => s.toLowerCase() === s);
  const unique = new Set([...small]);
  return small.length !== unique.size;
};

const countPaths = (allowDuplicates = false) => {
  const paths = [['start']];
  let changed = true;
  while (changed) {
    const newPaths = [];
    changed = false;
    for (let i = 0; i < paths.length; i++) {
      const p = paths[i];
      const last = p[p.length - 1];
      if (last === 'end') {
        continue;
      }
      changed = true;
      paths.splice(i, 1);
      i--;
      const node = graph[last];
      node.connections.forEach((c) => {
        if (
          c === 'start' ||
          (!graph[c].big &&
            c !== 'end' &&
            p.includes(c) &&
            (allowDuplicates ? hasDuplicate(p) : true))
        )
          return;
        const clone = p.slice(0);
        clone.push(c);
        newPaths.push(clone);
      });
    }
    newPaths.forEach((p) => {
      paths.push(p);
    });
  }

  return paths.length;
};

const part1 = () => countPaths();

const part2 = () => countPaths(true);

console.log('part1', part1());
console.log('part2', part2());
