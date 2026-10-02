// NAVEGAÇÃO PARA RELATÓRIO DE MEDIÇÃO
Cypress.Commands.add('acessarRelatorioMedicao', () => {
    cy.log('Aguardando carregamento dos scripts do menu APEX...');
    cy.wait(1500);

    cy.log('Abrindo menu Jornadas...');
    cy.contains('.a-MenuBar-label, .a-TreeNav-label, a, button, span', 'Jornadas', { timeout: 15000 })
        .should('exist')
        .first()
        .scrollIntoView()
        .click({ force: true });

    cy.wait(800);

    cy.log('Clicando na opção Relatório de medição no submenu...');
    cy.contains('.a-Menu-label, .a-Menu-link, .a-TreeNav-label, a, span', 'Relatório de medição', { matchCase: false })
        .should('exist')
        .last()
        .scrollIntoView()
        .click({ force: true });

    // Aguarda o carregamento da aba Relatório de medição e tira o print
    cy.wait(2000);
    cy.printPasso('acesso-aba-relatorio-medicao');
});

// APENAS LIMPAR FILTROS
Cypress.Commands.add('limparFiltrosRelatorio', () => {
    cy.log('Clicando em Limpar filtros...');
    cy.contains('Limpar filtros', { matchCase: false })
        .should('exist')
        .click({ force: true });

    cy.wait(2000); // Aguarda a limpeza refletir no APEX
    cy.printPasso('relatorio-filtros-limpos');
});

// INTERAÇÃO COM MAPA E SEGMENTOS
Cypress.Commands.add('interagirMapaESegmentos', () => {
    cy.log('Aguardando o carregamento da região do mapa...');
    
    // Aguarda o container do mapa estar visível e finalizar o estado de carregamento
    cy.get('.a-MapRegion, .js-mapRegion', { timeout: 20000 }).should('be.visible');
    cy.get('.a-MapRegion').should('not.have.class', 'is-loading');

    cy.log('Rolando até o final da página...');
    cy.scrollTo('bottom', { duration: 1000, ensureScrollable: false });
    cy.wait(1000);

    cy.log('Localizando a checkbox da legenda por classe ou ID parcial...');
    // Busca pela classe nativa ou ID dinâmico que contém 'legend_item_checkbox'
    cy.get('input.a-MapRegion-legendSelector, input[id*="legend_item_checkbox"]', { timeout: 15000 })
        .filter(':visible')
        .first()
        .scrollIntoView({ duration: 500 })
        .click({ force: true })
        .wait(500)
        .click({ force: true });

    cy.wait(1500);
    cy.printPasso('relatorio-checkbox-mapa-clicada');

    cy.log('Garantindo rolagem até a opção Segmentos desativados...');
    cy.scrollTo('bottom', { duration: 1000, ensureScrollable: false });
    cy.wait(1000);

    cy.contains('Segmentos desativados', { matchCase: false, timeout: 15000 })
        .scrollIntoView({ duration: 500 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('relatorio-segmentos-desativados-abertos');
});