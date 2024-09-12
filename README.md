# vite-plugin-html-sri

> Subresource Integrity ([SRI](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)) is a security feature that helps ensure resources fetched by your website are delivered without unexpected manipulation.
It uses integrity hashes that browsers verify before loading the resources.

- ⚡️ Adds subresource integrity at build time
- 📦 Automatically adds integrity hashes for both local assets (JavaScript and CSS files) and external resources (e.g., CDN links)
- 🔒 Enhanced security
- 🔌 Easy integration

Vite, by default, does not provide support for Subresource Integrity ([SRI](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)).
This plugin automatically generates integrity hashes for both local and external assets by transforming the html files.

## 💿 Installation

Install the package as a devDependency

```sh
yarn add vite-plugin-html-sri -D
```

## 🚀 Usage

> ❗ Note: Integrity hashes are only added to resources that do not already have an existing integrity attribute.

```sh
# vite.config.js
import { defineConfig } from 'vite';
import sri from 'vite-plugin-html-sri';

export default defineConfig({
  plugins: [
    sri(),
  ],
})
```

## Options

This plugin offers the following optional options:

```sh
# Choose which algorithm to use for creating integrity hashes
algorithm: 'sha256' | 'sha384' | 'sha512'  # default is 'sha384'

# Enable or disable adding integrity hashes to external assets
external: boolean  # default is true
```

## License

[MIT](https://choosealicense.com/licenses/mit/) © [Duc Phung](https://github.com/ducphu0ng)

If you find this project interesting or helpful, I'd love your support!
Please consider giving it a star (⭐) and following me on GitHub.

I love coding and always have new ideas, so stay tuned—your support won’t be in vain!