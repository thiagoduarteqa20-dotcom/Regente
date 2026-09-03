const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 2560,
  viewportHeight: 1080,

  allowCypressEnv: false,

  // Configurações globais do reporter
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    charts: false,              // Remove gráficos desnecessários
    embeddedScreenshots: true,  // Insere as prints direto no HTML
    inlineAssets: true,         // Junta tudo em um arquivo único
    code: false,                // Oculta o código, mostrando só os títulos e prints
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