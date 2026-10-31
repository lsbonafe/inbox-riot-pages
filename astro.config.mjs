import { defineConfig } from 'astro/config';
import { loadInstance } from './config/instance.mjs';

const { site } = loadInstance();

export default defineConfig({
  site: site.origin,
  base: site.base,
  output: 'static'
});
