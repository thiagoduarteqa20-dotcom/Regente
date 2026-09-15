describe('Smoke Test - Subciclos', () => {

    context('Subciclos', () => {

        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

        it('Cadastrar Novo Subciclo com Sucesso', () => {
            cy.acessarSubciclo();
            cy.criarSubciclo();
        });

        it('Editar Último Subciclo com Sucesso', () => {
            cy.acessarSubciclo();
            cy.editarUltimoSubciclo();
        });

        it('Deletar Último Subciclo com Sucesso', () => {
            cy.acessarSubciclo();
            cy.deletarUltimoSubciclo();
        });

    });

});