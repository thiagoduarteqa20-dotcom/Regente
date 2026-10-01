// NAVEGAÇÃO PARA OPERAÇÃO
Cypress.Commands.add('acessarOperacao', () => {
    cy.log('Aguardando carregamento dos scripts do menu APEX...');
    cy.wait(1500);

    cy.log('Abrindo menu Jornadas...');
    cy.contains('.a-MenuBar-label, .a-TreeNav-label, a, button, span', 'Jornadas', { timeout: 15000 })
        .should('exist')
        .first()
        .scrollIntoView()
        .click({ force: true });

    cy.wait(800);

    cy.log('Clicando na opção Operação no submenu...');
    cy.contains('.a-Menu-label, .a-Menu-link, .a-TreeNav-label, a, span', 'Operação', { matchCase: false })
        .should('exist')
        .last()
        .scrollIntoView()
        .click({ force: true });

    // Aguarda o carregamento da aba Operação e tira o print
    cy.wait(2000);
    cy.printPasso('acesso-aba-operacao');
});

// CONSULTAS OPERACIONAIS E VISITAS DOS TÉCNICOS
Cypress.Commands.add('interagirVisitasTecnicos', () => {
    cy.log('Acessando aba Consultas operacionais...');
    cy.contains('Consultas operacionais', { matchCase: false })
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);

    cy.log('Clicando em Visitas dos técnicos...');
    cy.contains('Visitas dos técnicos', { matchCase: false })
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.log('Realizando duplo clique nas checkboxes da legenda do mapa...');
    cy.get('#6464781683025922_legend_item_checkbox', { timeout: 10000 })
        .scrollIntoView()
        .dblclick({ force: true });

    cy.get('#6464811771025923_legend_item_checkbox', { timeout: 10000 })
        .scrollIntoView()
        .dblclick({ force: true });
        
    // Aguarda a ação no mapa e tira o print
    cy.wait(1500);
    cy.printPasso('operacao-visitas-tecnicos-legendas-selecionadas');
});

// INTERAÇÃO COM JORNADAS DISPONÍVEIS E CARDS
Cypress.Commands.add('acessarPrimeiraJornadaDisponivel', () => {
    cy.log('Clicando em Jornadas disponíveis...');
    cy.contains('Jornadas disponíveis', { matchCase: false })
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);

    cy.log('Clicando em Limpar filtros...');
    cy.contains('Limpar filtros', { matchCase: false })
        .should('exist')
        .click({ force: true });

    // Aguarda o refresh da tabela após limpar filtros e tira o print
    cy.wait(2000);
    cy.printPasso('operacao-jornadas-disponiveis-filtros-limpos');

    cy.log('Selecionando o primeiro card...');
    cy.get('.rg-card', { timeout: 10000 })
        .should('be.visible')
        .first()
        .within(() => {
            cy.get('.rg-card__header').should('exist');
        })
        .click({ force: true });
        
    // Aguarda a seleção do card e tira o print
    cy.wait(2000);
    cy.printPasso('operacao-card-selecionado');
});

// ACESSO AO SEGMENTO
Cypress.Commands.add('acessarSegmentoSelecionado', () => {
    cy.log('Clicando no link do segmento selecionado...');
    cy.get('a[href*="/ords/r/regente/pavimentos/segmento-selecionado"]', { timeout: 10000 })
        .should('exist')
        .first()
        .scrollIntoView()
        .click({ force: true });

    // Aguarda a navegação para a tela do segmento e tira o print final da etapa
    cy.wait(2000);
    cy.printPasso('operacao-segmento-acessado');
});