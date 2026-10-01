// NAVEGAÇÃO PARA HISTÓRICO
Cypress.Commands.add('acessarHistorico', () => {
    cy.log('Aguardando carregamento dos scripts do menu APEX...');
    cy.wait(1500);

    cy.log('Abrindo menu Jornadas...');
    cy.contains('.a-MenuBar-label, .a-TreeNav-label, a, button, span', 'Jornadas', { timeout: 15000 })
        .should('exist')
        .first()
        .scrollIntoView()
        .click({ force: true });

    cy.wait(800);

    cy.log('Clicando na opção Histórico no submenu...');
    cy.contains('.a-Menu-label, .a-Menu-link, .a-TreeNav-label, a, span', 'Histórico', { matchCase: false })
        .should('exist')
        .last()
        .scrollIntoView()
        .click({ force: true });

    // Aguarda o carregamento da aba Histórico e tira o print
    cy.wait(2000);
    cy.printPasso('acesso-aba-historico');
});

// INTERAÇÃO COM O PRIMEIRO NÍVEL (Cards rg-card)
Cypress.Commands.add('acessarCardRgHistorico', () => {
    cy.log('Clicando em Limpar filtros (1º nível)...');
    cy.contains('Limpar filtros', { matchCase: false })
        .should('exist')
        .click({ force: true });

    cy.wait(2000); // Aguarda atualização do APEX
    cy.printPasso('historico-filtros-limpos-nivel-1');

    cy.log('Selecionando o primeiro card (rg-card)...');
    cy.get('.rg-card', { timeout: 10000 })
        .should('be.visible')
        .first()
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('historico-rg-card-selecionado');
});

// INTERAÇÃO COM O SEGUNDO NÍVEL (Lista a-CardView-item)
Cypress.Commands.add('acessarItemCardViewHistorico', () => {
    cy.log('Clicando em Limpar filtros (2º nível)...');
    cy.contains('Limpar filtros', { matchCase: false })
        .should('exist')
        .click({ force: true });

    cy.wait(2000); // Aguarda atualização do APEX
    cy.printPasso('historico-filtros-limpos-nivel-2');

    cy.log('Selecionando o primeiro item da lista CardView...');
    cy.get('.a-CardView-item', { timeout: 10000 })
        .should('be.visible')
        .first()
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('historico-item-cardview-selecionado');
});

// ACESSO AO LINK DO SEGMENTO SELECIONADO
Cypress.Commands.add('acessarSegmentoSelecionadoHistorico', () => {
    cy.log('Clicando em Limpar filtros (3º nível)...');
    cy.contains('Limpar filtros', { matchCase: false })
        .should('exist')
        .click({ force: true });

    cy.wait(2000); // Aguarda atualização do APEX
    cy.printPasso('historico-filtros-limpos-nivel-3');

    cy.log('Clicando no link do segmento selecionado...');
    cy.get('a[href*="/ords/r/regente/pavimentos/segmento-selecionado"]', { timeout: 10000 })
        .should('exist')
        .first()
        .scrollIntoView()
        .click({ force: true });

    // Aguarda a navegação para a tela do segmento e tira o print final
    cy.wait(2000);
    cy.printPasso('historico-segmento-acessado');
});