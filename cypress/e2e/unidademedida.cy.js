describe('Smoke Test - Unidades de Medida', () => {

    context('Unidades de Medida', () => {

        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

        it('Cadastrar Nova Unidade de Medida com Sucesso', () => {
            cy.acessarUnidadesMedida();
            cy.criarUnidadeMedida();
        });

        it('Editar Última Unidade de Medida com Sucesso', () => {
            cy.acessarUnidadesMedida();
            cy.editarUltimaUnidadeMedida();
        });

        it('Deletar Última Unidade de Medida com Sucesso', () => {
            cy.acessarUnidadesMedida();
            cy.deletarUltimaUnidadeMedida();
        });

    });

});