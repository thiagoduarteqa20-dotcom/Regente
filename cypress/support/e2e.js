Cypress.on('uncaught:exception', (err, runnable) => { 
    return false
})
import './commands'
// parâmetros
import './parametros'
import './Utils'
// tipo de jornadas
import './jornadas'

// jornadas jornada
import './utilsjornadas'
import './utilsoperacoes'
import './utilshistorico'
//document o automatico
import 'cypress-mochawesome-reporter/register';