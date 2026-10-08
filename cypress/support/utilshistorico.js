// ============================================================
// NAVEGAÇÃO PARA HISTÓRICO
// ============================================================

Cypress.Commands.add('acessarHistorico', () => {

    cy.log('Aguardando carregamento dos scripts do menu APEX...');
    cy.wait(1500);

    // ------------------------------------------------------------
    // Abre o menu Jornadas
    // ------------------------------------------------------------
    cy.log('Abrindo menu Jornadas...');
    cy.contains(
        '.a-MenuBar-label, .a-TreeNav-label, a, button, span',
        'Jornadas',
        { timeout: 15000 }
    )
        .should('exist')
        .first()
        .scrollIntoView()
        .click({ force: true });

    // ------------------------------------------------------------
    // Acessa Histórico
    // ------------------------------------------------------------
    cy.log('Clicando na opção Histórico no submenu...');
    cy.contains(
        '.a-Menu-label, .a-Menu-link, .a-TreeNav-label, a, span',
        'Histórico',
        {
            timeout: 15000,
            matchCase: false
        }
    )
        .should('exist')
        .last()
        .scrollIntoView()
        .click({ force: true });

    // ------------------------------------------------------------
    // Aguarda a tela Histórico estar realmente disponível
    // ------------------------------------------------------------
    cy.log('Aguardando carregamento da tela Histórico (verificando campo de data)...');
    cy.get('#P80_DT_INICIO_input', { timeout: 30000 })
        .should('be.visible');

    cy.log('Tela Histórico carregada com sucesso.');
    cy.printPasso('acesso-aba-historico');
});


// ============================================================
// INTERAÇÃO COM O PRIMEIRO NÍVEL
// CARDS .rg-card
// ============================================================

Cypress.Commands.add('acessarCardRgHistorico', () => {

    // ------------------------------------------------------------
    // Preenche a data e faz a pesquisa APENAS AQUI NO INÍCIO
    // ------------------------------------------------------------
    cy.log('Preenchendo data inicial com 01/01/2026 (1º nível)...');
    cy.get('#P80_DT_INICIO_input', { timeout: 15000 })
        .should('be.visible')
        .clear({ force: true })
        .type('01/01/2026', { force: true });

    cy.log('Clicando no botão Pesquisar...');
    cy.get('#B14038952077545947', { timeout: 15000 })
        .should('be.visible')
        .click({ force: true });

    // ------------------------------------------------------------
    // Aguarda os cards aparecerem
    // ------------------------------------------------------------
    cy.log('Aguardando carregamento dos cards .rg-card após pesquisa...');
    cy.get('.rg-card', { timeout: 30000 })
        .should('exist')
        .and('be.visible');

    cy.log('Cards .rg-card encontrados.');
    cy.printPasso('historico-pesquisa-nivel-1');

    // ------------------------------------------------------------
    // Seleciona o primeiro card
    // ------------------------------------------------------------
    cy.log('Selecionando o primeiro card (rg-card)...');
    cy.get('.rg-card', { timeout: 30000 })
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click({ force: true });

    // ------------------------------------------------------------
    // Aguarda o próximo nível carregar
    // ------------------------------------------------------------
    cy.log('Aguardando carregamento do segundo nível...');
    cy.get('.a-CardView-item', { timeout: 30000 })
        .should('exist')
        .and('be.visible');

    cy.log('Segundo nível carregado com sucesso.');
    cy.printPasso('historico-rg-card-selecionado');
});


// ============================================================
// INTERAÇÃO COM O SEGUNDO NÍVEL
// LISTA .a-CardView-item
// ============================================================

Cypress.Commands.add('acessarItemCardViewHistorico', () => {

    // ------------------------------------------------------------
    // Aguarda os itens do CardView (já carregados pelo passo anterior)
    // ------------------------------------------------------------
    cy.log('Aguardando os itens CardView...');
    cy.get('.a-CardView-item', { timeout: 30000 })
        .should('exist')
        .and('be.visible');

    cy.printPasso('historico-nivel-2-pronto');

    // ------------------------------------------------------------
    // Seleciona o primeiro item
    // ------------------------------------------------------------
    cy.log('Selecionando o primeiro item da lista CardView...');
    cy.get('.a-CardView-item', { timeout: 30000 })
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click({ force: true });

    // ------------------------------------------------------------
    // Aguarda o terceiro nível
    // ------------------------------------------------------------
    cy.log('Aguardando carregamento do terceiro nível...');
    cy.get('a[href*="/ords/r/regente/pavimentos/segmento-selecionado"]', { timeout: 30000 })
        .should('exist')
        .and('be.visible');

    cy.log('Terceiro nível carregado com sucesso.');
    cy.printPasso('historico-item-cardview-selecionado');
});


// ============================================================
// ACESSO AO LINK DO SEGMENTO SELECIONADO
// ============================================================

Cypress.Commands.add('acessarSegmentoSelecionadoHistorico', () => {

    // ------------------------------------------------------------
    // Aguarda o link do segmento aparecer
    // ------------------------------------------------------------
    cy.log('Aguardando link do segmento selecionado...');
    cy.get('a[href*="/ords/r/regente/pavimentos/segmento-selecionado"]', { timeout: 30000 })
        .should('exist')
        .and('be.visible');

    cy.printPasso('historico-nivel-3-pronto');

    // ------------------------------------------------------------
    // Clica no segmento
    // ------------------------------------------------------------
    cy.log('Clicando no link do segmento selecionado...');
    cy.get('a[href*="/ords/r/regente/pavimentos/segmento-selecionado"]', { timeout: 30000 })
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click({ force: true });

    // ------------------------------------------------------------
    // Aguarda a navegação final
    // ------------------------------------------------------------
    cy.log('Aguardando carregamento da tela do segmento...');
    cy.url({ timeout: 30000 })
        .should('include', '/segmento-selecionado');

    cy.log('Tela do segmento carregada com sucesso.');
    cy.printPasso('historico-segmento-acessado');
});