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

//matriz
import './utilsmatrizicp'

//ciclo

import './utilsciclo'
import './utilssubciclo'


//inventario

import './utilstiposativo'
import './utilstiposmaterial'
import './utilsunidadesmedida'
import './utilstiposcondicao'
import './utilstipoinventario'
import './utilsativosinventario'
import './utilsativos'

//documento automatico
import 'cypress-mochawesome-reporter/register';