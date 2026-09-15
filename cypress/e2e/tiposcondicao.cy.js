describe('Gerenciamento de Tipos de Condição', () => {
    beforeEach(() => {
        // Realiza o login na aplicação
         cy.sessionLogin();
        cy.contains('Pavimentos').click();
        cy.acessarTiposCondicao();
    });

    it('Criar Tipo de Condição com Sucesso', () => {
        cy.criarTipoCondicao().then((tipo) => {
            cy.log(`Tipo de Condição criado com sucesso: ${tipo.descricao}`);
        });
    });

    it('Editar Último Tipo de Condição com Sucesso', () => {
        cy.editarUltimoTipoCondicao();
    });

    it('Deletar Último Tipo de Condição com Sucesso', () => {
        cy.deletarUltimoTipoCondicao();
    });
});