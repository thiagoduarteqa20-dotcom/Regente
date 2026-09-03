import { jornadaElements } from './elements/jornadas.elements';

// FRAME JORNADA
Cypress.Commands.add('getJornadaFrame', () => {
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// GERAR DADOS
Cypress.Commands.add('gerarDadosJornada', ({ tipoJornada = false, prefixo = 'TESTE' } = {}) => {
    const dados = {};
    if (tipoJornada) {
        dados.tipoJornada = `${prefixo}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    return cy.wrap(dados);
});

// PREENCHER FORMULÁRIO
Cypress.Commands.add('preencherFormularioJornada', (dados) => {
    cy.getJornadaFrame().then(($frame) => {
        cy.wrap($frame).find(jornadaElements.TipoAtividade).should('have.length', 1).select(1);
        cy.wrap($frame).find(jornadaElements.TipoJornada).should('have.length', 1).clear().type(dados.tipoJornada);
    });
});

// SALVAR JORNADA
Cypress.Commands.add('salvarJornada', () => {
    cy.getJornadaFrame().then(($frame) => {
        const criar = $frame.find('button:contains("Criar")');
        const editar = $frame.find('button:contains("Aplicar Alterações")');
        if (criar.length) {
            cy.wrap(criar).click();
        } else if (editar.length) {
            cy.wrap(editar).click();
        } else {
            throw new Error('Botão salvar jornada não encontrado');
        }
    });
});

// CRIAR JORNADA
Cypress.Commands.add('createJornada', (title = 'Criar - Tipo de Jornada') => {
    cy.contains('button.t-Button', 'Criar').should('be.visible').click();
    cy.contains('.ui-dialog-title', title).should('be.visible');

    cy.gerarDadosJornada({ tipoJornada: true, prefixo: 'TP' }).then((dados) => {
        cy.preencherFormularioJornada(dados);
        cy.printPasso('01-criar-dados-preenchidos');
        cy.salvarJornada();
        cy.printPasso('02-criar-salvo');
    });
});

// EDITAR JORNADA
Cypress.Commands.add('editarJornada', () => {
    cy.get('span[role="img"][aria-label="Edit"].fa.fa-edit').last().should('be.visible').click();
    cy.getJornadaFrame().then(($frame) => {
        cy.wrap($frame).find(jornadaElements.TipoJornada).should('have.length', 1).clear().type('editado');
        
        cy.printPasso('03-editar-dados-alterados'); 
        
        cy.wrap($frame).find('button').contains('Aplicar Alterações').should('exist').click();
        
        cy.printPasso('04-editar-alteracao-salva');
    });
});

// EXCLUIR JORNADA
Cypress.Commands.add('excluirJornada', () => {
    cy.get('span[role="img"][aria-label="Edit"].fa.fa-edit').last().should('be.visible').click();
    cy.wait(2000);
    
    cy.printPasso('05-excluir-selecionado'); 
    cy.get('iframe', { timeout: 20000 }).should('exist').then(($iframes) => {
        let encontrou = false;
        for (let i = 0; i < $iframes.length; i++) {
            const body = $iframes[i].contentDocument?.body;
            if (!body) continue;
            
            const botaoDelete = body.querySelector('button[data-otel-label="DELETE"]');
            if (botaoDelete) {
                encontrou = true;
                cy.wrap(body).find('button[data-otel-label="DELETE"]')
                  .should('be.visible').should('not.be.disabled')
                  .click();
                break;
            }
        }
        if (!encontrou) throw new Error('Botão DELETE não apareceu.');
    });

    cy.get('button.js-confirmBtn', { timeout: 20000 }).should('be.visible').contains('Deletar');
    cy.get('button.js-confirmBtn').click();
    
    cy.printPasso('06-exclusao-concluida');
});