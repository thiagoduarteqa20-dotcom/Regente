Cypress.Commands.add('Parameter', () => {
    cy.contains('Parâmetros').click();
    cy.contains('Tipo de Parametros').click();
});

Cypress.Commands.add('editParameter', () => {
    cy.get('[class="fa fa-edit"]').last().click();
    cy.wait(500);
});

Cypress.Commands.add('deletarParametros', () => {
    cy.intercept({
        method: 'POST',
        url: '**/ords/wwv_flow.accept?p_context=pavimentos/cadastrar-tipo-de-par%C3%A2metro/*'
    }).as('deleteParametro');

    cy.getParameterTypeFrame()
        .contains('button', 'Deletar')
        .click();

    cy.contains('button', 'Deletar').click();

    cy.wait('@deleteParametro').then(({ request, response }) => {
        expect(response.statusCode).to.eq(200);
        cy.log(request.body);
    });
});