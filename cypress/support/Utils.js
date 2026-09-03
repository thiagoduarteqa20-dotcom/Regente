import { parameterTypeElements } from './elements/parameterType.elements';
// FRAME DO MODAL
Cypress.Commands.add('getParameterTypeFrame', () => {
    cy.log('Obtendo iframe do modal...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});
// GERA DADOS
Cypress.Commands.add('gerarDadosCadastro', ({
    codigo = false,
    descricao = false,
    prefixo = 'TESTE',
    codigoMin = 1,
    codigoMax = 99
} = {}) => {
    const dados = {};
    if (codigo) {
        dados.codigo = Cypress._.random(codigoMin, codigoMax).toString();
    }
    if (descricao) {
        dados.descricao =
            `${prefixo}_${Math.random().toString(36).substring(2,8).toUpperCase()}`;
    }
    cy.log(JSON.stringify(dados));
    return cy.wrap(dados);
});
// MENU
Cypress.Commands.add('navigateMenu', (menu, submenu, urlEsperada) => {
    cy.log(`Abrindo menu ${menu}`);
    cy.contains('button.a-MenuBar-label', menu)
        .click();
    cy.contains('a', submenu)
        .click();
    if(urlEsperada){
        cy.url().should('include', urlEsperada);
    }
});
// PREENCHER FORMULÁRIO
Cypress.Commands.add('preencherFormulario', (dados) => {
    cy.getParameterTypeFrame().then(($frame) => {
        if (dados.codigo) {
            cy.wrap($frame)
                .find(parameterTypeElements.codigo)
                .should('have.length', 1)
                .then(($campo) => {
                    cy.log(`Campo código encontrado: ${$campo.length}`);
                    cy.wrap($campo)
                        .clear()
                        .type(dados.codigo);
                });
        }
        if (dados.descricao) {
            cy.wrap($frame)
                .find(parameterTypeElements.descricao)
                .should('have.length', 1)
                .then(($campo) => {
                    cy.log(`Campo descrição encontrado: ${$campo.length}`);
                    cy.wrap($campo)
                        .clear()
                        .type(dados.descricao);
                });
        }
    });
});
// SALVAR
Cypress.Commands.add('salvarTipoParametro', () => {
    cy.getParameterTypeFrame().then(($frame)=>{
        cy.log('Procurando botão de salvar...');
        const criar =
            $frame.find('button:contains("Criar")');
        const editar =
            $frame.find('button:contains("Aplicar Alterações")');
        cy.log(`Botão Criar: ${criar.length}`);
        cy.log(`Botão Alterar: ${editar.length}`);
        if(criar.length){
            cy.wrap(criar).click();
        }else if(editar.length){
            cy.wrap(editar).click();
        }else{
            throw new Error('Nenhum botão encontrado.');
        }
    });
});
// ABRIR MODAL DE CRIAÇÃO
Cypress.Commands.add('createParameterType', (title = 'Cadastrar Tipo de Parâmetro') => {
    cy.log('Abrindo modal...');
    cy.contains('button.t-Button', 'Criar')
        .should('be.visible')
        .should('not.be.disabled')
        .click();
    cy.contains('.ui-dialog-title', title, { timeout: 10000 })
        .should('be.visible');
    cy.log('Modal aberto.');
    return cy.gerarDadosCadastro({
        codigo: true,
        descricao: true,
        prefixo: 'TP'
    }).then((dados) => {
        cy.preencherFormulario(dados);
        cy.printPasso('tipo-parametro-dados-preenchidos');
        cy.salvarTipoParametro();
        cy.printPasso('tipo-parametro-salvo');
        return cy.wrap(dados);
    });
});
Cypress.Commands.add('validarParametroCriado', (dados) => {
    cy.log(`Validando parâmetro: ${dados.descricao}`);
    cy.contains('table', 'Descrição do Tipo de Parâmetro')
        .should('exist');
    cy.contains(dados.descricao)
        .should('be.visible');
});