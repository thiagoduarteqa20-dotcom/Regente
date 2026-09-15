// FRAME DO MODAL DE UNIDADES DE MEDIDA
Cypress.Commands.add('getUnidadesMedidaFrame', () => {
    cy.log('Obtendo iframe do modal de Unidades de Medida...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL PARA UNIDADES DE MEDIDA
Cypress.Commands.add('acessarUnidadesMedida', () => {
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

    cy.log('Clicando em Unidades de Medida...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Unidades de Medida')
        .should('exist')
        .click({ force: true });

    cy.url().should('include', 'unidades-de-medida');
    
    // Garante que a tabela da página carregou completamente antes de prosseguir
    cy.get('.a-IRR-table, table', { timeout: 15000 }).should('be.visible');
    cy.wait(500);
});

// CRIAR UNIDADE DE MEDIDA
Cypress.Commands.add('criarUnidadeMedida', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const descricaoRandom = `UM_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const siglaRandom = `U${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    cy.getUnidadesMedidaFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P107_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });

        cy.wrap($frame)
            .find('#P107_SIGLA')
            .should('be.visible')
            .clear({ force: true })
            .type(siglaRandom, { delay: 30 });

        cy.printPasso('unidade-medida-dados-preenchidos');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"], #B10331630203031980')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('unidade-medida-salva-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom, sigla: siglaRandom });
});

// EDITAR UNIDADE DE MEDIDA (COM ESTABILIZAÇÃO DE TABELA)
Cypress.Commands.add('editarUltimaUnidadeMedida', (descricao) => {
    cy.log('Abrindo edição do registro...');

    const termoBusca = descricao || 'UM_';

    // Aguarda a tabela sumir com o estado de carregamento do APEX
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

    cy.getUnidadesMedidaFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P107_DESCRICAO')
            .should('be.visible')
            .then(($input) => {
                const valorAtual = $input.val();
                cy.wrap($input)
                    .clear({ force: true })
                    .type(`${valorAtual}_EDITADO`, { delay: 30 });
            });

        cy.printPasso('unidade-medida-dados-alterados');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"], #B10331292220031980')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('unidade-medida-edicao-salva');
});

// DELETAR UNIDADE DE MEDIDA (COM ESTABILIZAÇÃO DE TABELA)
Cypress.Commands.add('deletarUltimaUnidadeMedida', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    const termoBusca = descricao || 'UM_';

    // Aguarda a tabela sumir com o estado de carregamento do APEX
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

    cy.getUnidadesMedidaFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"], #B10330870935031980')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('unidade-medida-confirmar-exclusao');

    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('unidade-medida-excluida-com-sucesso');
});