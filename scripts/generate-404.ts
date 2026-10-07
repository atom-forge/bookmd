import { copyFile } from 'node:fs/promises';

// GitHub Pages serves this prerendered catalog with HTTP 404 for unknown URLs.
await copyFile('build/404/index.html', 'build/404.html');
