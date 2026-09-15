// FRAME DO MODAL DE ATIVOS
Cypress.Commands.add('getAtivosFrame', () => {
    cy.log('Obtendo iframe do modal de Ativos...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO PARA ATIVOS
Cypress.Commands.add('acessarAtivos', () => {
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

    cy.log('Clicando em Ativos...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Ativos')
        .should('exist')
        .click({ force: true });

    cy.url().should('include', 'ativos');
    cy.get('.a-IRR-table, table', { timeout: 15000 }).should('be.visible');
    cy.wait(500);
    cy.printPasso('ativos-tela-acessada');
});

// CRIAR ATIVO
Cypress.Commands.add('criarAtivo', () => {
    cy.log('Abrindo modal de criação de Ativo...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');
    cy.printPasso('ativos-modal-criacao-aberto');

    const descRandom = `ATIVO_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P117_CD_TP_ATIVO')
            .should('be.visible')
            .children('option')
            .eq(1)
            .then(($opt) => {
                cy.wrap($frame).find('#P117_CD_TP_ATIVO').select($opt.val(), { force: true });
            });

        cy.wrap($frame)
            .find('#P117_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descRandom, { delay: 30 });

        cy.wrap($frame)
            .find('#P117_TP_REFERENCIA_ESPACIAL_0')
            .check({ force: true });

        cy.wrap($frame)
            .find('#P117_DH_INICIO_VIGENCIA_input')
            .clear({ force: true })
            .type('01/01/2026', { delay: 20 });

        cy.wrap($frame)
            .find('#P117_DH_FIM_VIGENCIA_input')
            .clear({ force: true })
            .type('31/12/2030', { delay: 20 });

        cy.wrap($frame).find('#P117_CONDICOES_0').check({ force: true });
        cy.wrap($frame).find('#P117_CONDICOES_5').check({ force: true });
        cy.wrap($frame).find('#P117_MATERIAIS_0').check({ force: true });
        cy.wrap($frame).find('#P117_HIERARQUIAS_4').check({ force: true });

        cy.printPasso('ativos-formulario-preenchido');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('ativos-criado-com-sucesso');
    return cy.wrap({ descricao: descRandom });
});

// EDITAR ATIVO POR DESCRIÇÃO
Cypress.Commands.add('editarAtivoPorDescricao', (descricao) => {
    cy.log(`Abrindo edição do Ativo: ${descricao}...`);

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${descricao}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);
    cy.printPasso('ativos-modal-edicao-aberto');

    const novaDescricao = `${descricao}_EDITADO`;

    cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P117_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(novaDescricao, { delay: 30 });

        cy.printPasso('ativos-edicao-preenchida');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('ativos-edicao-salva');
    return cy.wrap({ novaDescricao });
});

// CONFIGURAR CAMPOS DO ATIVO
Cypress.Commands.add('configurarCamposAtivo', (descricao) => {
    cy.log(`Acessando configuração de campos para o Ativo: ${descricao}...`);

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${descricao}")`)
        .last()
        .scrollIntoView()
        .find('a[href*="campos-do-ativo"]')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);
    cy.printPasso('ativos-config-campos-aberta');

    cy.log('Criando campo customizado...');
    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const nomeCampo = `CAMPO_${Math.floor(Math.random() * 1000)}`;
    const aliasCampo = `AL_${Math.floor(Math.random() * 1000)}`;

    cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame).find('#P111_NOME_CAMPO').type(nomeCampo, { delay: 30 });
        cy.wrap($frame).find('#P111_ALIAS_CAMPO').type(aliasCampo, { delay: 30 });

        cy.wrap($frame).find('#P111_CD_TP_DADO_CAMPO').children('option').eq(1).then(($opt) => {
            cy.wrap($frame).find('#P111_CD_TP_DADO_CAMPO').select($opt.val(), { force: true });
        });

        cy.wrap($frame).find('#P111_DH_INICIO_VIGENCIA_input').type('01/01/2026', { delay: 20 });
        cy.wrap($frame).find('#P111_DH_FIM_VIGENCIA_input').type('31/12/2030', { delay: 20 });

        cy.printPasso('ativos-campo-customizado-preenchido');

        cy.wrap($frame).find('button[data-otel-label="CREATE"]').click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('ativos-campo-customizado-criado');

    // Editar o campo recém criado
    cy.log('Editando campo customizado criado...');
    cy.get('tbody tr').last().find('span.fa-edit').parents('a').first().click({ force: true });
    cy.wait(1500);

    cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame).find('#P111_NOME_CAMPO').clear().type(`${nomeCampo}_MOD`, { delay: 30 });
        cy.printPasso('ativos-campo-customizado-editado');
        cy.wrap($frame).find('button[data-otel-label="SAVE"]').click({ force: true });
    });

    cy.wait(2000);

    // Deletar o campo criado
    cy.log('Deletando campo customizado...');
    cy.get('tbody tr').last().find('span.fa-edit').parents('a').first().click({ force: true });
    cy.wait(1500);

    cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame).find('button[data-otel-label="DELETE"]').click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('ativos-campo-customizado-confirmacao-delecao');

    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 }).click({ force: true });
    cy.wait(2000);
    cy.printPasso('ativos-campo-customizado-deletado');

    cy.go('back');
    cy.wait(1500);
});

// DELETAR ATIVO POR DESCRIÇÃO
Cypress.Commands.add('deletarAtivoPorDescricao', (descricao) => {
    cy.log(`Abrindo Ativo para exclusão: ${descricao}...`);

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${descricao}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('ativos-confirmacao-exclusao');

    cy.log('Confirmando exclusão do Ativo...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('ativos-deletado');
});