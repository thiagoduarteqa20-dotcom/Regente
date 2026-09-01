const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,

  allowCypressEnv: false,

  e2e: {
    baseUrl: 'https://dev.regente.tec.br/ords/r/regente_dev/portal/login?tz=-3:00',
    setupNodeEvents(on, config) {
    },
  },
});
