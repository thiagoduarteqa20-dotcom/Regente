// FRAME DO MODAL DE TIPO DO INVENTÁRIO
Cypress.Commands.add('getTipoInventarioFrame', () => {
    cy.log('Obtendo iframe do modal de Tipo do Inventário...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL PARA TIPO DO INVENTÁRIO
Cypress.Commands.add('acessarTipoInventario', () => {
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

    cy.log('Clicando em Tipo do Inventário...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Tipo do Inventário')
        .should('exist')
        .click({ force: true });

    // Tratado para evitar quebra por caracteres especiais na URL (ex: 'ç', 'á')
    cy.url().should('include', 'tipo-do-inven');
    
    cy.get('.a-IRR-table, table', { timeout: 15000 }).should('be.visible');
    cy.wait(500);
});

// CRIAR TIPO DO INVENTÁRIO
Cypress.Commands.add('criarTipoInventario', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const descricaoRandom = `INV_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    cy.getTipoInventarioFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P109_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });

        cy.printPasso('tipo-inventario-dados-preenchidos');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"], #B10938271074570816')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-inventario-salvo-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom });
});

// EDITAR TIPO DO INVENTÁRIO
Cypress.Commands.add('editarUltimoTipoInventario', (descricao) => {
    cy.log('Abrindo edição do registro...');

    const termoBusca = descricao || 'INV_';

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

    cy.getTipoInventarioFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P109_DESCRICAO')
            .should('be.visible')
            .then(($input) => {
                const valorAtual = $input.val();
                cy.wrap($input)
                    .clear({ force: true })
                    .type(`${valorAtual}_EDITADO`, { delay: 30 });
            });

        cy.printPasso('tipo-inventario-dados-alterados');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-inventario-edicao-salva');
});

// DELETAR TIPO DO INVENTÁRIO
Cypress.Commands.add('deletarUltimoTipoInventario', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    const termoBusca = descricao || 'INV_';

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

    cy.getTipoInventarioFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('tipo-inventario-confirmar-exclusao');

    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('tipo-inventario-excluido-com-sucesso');
});