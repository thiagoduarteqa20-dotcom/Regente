describe('Smoke Test - Validação de Permissões de Acesso', () => {
  beforeEach(() => {
    cy.sessionLogin()
    cy.contains('Administração').click()

  })

  it('Deve validar o acesso à tela de Cadastro de Usuários', () => {
    cy.validateRegisterUsers()
    cy.get('[class="t-Breadcrumb-label"]')
      .should('have.text', 'Lista de Usuários')
  })

  // it('Deve validar o acesso ao Dashboard de Segurança', () => {
  //   cy.contains('Dashboard').click()
  //   cy.contains('Segurança').click()
  // })

})