describe('Smoke Test - Tipos de Material', () => {

    context('Tipos de Material', () => {

        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

        it('Cadastrar Novo Tipo de Material com Sucesso', () => {
            cy.acessarTiposMaterial();
            cy.criarTipoMaterial();
        });

        it('Editar Último Tipo de Material com Sucesso', () => {
            cy.acessarTiposMaterial();
            cy.editarUltimoTipoMaterial();
        });

        it('Deletar Último Tipo de Material com Sucesso', () => {
            cy.acessarTiposMaterial();
            cy.deletarUltimoTipoMaterial();
        });

    });

});