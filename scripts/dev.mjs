import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { watchUiDocs } from './ui-docs.mjs';

// Start docs generation before Next, then keep it synchronized while developing.
const stopDocs = watchUiDocs();
const require = createRequire(import.meta.url);
const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', ...process.argv.slice(2)], { stdio: 'inherit' });
const shutdown = signal => { stopDocs(); child.kill(signal); };
process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
child.once('error', error => { stopDocs(); console.error(error.message); process.exitCode = 1; });
child.once('exit', (code, signal) => { stopDocs(); process.exitCode = code ?? (signal ? 1 : 0); });
