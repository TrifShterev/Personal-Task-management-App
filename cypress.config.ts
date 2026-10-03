import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3100",
    specPattern: "tests/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: false,
    testIsolation: true,
  },
  video: false,
  screenshotOnRunFailure: true,
  numTestsKeptInMemory: 0,
  retries: {
    runMode: 1,
    openMode: 0,
  },
});