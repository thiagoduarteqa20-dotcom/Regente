// ============================================================
// utils historico (jornadas)
// ============================================================
Cypress.Commands.add('acessarHistorico', () => {
    cy.wait(1500);
    cy.contains('.a-MenuBar-label, .a-TreeNav-label, a, button, span', 'Jornadas', { timeout: 15000 }).should('exist').first().scrollIntoView().click({ force: true });
    cy.contains('.a-Menu-label, .a-Menu-link, .a-TreeNav-label, a, span', 'Histórico', { timeout: 15000, matchCase: false }).should('exist').last().scrollIntoView().click({ force: true });
    cy.get('#P80_DT_INICIO_input', { timeout: 30000 }).should('be.visible');
    cy.printPasso('acesso-aba-historico');
});

Cypress.Commands.add('acessarCardRgHistorico', () => {
    cy.get('#P80_DT_INICIO_input', { timeout: 15000 }).should('be.visible').clear({ force: true }).type('01/01/2026', { force: true });
    cy.get('#B14038952077545947', { timeout: 15000 }).should('be.visible').click({ force: true });
    cy.get('.rg-card', { timeout: 30000 }).should('exist').and('be.visible');
    cy.printPasso('historico-pesquisa-nivel-1');
    
    // Seleciona o SEGUNDO card (.eq(1)) do 1º nível
    cy.get('.rg-card', { timeout: 30000 })
        .should('be.visible')
        .eq(1)
        .scrollIntoView()
        .click({ force: true });

    cy.get('.a-CardView-item', { timeout: 30000 }).should('exist').and('be.visible');
    cy.printPasso('historico-rg-card-selecionado');
});

Cypress.Commands.add('acessarItemCardViewHistorico', () => {
    // Sem reaplicação de filtro aqui
    cy.get('.a-CardView-item', { timeout: 30000 }).should('exist').and('be.visible');
    cy.printPasso('historico-nivel-2-pronto');
    
    cy.get('.a-CardView-item', { timeout: 30000 })
        .should('be.visible')
        .first()
        .scrollIntoView()
        .click({ force: true });
        
    cy.get('a[href*="/ords/r/regente/pavimentos/segmento-selecionado"]', { timeout: 30000 }).should('exist').and('be.visible');
    cy.printPasso('historico-item-cardview-selecionado');
});

Cypress.Commands.add('acessarSegmentoSelecionadoHistorico', () => {
    cy.get('a[href*="/ords/r/regente/pavimentos/segmento-selecionado"]', { timeout: 30000 }).should('exist').and('be.visible');
    cy.printPasso('historico-nivel-3-pronto');
    cy.get('a[href*="/ords/r/regente/pavimentos/segmento-selecionado"]', { timeout: 30000 }).should('be.visible').first().scrollIntoView().click({ force: true });
    cy.url({ timeout: 30000 }).should('include', '/segmento-selecionado');
    cy.printPasso('historico-segmento-acessado');
});