// FRAME DO MODAL
Cypress.Commands.add('getSubcicloFrame', () => {
    cy.log('Obtendo iframe do modal de Subciclos...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL CORRIGIDA PARA SUBCICLO
Cypress.Commands.add('acessarSubciclo', () => {
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

    cy.log('Clicando em Subciclo...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Subciclo')
        .should('exist')
        .click({ force: true });

    cy.url().should('include', 'subciclo');
});

// GERAR DADOS SUBCICLO
Cypress.Commands.add('gerarDadosSubciclo', ({
    prefixo = 'SUBCICLO',
    dataInicio = '01/01/2026',
    dataFim = '31/12/2026'
} = {}) => {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const dados = {
        nome: `${prefixo}_${hash}`,
        descricao: `Descrição ${prefixo} ${hash}`,
        dataInicio,
        dataFim
    };
    cy.log(JSON.stringify(dados));
    return cy.wrap(dados);
});

// PREENCHER FORMULÁRIO SUBCICLO (UTILIZANDO API NATIVA DO APEX PARA LOV)
Cypress.Commands.add('preencherFormularioSubciclo', (dados) => {
    cy.getSubcicloFrame().then(($frame) => {
        // Atribuição direta via API JS do APEX
        if (dados.selecionarCiclo !== false) {
            cy.log('Selecionando o item de Ciclo via API APEX...');
            const win = $frame[0].ownerDocument.defaultView;
            const valorCiclo = dados.cicloId || '1';
            
            win.apex.item('P43_CD_CAMPO_CICLO').setValue(valorCiclo);
            cy.wrap($frame).find('#P43_CD_CAMPO_CICLO').trigger('change');
        }

        // Preencher Nome
        if (dados.nome) {
            cy.log(`Preenchendo Nome: ${dados.nome}`);
            cy.wrap($frame)
                .find('#P43_NM_SUBCICLO')
                .clear({ force: true })
                .type(dados.nome, { delay: 30 });
        }

        // Preencher Descrição
        if (dados.descricao) {
            cy.log(`Preenchendo Descrição: ${dados.descricao}`);
            cy.wrap($frame)
                .find('#P43_DS_SUBCICLO')
                .clear({ force: true })
                .type(dados.descricao, { delay: 30 });
        }

        // Preencher Data Início
        if (dados.dataInicio) {
            cy.log(`Preenchendo Data Início: ${dados.dataInicio}`);
            cy.wrap($frame)
                .find('#P43_DT_INICIO_input')
                .clear({ force: true })
                .type(dados.dataInicio, { delay: 30 });
        }

        // Preencher Data Fim
        if (dados.dataFim) {
            cy.log(`Preenchendo Data Fim: ${dados.dataFim}`);
            cy.wrap($frame)
                .find('#P43_DT_FIM_input')
                .clear({ force: true })
                .type(dados.dataFim, { delay: 30 });
        }
    });
});

// ABRIR E CRIAR SUBCICLO
Cypress.Commands.add('criarSubciclo', () => {
    cy.log('Abrindo modal de criação...');
    
    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    return cy.gerarDadosSubciclo().then((dados) => {
        dados.selecionarCiclo = true;
        cy.preencherFormularioSubciclo(dados);
        cy.printPasso('subciclo-dados-preenchidos');

        cy.getSubcicloFrame().then(($frame) => {
            cy.wrap($frame)
                .find('button[data-otel-label="CREATE"], #B6555546556198462')
                .should('be.visible')
                .click({ force: true });
        });

        cy.wait(2000);
        cy.printPasso('subciclo-salvo-com-sucesso');
        return cy.wrap(dados);
    });
});

// EDITAR ÚLTIMO SUBCICLO (BUSCA O REGISTRO 'SUBCICLO_')
Cypress.Commands.add('editarUltimoSubciclo', (descricao) => {
    cy.log('Abrindo edição do registro...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        cy.contains('tr', 'SUBCICLO_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    const novaDescricao = `SUBCICLO_EDITADO_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    cy.preencherFormularioSubciclo({
        selecionarCiclo: false,
        descricao: novaDescricao
    });

    cy.printPasso('subciclo-dados-alterados');

    cy.getSubcicloFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"], button:contains("Aplicar Alterações"), button:contains("Salvar")')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('subciclo-edicao-salva');
});

// EXCLUIR ÚLTIMO SUBCICLO (BUSCA O REGISTRO 'SUBCICLO_')
Cypress.Commands.add('deletarUltimoSubciclo', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        cy.contains('tr', 'SUBCICLO_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    cy.getSubcicloFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"], #B6554771603198461')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('subciclo-confirmar-exclusao');

    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('subciclo-excluido-com-sucesso');
});