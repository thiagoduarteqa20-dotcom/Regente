describe('Gerenciamento de Tipo do Inventário', () => {
    beforeEach(() => {
    cy.sessionLogin();
        cy.contains('Pavimentos').click();
        cy.acessarTipoInventario();
    });

    it('Criar Tipo do Inventário com Sucesso', () => {
        cy.criarTipoInventario().then((tipo) => {
            cy.log(`Tipo do Inventário criado com sucesso: ${tipo.descricao}`);
        });
    });

    it('Editar Último Tipo do Inventário com Sucesso', () => {
        cy.editarUltimoTipoInventario();
    });

    it('Deletar Último Tipo do Inventário com Sucesso', () => {
        cy.deletarUltimoTipoInventario();
    });
});