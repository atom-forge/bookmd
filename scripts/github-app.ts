import { createSign } from 'node:crypto';
import type { GitAccess, GitTransport } from './git-source';

/** A GitHub App installed by a course author: read-only access to the repositories they selected. */
export type AppCredentials = { appId: string; privateKey: string };

export class AppAccessError extends Error {
  constructor(message: string) { super(message); this.name = 'AppAccessError'; }
}

export function credentialsFromEnv(env: Record<string, string | undefined> = process.env): AppCredentials | null {
  const appId = env.BOOKMD_APP_ID?.trim();
  const privateKey = env.BOOKMD_APP_PRIVATE_KEY?.replace(/\\n/g, '\n').trim();
  return appId && privateKey ? { appId, privateKey } : null;
}

const base64url = (value: string | Buffer) => Buffer.from(value).toString('base64url');

/** Short-lived (max 10 minutes) token that identifies the app itself. */
export function appJwt(credentials: AppCredentials, now = Date.now()): string {
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({ iat: Math.floor(now / 1000) - 60, exp: Math.floor(now / 1000) + 540, iss: credentials.appId }));
  const signature = createSign('RSA-SHA256').update(`${header}.${payload}`).sign(credentials.privateKey);
  return `${header}.${payload}.${base64url(signature)}`;
}

const api = 'https://api.github.com';
const headers = (jwt: string) => ({ Authorization: `Bearer ${jwt}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'bookmd' });

/** Installation token for one repository with read-only contents access. Never log the result. */
export async function installationToken(credentials: AppCredentials, source: { owner: string; repo: string }, fetcher: typeof fetch = fetch, now = Date.now()): Promise<string> {
  const jwt = appJwt(credentials, now);
  const found = await fetcher(`${api}/repos/${source.owner}/${source.repo}/installation`, { headers: headers(jwt) });
  if (found.status === 404) throw new AppAccessError(`the BookMD GitHub App is not installed on ${source.owner}/${source.repo} (or the repository does not exist); ask the course author to install it and select this repository`);
  if (found.status === 401) throw new AppAccessError('the GitHub App credentials were rejected (check BOOKMD_APP_ID and BOOKMD_APP_PRIVATE_KEY)');
  if (!found.ok) throw new AppAccessError(`GitHub answered ${found.status} while looking for the app installation`);
  const { id } = await found.json() as { id: number };
  const created = await fetcher(`${api}/app/installations/${id}/access_tokens`, {
    method: 'POST', headers: { ...headers(jwt), 'Content-Type': 'application/json' },
    body: JSON.stringify({ repositories: [source.repo], permissions: { contents: 'read' } })
  });
  if (!created.ok) throw new AppAccessError(`GitHub refused an access token for ${source.owner}/${source.repo} (${created.status}); the app installation may be suspended or lack Contents: read access`);
  return (await created.json() as { token: string }).token;
}

/** Adds app-authenticated access to a transport. The token reaches Git through the environment, never argv or the URL. */
export function withApp(transport: GitTransport, credentials: AppCredentials, fetcher: typeof fetch = fetch): GitTransport {
  return {
    ...transport,
    async authenticate(source): Promise<GitAccess> {
      const token = await installationToken(credentials, source, fetcher);
      // On GitHub Actions this makes the runner mask the token in every log line, in case anything ever prints it.
      if (process.env.GITHUB_ACTIONS === 'true') console.log(`::add-mask::${token}`);
      const header = `AUTHORIZATION: basic ${Buffer.from(`x-access-token:${token}`).toString('base64')}`;
      return { url: transport.url(source), env: { GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'http.https://github.com/.extraheader', GIT_CONFIG_VALUE_0: header } };
    }
  };
}
