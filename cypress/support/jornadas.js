// NAVEGAÇÃO JORNADA
Cypress.Commands.add('abrirJornadas', () => {
    cy.log('Abrindo Tipo de Jornada...');
    cy.contains('Parâmetros')
        .click();
    cy.contains('Tipo de Jornada')
        .click();
});
// EDITAR JORNADA NA TABELA
Cypress.Commands.add('editarJornadaTabela', () => {
    cy.log('Clicando no botão editar da jornada...');
    cy.get('[class="fa fa-edit"]')
        .last()
        .click();
    cy.wait(500);
});
// DELETAR JORNADA NA TABELA
Cypress.Commands.add('deletarJornadaTabela', () => {
    cy.log('Deletando jornada...');
    cy.intercept({
        method: 'POST',
        url: '**/ords/wwv_flow.accept*'
    }).as('deleteJornada');
    
    cy.getJornadaFrame()
        .contains('button', 'Deletar')
        .click();
        
    cy.contains('button', 'Deletar')
        .click();
        
    cy.wait('@deleteJornada')
        .then(({ request, response }) => {
            expect(response.statusCode).to.eq(200);
            cy.log(request.body);
        });

});