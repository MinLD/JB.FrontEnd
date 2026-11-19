import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { updateUiDocs, watchUiDocs } from '../scripts/ui-docs.mjs';

const component = (name, summary = 'Hiển thị nhãn tái sử dụng.') => `
export type ${name}Props = { label: string };
/**
 * ${summary}
 * @remarks Truyền label; dùng ở Server Component.
 * @example
 * import { ${name} } from "@/components/ui/${name.toLowerCase()}";
 * <${name} label="Mới" />
 */
export function ${name}({ label }: ${name}Props) { return <span>{label}</span>; }
`;
function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'jobbod-ui-docs-'));
  const ui = path.join(root, 'src/components/ui'); mkdirSync(ui, { recursive: true });
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return { root, ui };
}
test('UI docs discover new components and detect changed API or descriptions', t => {
  const { root, ui } = fixture(t);
  const source = path.join(ui, 'badge.tsx'); writeFileSync(source, component('Badge'));
  updateUiDocs({ root });
  assert.match(readFileSync(path.join(ui, 'README.md'), 'utf8'), /BadgeProps/);
  updateUiDocs({ root, check: true });
  writeFileSync(source, component('Badge', 'Hiển thị trạng thái đơn hàng.'));
  assert.throws(() => updateUiDocs({ root, check: true }), /lỗi thời/);
  updateUiDocs({ root });
  writeFileSync(source, readFileSync(source, 'utf8').replace('<span>{label}</span>', '<strong>{label}</strong>'));
  assert.throws(() => updateUiDocs({ root, check: true }), /lỗi thời/);
  updateUiDocs({ root });
  assert.match(readFileSync(path.join(ui, 'README.md'), 'utf8'), /trạng thái đơn hàng/);
  writeFileSync(source, component('Badge').replace('label: string', 'label: string; disabled?: boolean'));
  assert.throws(() => updateUiDocs({ root, check: true }), /lỗi thời/);
});
test('an undocumented UI export cannot silently enter the catalog', t => {
  const { root, ui } = fixture(t);
  writeFileSync(path.join(ui, 'missing.tsx'), 'export type MissingProps = {}; export function Missing() { return null; }');
  assert.throws(() => updateUiDocs({ root }), /Missing cần JSDoc/);
  writeFileSync(path.join(ui, 'missing.tsx'), 'export default function() { return null; }');
  assert.throws(() => updateUiDocs({ root }), /export có tên/);
});
test('nested UI components stay in the parent catalog without extra README files', t => {
  const { root, ui } = fixture(t); mkdirSync(path.join(ui, 'forms'));
  writeFileSync(path.join(ui, 'forms/label.tsx'), component('Label').replace('@/components/ui/label', '@/components/ui/forms/label'));
  assert.equal(updateUiDocs({ root }), 1);
  assert.equal(existsSync(path.join(ui, 'forms/README.md')), false);
  assert.match(readFileSync(path.join(ui, 'README.md'), 'utf8'), /forms\/label.tsx/);
});
test('the development watcher updates documentation after a new component is added', async t => {
  const { root, ui } = fixture(t); writeFileSync(path.join(ui, 'badge.tsx'), component('Badge'));
  const stop = watchUiDocs(root); t.after(stop);
  writeFileSync(path.join(ui, 'notice.tsx'), component('Notice'));
  const deadline = Date.now() + 3000;
  while (!readFileSync(path.join(ui, 'README.md'), 'utf8').includes('## Notice') && Date.now() < deadline) await new Promise(resolve => setTimeout(resolve, 25));
  assert.match(readFileSync(path.join(ui, 'README.md'), 'utf8'), /## Notice/);
});
