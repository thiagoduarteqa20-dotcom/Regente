describe('Smoke Test - Nivel Idade', () => {

    context('Nivel Idade', () => {

        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

        it('Cadastrar Nivel Idade - Criar Modelo Novo', () => {
            cy.acessarNivelIdade();

            cy.gerarDadosNivelIdade({
                nome: true,
                prefixo: 'IDADE_NOVO'
            }).then((dados) => {
                cy.abrirCriarIdade();
                cy.clicarCriarModeloNovoIdade();
                cy.preencherNomeNivelIdade(dados.nome);
                cy.proximoIdade();
                cy.proximoIdade();
                cy.selecionarTodosIdade();
                cy.preencherValoresIntervaloIdade();
                cy.proximoIdade();
                cy.finalizarIdade();
                cy.confirmarFinalizacaoIdade();
            });
        });

        it('Cadastrar Nivel Idade - Utilizando Modelo Existente', () => {
            cy.acessarNivelIdade();

            cy.gerarDadosNivelIdade({
                nome: true,
                prefixo: 'IDADE'
            }).then((dados) => {
                cy.abrirCriarIdade();
                cy.clicarUtilizarModeloIdade();
                cy.preencherNomeNivelIdade(dados.nome);
                cy.selecionarNivelIdade();
                cy.proximoIdade();
                cy.selecionarTodosIdade();
                cy.proximoIdade();
                cy.finalizarIdade();
                cy.confirmarFinalizacaoIdade();
            });
        });

        it('Editar Nível Idade - Alterar valor da célula', () => {
            cy.acessarNivelIdade();
            cy.editarUltimoNivelIdade();
        });

    });

});