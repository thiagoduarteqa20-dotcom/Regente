Cypress.on('uncaught:exception', (err, runnable) => { 
    return false
})
import './commands'
// parâmetros
import './parametros'
import './Utils'
// jornadas
import './jornadas'
import './utilsjornada'
//icp
import './utilsnivelIcp'
//idade
import './utilsnivelidade'
// nivel vdm
import './utilsnivelvdm'

//icp conceitual
import './utilsconceitual'