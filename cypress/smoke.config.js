// Cypress config for the CI smoke test. Jenkins runs it in the cypress/included
// image with only the cypress/ folder copied in (no project node_modules), so
// it must not load plugins or require other packages.
module.exports = {
  viewportWidth: 1280,
  defaultCommandTimeout: 8888,
  chromeWebSecurity: false,
  video: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000',
    specPattern: 'e2e/smoke.cy.js',
    supportFile: false,
  },
};
