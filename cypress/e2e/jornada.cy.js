describe('Testes de Regressão - Módulo de Jornadas', () => {
    let descricaoJornada;
    let novaDescricaoJornada;

    beforeEach(() => {
        cy.sessionLogin();
        cy.contains('Pavimentos').click();
        cy.acessarJornadas();
    });

    it('Deve criar uma Jornada com sucesso', () => {
        cy.criarJornada().then(({ descricao }) => {
            descricaoJornada = descricao;
            expect(descricaoJornada).to.exist;
        });
    });

    it('Deve editar uma Jornada com sucesso', () => {
        cy.editarJornadaPorDescricao(descricaoJornada).then(({ novaDescricao }) => {
            novaDescricaoJornada = novaDescricao;
            expect(novaDescricaoJornada).to.exist;
        });
    });

    it('Deve deletar uma Jornada com sucesso', () => {
        cy.deletarJornadaPorDescricao(novaDescricaoJornada);
    });
});