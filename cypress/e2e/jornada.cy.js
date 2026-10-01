describe('Testes de Regressão - Módulo de Jornadas', () => {
    beforeEach(() => {
        cy.sessionLogin();
        cy.contains('Pavimentos').click();
    });

    it('Deve criar, editar e excluir uma Jornada com sucesso', () => {
        cy.acessarJornadas();

        cy.criarJornada().then(({ descricao }) => {
            cy.editarJornadaPorDescricao(descricao).then(({ novaDescricao }) => {
                cy.deletarJornadaPorDescricao(novaDescricao);
            });
        });
    });
});