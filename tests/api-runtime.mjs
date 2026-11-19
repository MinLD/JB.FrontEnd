// Test-only module adapters: real services run with mocked Next request context.
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'server-only' || specifier === 'client-only') return { url: 'data:text/javascript,export{}', shortCircuit: true };
    if (specifier === 'next/headers') return { url: 'data:text/javascript,' + encodeURIComponent('export async function cookies() { return globalThis.__apiTestCookies; }'), shortCircuit: true };
    if (specifier === 'next/navigation') return { url: 'data:text/javascript,' + encodeURIComponent('export function unstable_rethrow(error) { if (error?.digest?.startsWith("NEXT_")) throw error; }'), shortCircuit: true };
    if (specifier === 'next/server') return nextResolve('next/server.js', context);
    if (specifier.startsWith('@/')) {
      const base = path.resolve('src', specifier.slice(2));
      const file = [base, `${base}.ts`, `${base}.tsx`].find(candidate => existsSync(candidate));
      if (file) return { url: pathToFileURL(file).href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
});
