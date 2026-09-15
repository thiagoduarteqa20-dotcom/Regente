describe('Smoke Test - Tipos de Ativo', () => {

    context('Tipos de Ativo', () => {

        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

        it('Cadastrar Novo Tipo de Ativo com Sucesso', () => {
            cy.acessarTiposAtivo();
            cy.criarTipoAtivo();
        });

        it('Editar Último Tipo de Ativo com Sucesso', () => {
            cy.acessarTiposAtivo();
            cy.editarUltimoTipoAtivo();
        });

        it('Deletar Último Tipo de Ativo com Sucesso', () => {
            cy.acessarTiposAtivo();
            cy.deletarUltimoTipoAtivo();
        });

    });

});