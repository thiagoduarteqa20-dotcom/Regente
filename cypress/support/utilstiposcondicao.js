// FRAME DO MODAL DE TIPOS DE CONDIÇÃO
Cypress.Commands.add('getTiposCondicaoFrame', () => {
    cy.log('Obtendo iframe do modal de Tipos de Condição...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL PARA TIPOS DE CONDIÇÃO
Cypress.Commands.add('acessarTiposCondicao', () => {
    cy.log('Aguardando carregamento dos scripts do menu APEX...');
    cy.wait(1500);

    cy.log('Abrindo Parâmetros...');
    cy.get('#t_MenuNav_1i, a.a-MenuBar-label, .a-MenuBar-item a')
        .contains('Parâmetros')
        .should('exist')
        .click({ force: true });

    cy.wait(500);

    cy.log('Forçando exibição dos submenus...');
    cy.get('.a-Menu, .a-Menu-content').invoke('css', 'display', 'block');

    cy.wait(500);

    cy.log('Clicando em Tipos de Condição...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Tipos de Condição')
        .should('exist')
        .click({ force: true });

    // Ajustado para aceitar a URL codificada sem quebrar por causa do 'ç' e 'ã'
    cy.url().should('include', 'tipos-de-condi'); 
    
    cy.get('.a-IRR-table, table', { timeout: 15000 }).should('be.visible');
    cy.wait(500);
});

// CRIAR TIPO DE CONDIÇÃO
Cypress.Commands.add('criarTipoCondicao', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const descricaoRandom = `COND_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    cy.getTiposCondicaoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P103_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });

        cy.printPasso('tipo-condicao-dados-preenchidos');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"], #B10288759149581920')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-condicao-salvo-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom });
});

// EDITAR TIPO DE CONDIÇÃO
Cypress.Commands.add('editarUltimoTipoCondicao', (descricao) => {
    cy.log('Abrindo edição do registro...');

    const termoBusca = descricao || 'COND_';

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${termoBusca}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.getTiposCondicaoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P103_DESCRICAO')
            .should('be.visible')
            .then(($input) => {
                const valorAtual = $input.val();
                cy.wrap($input)
                    .clear({ force: true })
                    .type(`${valorAtual}_EDITADO`, { delay: 30 });
            });

        cy.printPasso('tipo-condicao-dados-alterados');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"], #B10288303209581920')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-condicao-edicao-salva');
});

// DELETAR TIPO DE CONDIÇÃO
Cypress.Commands.add('deletarUltimoTipoCondicao', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    const termoBusca = descricao || 'COND_';

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${termoBusca}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.getTiposCondicaoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"], #B10287965795581920')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('tipo-condicao-confirmar-exclusao');

    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('tipo-condicao-excluido-com-sucesso');
});