// @ts-check
import { defineConfig } from 'astro/config';

// User-pages site (faith-ogun.github.io) served from the domain root.
// When the custom domain is bought, change `site` to https://faithogundimu.com
// and keep base as '/'.
export default defineConfig({
  site: 'https://faith-ogun.github.io',
  base: '/',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
});
