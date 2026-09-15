// ACESSAR MENU CICLOS
Cypress.Commands.add('acessarCiclos', () => {
    cy.log('Abrindo Parâmetros');
    cy.get('#t_MenuNav_1i')
        .should('be.visible')
        .click();

    cy.log('Hover no item Ciclos');
    cy.contains('.a-Menu-label, .a-Tree-label, span, a', 'Ciclos')
        .should('exist')
        .then(($menu) => {
            cy.wrap($menu).trigger('mouseover');
            cy.wrap($menu).trigger('mouseenter');
        });

    cy.wait(1000);

    cy.log('Exibindo submenu e clicando em Ciclo');
    cy.get('.a-Menu').invoke('css', 'display', 'block');

    cy.contains('a', /^Ciclo$/i)
        .should('be.visible')
        .click({ force: true });

    cy.url().should('include', 'ciclo');
});

// OBTER IFRAME DO MODAL DE CICLOS
Cypress.Commands.add('getCicloFrame', () => {
    return cy.get('iframe', { timeout: 30000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// GERAR DADOS DINÂMICOS
Cypress.Commands.add('gerarDadosCiclo', ({ prefixo = 'CICLO' } = {}) => {
    const sulfixo = Math.random().toString(36).substring(2, 8).toUpperCase();
    const dados = {
        nome: `${prefixo}_${sulfixo}`,
        descricao: `Descrição automatizada do ${prefixo}_${sulfixo}`,
        dtInicio: '01/01/2026',
        dtFim: '31/12/2026'
    };

    cy.log(JSON.stringify(dados));
    return cy.wrap(dados);
});

// ABRIR MODAL DE CRIAÇÃO
Cypress.Commands.add('abrirCriarCiclo', () => {
    cy.log('Abrindo modal de criação');
    cy.get('button[data-otel-label="CREATE"]')
        .should('be.visible')
        .click({ force: true });

    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .should('not.be.empty');
});

// PREENCHER FORMULÁRIO DE CICLO
Cypress.Commands.add('preencherFormularioCiclo', (dados) => {
    cy.log('Preenchendo formulário no iframe do Ciclo');

    cy.getCicloFrame().then(($frame) => {
        // Tipo de Atividade: Seleciona a 2ª opção
        cy.wrap($frame)
            .find('#P41_CD_TP_ATIVIDADE_CAMPO')
            .should('exist')
            .find('option')
            .eq(1)
            .then(($option) => {
                cy.wrap($frame)
                    .find('#P41_CD_TP_ATIVIDADE_CAMPO')
                    .select($option.val(), { force: true });
            });

        // Nome do Ciclo
        cy.wrap($frame)
            .find('#P41_NM_CICLO')
            .should('be.visible')
            .clear({ force: true })
            .type(dados.nome, { delay: 30 });

        // Descrição do Ciclo
        cy.wrap($frame)
            .find('#P41_DS_CICLO')
            .should('be.visible')
            .clear({ force: true })
            .type(dados.descricao, { delay: 20 });

        // Tipo Parâmetro: Seleciona a 3ª opção
        cy.wrap($frame)
            .find('#P41_CD_PARAMETRO')
            .should('exist')
            .find('option')
            .eq(2)
            .then(($option) => {
                cy.wrap($frame)
                    .find('#P41_CD_PARAMETRO')
                    .select($option.val(), { force: true });
            });

        // Data Início
        cy.wrap($frame)
            .find('#P41_DT_INICIO_input')
            .should('be.visible')
            .clear({ force: true })
            .type(dados.dtInicio, { delay: 30 });

        // Data Fim
        cy.wrap($frame)
            .find('#P41_DT_FIM_input')
            .should('be.visible')
            .clear({ force: true })
            .type(dados.dtFim, { delay: 30 });
    });

    cy.wait(500);
    cy.printPasso('ciclo-formulario-preenchido');
});

// CONFIRMAR CRIAÇÃO
Cypress.Commands.add('confirmarCriarCiclo', () => {
    cy.log('Submetendo cadastro no iframe');

    cy.getCicloFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#B6521182125618423, button[data-otel-label="CREATE"]')
            .first()
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('ciclo-cadastrado-com-sucesso');
});

// EDITAR ÚLTIMO CICLO
Cypress.Commands.add('editarUltimoCiclo', () => {
    cy.log('Abrindo edição do último Ciclo criado');
    cy.get('span.fa-edit, .fa-edit')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);

    cy.getCicloFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P41_DS_CICLO')
            .should('be.visible')
            .clear({ force: true })
            .type('Descrição editada do ciclo', { delay: 20 });

        cy.log('Clicando no botão Aplicar (SAVE)');
        cy.wrap($frame)
            .find('#B6520763013618423, button[data-otel-label="SAVE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('ciclo-editado-com-sucesso');
});

// DELETAR ÚLTIMO CICLO
Cypress.Commands.add('deletarUltimoCiclo', () => {
    cy.log('Abrindo edição do último Ciclo para deletar');
    cy.get('span.fa-edit, .fa-edit')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);

    cy.getCicloFrame().then(($frame) => {
        cy.log('Clicando no botão Deletar');
        cy.wrap($frame)
            .find('#B6520397486618423, button[data-otel-label="DELETE"]')
            .should('be.visible')
            .click({ force: true });
    });

    // Aguarda o modal de confirmação do APEX aparecer
    cy.wait(1500);

    cy.log('Confirmando exclusão no modal');
    cy.get('button.js-confirmBtn, .ui-button--danger')
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('ciclo-deletado-com-sucesso');
});