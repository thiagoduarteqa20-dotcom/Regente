// FRAME DO MODAL DE JORNADAS
Cypress.Commands.add('getJornadasFrame', () => {
    cy.log('Obtendo iframe do modal de Jornadas...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL PARA JORNADAS
Cypress.Commands.add('acessarJornadas', () => {
    cy.log('Aguardando carregamento dos scripts do menu APEX...');
    cy.wait(1500);

    cy.log('Abrindo menu Jornadas...');
    cy.contains('.a-MenuBar-label, .a-TreeNav-label, a, button, span', 'Jornadas', { timeout: 15000 })
        .should('exist')
        .first()
        .scrollIntoView()
        .click({ force: true });

    cy.wait(800);

    cy.log('Clicando na opção Jornadas no submenu...');
    cy.contains('.a-Menu-label, .a-Menu-link, .a-TreeNav-label, a, span', 'Jornadas')
        .should('exist')
        .last()
        .scrollIntoView()
        .click({ force: true });

    cy.url().should('include', 'jornadas');
    cy.get('.a-IRR-table, table', { timeout: 15000 }).should('be.visible');
    cy.wait(500);
});

// FUNÇÃO ROBUSTA PARA SELECIONAR ITEM NO POPUP LOV DO ORACLE APEX
const selecionarOpcaoLOV = (idCampo, valorTexto, selecionarPrimeira = false) => {
    // 1. Clica no botão para abrir o Popup LOV
    cy.getJornadasFrame().then(($frame) => {
        cy.wrap($frame)
            .find(`${idCampo}_btn, ${idCampo} + button, ${idCampo} ~ .a-Button--popupLOV, ${idCampo}`)
            .filter(':visible')
            .first()
            .scrollIntoView()
            .click({ force: true });
    });

    // Aguarda abertura do diálogo Popup LOV
    cy.wait(1000);

    // 2. Executa a seleção dentro da caixa aberta
    const executarSelecao = ($container) => {
        if (selecionarPrimeira) {
            cy.wrap($container)
                .find('.a-PopupLOV-results tr:not(:has(th)), .a-PopupLOV-results li, .a-IconList-item')
                .filter(':visible')
                .first()
                .click({ force: true });
        } else {
            // Digita no campo de busca e aciona ENTER
            cy.wrap($container)
                .find('.a-PopupLOV-searchBar input, input.a-PopupLOV-search')
                .filter(':visible')
                .last()
                .clear({ force: true })
                .type(`${valorTexto}{enter}`, { delay: 50 });

            // Aguarda o processamento do AJAX do APEX
            cy.wait(1200);

            // Busca e clica na linha/item correspondente
            cy.wrap($container)
                .find('.a-PopupLOV-results tr:not(:has(th)), .a-PopupLOV-results li, .a-IconList-item')
                .filter(':visible')
                .contains(valorTexto)
                .first()
                .click({ force: true });
        }
    };

    // Verifica se o modal LOV foi gerado no DOM principal ou dentro do iframe
    cy.get('body').then(($mainBody) => {
        const lovNoMain = $mainBody.find('.a-PopupLOV-dialog:visible, .a-PopupLOV-results:visible');
        if (lovNoMain.length > 0) {
            executarSelecao($mainBody);
        } else {
            cy.getJornadasFrame().then(($frame) => {
                executarSelecao($frame);
            });
        }
    });

    // Pausa técnica para permitir a atualização em cascata dos campos dependentes (ex: Ciclo -> Subciclo)
    cy.wait(1500);
};

// CRIAR JORNADA
Cypress.Commands.add('criarJornada', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const descricaoRandom = `JORNADA_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // 1. Preenche Descrição
    cy.getJornadasFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P61_DS_JORNADA')
            .scrollIntoView()
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });
    });

    // 2. Seleciona Responsável ("avaliadortester1")
    selecionarOpcaoLOV('#P61_CD_USU_RESPONSAVEL', 'avaliadortester1');

    // 3. Preenche Datas
    cy.getJornadasFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P61_DT_INICIO_PREVISTA_input')
            .scrollIntoView()
            .clear({ force: true })
            .type('01/01/2026', { delay: 20 });

        cy.wrap($frame)
            .find('#P61_DT_FIM_PREVISTA_input')
            .scrollIntoView()
            .clear({ force: true })
            .type('31/12/2026', { delay: 20 });
    });

    // 4. Seleciona Ciclo ("Contrato XX.0.1")
    selecionarOpcaoLOV('#P61_CD_CAMPO_CICLO', 'Contrato XX.0.1');

    // 5. Seleciona o Subciclo pegando a primeira opção válida retornada
    selecionarOpcaoLOV('#P61_CD_CAMPO_SUBCICLO', '', true);

    // 6. Seleciona Tipo de Jornada (Primeira opção disponível)
    selecionarOpcaoLOV('#P61_CD_TP_JORNADA_CAMPO', '', true);

    // Finaliza e Salva
    cy.getJornadasFrame().then(($frame) => {
        cy.printPasso('jornada-dados-preenchidos');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"]')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('jornada-salva-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom });
});

// EDITAR JORNADA
Cypress.Commands.add('editarJornadaPorDescricao', (descricao) => {
    cy.log('Abrindo edição do registro...');

    const termoBusca = descricao || 'JORNADA_';

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${termoBusca}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"], a[aria-roledescription="dialog link"]')
        .first()
        .click({ force: true });

    cy.wait(1500);

    const novaDescricao = `${termoBusca}_EDITADO`;

    cy.getJornadasFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P61_DS_JORNADA')
            .scrollIntoView()
            .should('be.visible')
            .clear({ force: true })
            .type(novaDescricao, { delay: 30 });

        cy.printPasso('jornada-dados-alterados');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"]')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('jornada-edicao-salva');
    return cy.wrap({ novaDescricao });
});

// DELETAR JORNADA
Cypress.Commands.add('deletarJornadaPorDescricao', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    const termoBusca = descricao || 'JORNADA_';

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${termoBusca}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"], a[aria-roledescription="dialog link"]')
        .first()
        .click({ force: true });

    cy.wait(1500);

    cy.getJornadasFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"]')
            .scrollIntoView()
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('jornada-confirmar-exclusao');

    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('jornada-excluida-com-sucesso');
});