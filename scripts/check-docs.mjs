import fs from 'node:fs';
import path from 'node:path';
import { updateUiDocs } from './ui-docs.mjs';

const roots = ['src', 'public', 'scripts', 'tests', 'e2e'];
const files = ['README.md'];
const errors = [];
function visit(folder) {
  const readme = path.join(folder, 'README.md');
  if (fs.existsSync(readme)) files.push(readme);
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) if (entry.isDirectory()) visit(path.join(folder, entry.name));
}
for (const root of roots) if (fs.existsSync(root)) visit(root);
for (const file of files) {
  if (!fs.existsSync(file)) { errors.push(`Thiếu ${file}`); continue; }
  const content = fs.readFileSync(file, 'utf8').replace(/```[^\n]*\n[\s\S]*?```/g, '');
  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const link = match[1].replace(/^<|>$/g, '').split('#')[0];
    if (!link || /^(https?:|mailto:)/.test(link)) continue;
    if (!fs.existsSync(path.resolve(path.dirname(file), link))) errors.push(`${file}: link không tồn tại ${link}`);
  }
}
try { updateUiDocs({ check: true }); } catch (error) { errors.push(error.message); }
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`[docs] ${files.length} README có link hợp lệ; danh mục UI khớp source.`);
