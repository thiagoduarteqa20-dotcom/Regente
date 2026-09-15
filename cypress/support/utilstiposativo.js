// FRAME DO MODAL
Cypress.Commands.add('getTiposAtivoFrame', () => {
    cy.log('Obtendo iframe do modal de Tipos de Ativo...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL CORRIGIDA PARA TIPOS DE ATIVO
Cypress.Commands.add('acessarTiposAtivo', () => {
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

    cy.log('Clicando em Tipos de Ativo...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Tipos de Ativo')
        .should('exist')
        .click({ force: true });

    cy.url().should('include', 'tipo');
});

// CRIAR TIPO DE ATIVO
Cypress.Commands.add('criarTipoAtivo', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const descricaoRandom = `ATIVO_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    cy.getTiposAtivoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P101_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });

        cy.printPasso('tipo-ativo-dados-preenchidos');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"], #B10207853400457142')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-ativo-salvo-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom });
});

// EDITAR TIPO DE ATIVO (RECEBE DESCRIÇÃO OU BUSCA REGISTRO DE TESTE 'ATIVO_')
Cypress.Commands.add('editarUltimoTipoAtivo', (descricao) => {
    cy.log('Abrindo edição do registro...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        // Localiza a linha da tabela que possui o prefixo de teste 'ATIVO_'
        cy.contains('tr', 'ATIVO_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    cy.getTiposAtivoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P101_DESCRICAO')
            .then(($input) => {
                const valorAtual = $input.val();
                cy.wrap($input)
                    .clear({ force: true })
                    .type(`${valorAtual}_EDITADO`, { delay: 30 });
            });

        cy.printPasso('tipo-ativo-dados-alterados');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"], #B10207496122457142')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-ativo-edicao-salva');
});

// DELETAR TIPO DE ATIVO (RECEBE DESCRIÇÃO OU BUSCA REGISTRO DE TESTE)
Cypress.Commands.add('deletarUltimoTipoAtivo', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        // Filtra pela linha que contém 'ATIVO_' ou '_EDITADO'
        cy.contains('tr', 'ATIVO_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    cy.getTiposAtivoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"], #B10207080746457142')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('tipo-ativo-confirmar-exclusao');

    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('tipo-ativo-excluido-com-sucesso');
});