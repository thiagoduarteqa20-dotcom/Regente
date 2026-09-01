Cypress.Commands.add('sessionLogin', () => {
    cy.visit('/')
    cy.get('#P9999_USERNAME').type('tiagoduarte.7@seven.online')
    cy.get('input[placeholder="Senha"]').type('Seven@123')
    cy.contains('button', 'Acessar').click()
})
Cypress.Commands.add('validateRegisterUsers', () => {
    cy.contains('Cadastros').click()
    cy.contains('Usuários').click()
    cy.url().should('include', 'listausuarios')

})