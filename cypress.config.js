const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 2560,
  viewportHeight: 1080,

  allowCypressEnv: false,

  // Estabilização para execução headless (cy run)
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 30000,
  retries: {
    runMode: 2, // Reexecuta testes quebrados automaticamente no 'cy run'
    openMode: 0,
  },

  // Configurações globais do reporter
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: false,              
    embeddedScreenshots: true,  
    inlineAssets: true,         
    code: false,                
  },

  e2e: {
    baseUrl: 'https://dev.regente.tec.br/ords/r/regente_dev/portal/login?tz=-3:00',
    setupNodeEvents(on, config) {
      // Obrigatório para registrar o plugin do relatório
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});