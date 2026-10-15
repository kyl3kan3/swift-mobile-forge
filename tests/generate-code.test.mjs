import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
import { readFile } from 'node:fs/promises';

async function fixture({ user = { id: 'owner' }, owned = true, allowed = true, quotaError = null } = {}) {
  let handler;
  let calls = 0;
  let quotaCalls = 0;
  const query = { select() { return this; }, eq(column, value) {
    if (column === 'user_id') assert.equal(value, 'owner');
    return this;
  }, maybeSingle: async () => ({ data: owned ? { id: 'project' } : null }) };
  const client = { auth: { getUser: async () => ({ data: { user }, error: null }) },
    from: () => query, rpc: async () => { quotaCalls++; return { data: allowed, error: quotaError }; } };
  const source = await readFile(new URL('../supabase/functions/generate-code/index.ts', import.meta.url), 'utf8');
  const context = vm.createContext({ Request, Response, TextEncoder, console,
    Deno: { env: { get: () => 'synthetic-test-value' } },
    fetch: async () => { calls++; return Response.json({ choices: [{ message: { content: 'Generated test code' } }] }); },
  });
  const module = new vm.SourceTextModule(stripTypeScriptTypes(source), { context });
  await module.link(async name => {
    const exports = name.includes('supabase-js') ? { createClient: () => client } :
      name.includes('server.ts') ? { serve: fn => { handler = fn; } } : {};
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value);
    }, { context });
  });
  await module.evaluate();
  return { handler, providerCalls: () => calls, quotaCalls: () => quotaCalls };
}
function request(token = 'session') {
  return new Request('https://example.test/generate-code', { method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: JSON.stringify({ prompt: 'Build it', platform: 'react', project: { id: 'project', name: 'Test', screens: [] } }),
  });
}
test('missing/anon authentication cannot reach provider', async () => {
  const missing = await fixture();
  assert.equal((await missing.handler(request(null))).status, 401);
  const anon = await fixture({ user: null });
  assert.equal((await anon.handler(request('anon'))).status, 401);
  const anonymousUser = await fixture({ user: { id: 'owner', is_anonymous: true } });
  assert.equal((await anonymousUser.handler(request())).status, 401);
  assert.equal(missing.providerCalls() + anon.providerCalls() + anonymousUser.providerCalls(), 0);
});
test('another user project is denied before quota or paid calls', async () => {
  const f = await fixture({ owned: false });
  assert.equal((await f.handler(request())).status, 403);
  assert.equal(f.quotaCalls(), 0);
  assert.equal(f.providerCalls(), 0);
});
test('quota exhaustion and unavailable quota fail closed', async () => {
  for (const [options, status] of [[{ allowed: false }, 429], [{ quotaError: {} }, 503]]) {
    const f = await fixture(options);
    assert.equal((await f.handler(request())).status, status);
    assert.equal(f.providerCalls(), 0);
  }
});
test('signed-in owner with quota receives generated code', async () => {
  const f = await fixture();
  const response = await f.handler(request());
  assert.equal(response.status, 200);
  assert.equal((await response.json()).generatedCode, 'Generated test code');
  assert.equal(f.providerCalls(), 2);
  assert.equal(f.quotaCalls(), 1);
});
