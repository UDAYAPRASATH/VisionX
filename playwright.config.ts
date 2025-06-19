import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false, // Always show browser UI
  },
});
