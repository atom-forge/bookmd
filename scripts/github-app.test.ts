import { describe, expect, test } from 'bun:test';
import { createPublicKey, generateKeyPairSync, verify } from 'node:crypto';
import { appJwt, credentialsFromEnv, installationToken, withApp, AppAccessError } from './github-app';
import { githubHttps } from './git-source';

const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048, privateKeyEncoding: { type: 'pkcs8', format: 'pem' }, publicKeyEncoding: { type: 'spki', format: 'pem' } });
const credentials = { appId: '12345', privateKey };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

describe('GitHub App authentication', () => {
  test('reads credentials from the environment, including escaped newlines', () => {
    expect(credentialsFromEnv({})).toBeNull();
    expect(credentialsFromEnv({ BOOKMD_APP_ID: '1' })).toBeNull();
    expect(credentialsFromEnv({ BOOKMD_APP_ID: '7', BOOKMD_APP_PRIVATE_KEY: 'a\\nb' })).toEqual({ appId: '7', privateKey: 'a\nb' });
  });
  test('the app JWT is RS256-signed, short-lived and names the app', () => {
    const now = Date.UTC(2026, 9, 9, 12, 0, 0);
    const [header, payload, signature] = appJwt(credentials, now).split('.');
    expect(JSON.parse(Buffer.from(header, 'base64url').toString())).toEqual({ alg: 'RS256', typ: 'JWT' });
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString());
    expect(claims.iss).toBe('12345');
    expect(claims.exp - claims.iat).toBeLessThanOrEqual(600);
    expect(verify('RSA-SHA256', Buffer.from(`${header}.${payload}`), createPublicKey(publicKey), Buffer.from(signature, 'base64url'))).toBe(true);
  });
  test('requests a read-only token limited to one repository', async () => {
    const calls: { url: string; body?: string; auth: string }[] = [];
    const fetcher = (async (url: string, init: RequestInit = {}) => {
      calls.push({ url, body: init.body as string | undefined, auth: (init.headers as Record<string, string>).Authorization });
      return url.endsWith('/installation') ? json({ id: 99 }) : json({ token: 'ghs_secret' }, 201);
    }) as unknown as typeof fetch;
    expect(await installationToken(credentials, { owner: 'laborci', repo: 'private-course' }, fetcher)).toBe('ghs_secret');
    expect(calls[0].url).toBe('https://api.github.com/repos/laborci/private-course/installation');
    expect(calls[1].url).toBe('https://api.github.com/app/installations/99/access_tokens');
    expect(JSON.parse(calls[1].body!)).toEqual({ repositories: ['private-course'], permissions: { contents: 'read' } });
    expect(calls.every(call => call.auth.startsWith('Bearer '))).toBe(true);
  });
  test.each([[404, 'not installed'], [401, 'credentials were rejected'], [500, 'answered 500']])('explains status %p', async (status, message) => {
    const fetcher = (async () => json({}, status)) as unknown as typeof fetch;
    await expect(installationToken(credentials, { owner: 'o', repo: 'r' }, fetcher)).rejects.toThrow(AppAccessError);
    await expect(installationToken(credentials, { owner: 'o', repo: 'r' }, fetcher)).rejects.toThrow(message);
  });
  test('a refused token request is explained without leaking anything', async () => {
    const fetcher = (async (url: string) => url.endsWith('/installation') ? json({ id: 1 }) : json({}, 403)) as unknown as typeof fetch;
    await expect(installationToken(credentials, { owner: 'o', repo: 'r' }, fetcher)).rejects.toThrow('refused an access token');
  });
  test('the token reaches Git through the environment, not the URL', async () => {
    const fetcher = (async (url: string) => url.endsWith('/installation') ? json({ id: 1 }) : json({ token: 'ghs_secret' }, 201)) as unknown as typeof fetch;
    const access = await withApp(githubHttps, credentials, fetcher).authenticate!({ owner: 'o', repo: 'r' });
    expect(access.url).toBe('https://github.com/o/r.git');
    expect(access.url).not.toContain('ghs_secret');
    expect(access.env!.GIT_CONFIG_KEY_0).toBe('http.https://github.com/.extraheader');
    expect(Buffer.from(access.env!.GIT_CONFIG_VALUE_0.split(' ').at(-1)!, 'base64').toString()).toBe('x-access-token:ghs_secret');
  });
});
