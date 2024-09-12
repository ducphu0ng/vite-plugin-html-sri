import { expect, test } from 'vitest';
import sri from '../src/index';
import fs from 'fs';
import path from 'path';
import { createHash } from 'node:crypto';

test('add integrity hash', async () => {
  const fixtures = path.join(__dirname, 'fixtures');

  const mockHtml = fs.readFileSync(path.join(fixtures, 'index.html'), 'utf8');
  const mockJs = fs.readFileSync(path.join(fixtures, 'main.js'));
  const mockCss = fs.readFileSync(path.join(fixtures, 'styles.css'));
  const mockBundle: any = {
    bundle: {
      'main.js': { code: mockJs },
      'styles.css': { source: mockCss },
    },
  };

  const expectedJsHash = createHash('sha384').update(mockJs).digest().toString('base64');
  const expectedCssHash = createHash('sha384').update(mockCss).digest().toString('base64');

  const plugin: any = sri();
  const receivedHtmlString = (await plugin.transformIndexHtml(mockHtml, mockBundle)) as string;
  expect(receivedHtmlString.includes(expectedJsHash)).toBeTruthy();
  expect(receivedHtmlString.includes(expectedCssHash)).toBeTruthy();
});
