import type { Plugin } from 'vite';
import { parse } from 'node-html-parser';
import { createHash, BinaryLike } from 'node:crypto';
import fetch from 'node-fetch';

type AlgorithmType = 'sha256' | 'sha384' | 'sha512';

type SriOptions = {
  /**
   * Choose which algorithm to use for creating integrity hashes
   *
   * @default 'sha384'
   */
  algorithm?: AlgorithmType;
  /**
   * Enable or disable adding integrity hashes to external assets
   *
   * @default true
   */
  external?: boolean;
};

export default function sri(options: SriOptions = {}): Plugin {
  const { algorithm = 'sha384', external = true } = options;

  let BASE_URL: string = '/';

  return {
    name: 'vite-plugin-sri',
    enforce: 'post',
    apply: 'build',

    async configResolved(config) {
      if (config.base !== '') {
        BASE_URL = config.base;
      }
    },

    async transformIndexHtml(html, { bundle }) {
      const document = parse(html);
      // Only get elements that do not already have an integrity attribute
      const scripts = document
        .querySelectorAll('script[src]')
        .filter((node) => !node.getAttribute('integrity'));
      const styles = document
        .querySelectorAll('link[rel="stylesheet"][href]')
        .filter((node) => !node.getAttribute('integrity'));

      await Promise.all(
        [...scripts, ...styles].map(async (node) => {
          let source: BinaryLike = '';
          const attribute = ((node.attrs?.src && 'src') || (node.attrs?.href && 'href'))!;
          const resourceUrl = node.getAttribute(attribute)!;

          // load external resource
          if (external && resourceUrl.startsWith('http')) {
            const response = await fetch(resourceUrl);

            if (response.ok && response.status === 200) {
              source = Buffer.from(await response.arrayBuffer());
            } else {
              throw new Error(`failed to load the external resource: ${resourceUrl}`);
            }
          }

          // load local resource
          if (!resourceUrl.startsWith('http')) {
            const resourceWithoutBaseUrl = resourceUrl.slice(BASE_URL.length);
            const bundleItem = bundle![resourceWithoutBaseUrl];

            if ('code' in bundleItem) {
              source = bundleItem.code;
            }
            if ('source' in bundleItem) {
              source = bundleItem.source;
            }
          }

          if (source) {
            const integrityHash = calculateIntegrityHash(source, algorithm);
            node.setAttribute('crossorigin', 'anonymous');
            node.setAttribute('integrity', integrityHash);
          }
        }),
      );

      return document.toString();
    },
  };
}

function calculateIntegrityHash(source: BinaryLike, algorithm: string) {
  const hash = createHash(algorithm).update(source).digest().toString('base64');
  return `${algorithm.toLowerCase()}-${hash}`;
}
