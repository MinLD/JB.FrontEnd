import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
const standalone = path.resolve('.next/standalone');
if (!existsSync(path.join(standalone, 'server.js'))) throw new Error('Run npm run build before preparing E2E.');
for (const [source, destination] of [['.next/static', '.next/static'], ['public', 'public']]) {
  const target = path.join(standalone, destination);
  rmSync(target, { force: true, recursive: true });
  mkdirSync(path.dirname(target), { recursive: true });
  cpSync(path.resolve(source), target, { recursive: true });
}
