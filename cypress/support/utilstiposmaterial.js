// FRAME DO MODAL DE TIPOS DE MATERIAL
Cypress.Commands.add('getTiposMaterialFrame', () => {
    cy.log('Obtendo iframe do modal de Tipos de Material...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL PARA TIPOS DE MATERIAL
Cypress.Commands.add('acessarTiposMaterial', () => {
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

    cy.log('Clicando em Tipos de Material...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Tipos de Material')
        .should('exist')
        .click({ force: true });

    cy.url().should('include', 'tipo');
});

// CRIAR TIPO DE MATERIAL
Cypress.Commands.add('criarTipoMaterial', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const descricaoRandom = `MATERIAL_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    cy.getTiposMaterialFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P105_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });

        cy.printPasso('tipo-material-dados-preenchidos');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"], #B10313275096906010')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-material-salvo-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom });
});

// EDITAR TIPO DE MATERIAL (BUSCA O REGISTRO 'MATERIAL_')
Cypress.Commands.add('editarUltimoTipoMaterial', (descricao) => {
    cy.log('Abrindo edição do registro...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        cy.contains('tr', 'MATERIAL_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    cy.getTiposMaterialFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P105_DESCRICAO')
            .then(($input) => {
                const valorAtual = $input.val();
                cy.wrap($input)
                    .clear({ force: true })
                    .type(`${valorAtual}_EDITADO`, { delay: 30 });
            });

        cy.printPasso('tipo-material-dados-alterados');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"], #B10312873679906010')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-material-edicao-salva');
});

// DELETAR TIPO DE MATERIAL (BUSCA O REGISTRO 'MATERIAL_')
Cypress.Commands.add('deletarUltimoTipoMaterial', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        cy.contains('tr', 'MATERIAL_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    cy.getTiposMaterialFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"], #B10312463902906010')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('tipo-material-confirmar-exclusao');

    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('tipo-material-excluido-com-sucesso');
});