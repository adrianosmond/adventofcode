import { readFileSync } from 'fs';

export default () =>
  readFileSync(
    process.argv[1].replace('day', 'input').replace('.js', '.txt'),
    'utf8',
  );
