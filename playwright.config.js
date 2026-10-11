import fs from 'node:fs'
import { defineConfig } from '@playwright/test'

const systemChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const executablePath = process.env.GARDEN_BROWSER_PATH || (process.platform === 'darwin' && fs.existsSync(systemChrome) ? systemChrome : undefined)

export default defineConfig({
  testDir: './tests/browser',
  timeout: 90000,
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4175',
    viewport: { width: 1440, height: 960 },
    reducedMotion: 'reduce',
    // GitHub-hosted Ubuntu runners disable unprivileged user namespaces, so
    // Chromium cannot start with its sandbox there. Keep the safer default
    // locally and opt out only in the isolated CI runner.
    launchOptions: { executablePath, chromiumSandbox: !process.env.CI },
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npx vite preview --host 127.0.0.1 --port 4175 --strictPort',
    url: 'http://127.0.0.1:4175',
    reuseExistingServer: !process.env.CI,
  },
})
