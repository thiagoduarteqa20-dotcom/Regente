describe('Smoke Test - Matriz ICP Idade', () => {

    context('Matriz ICP Idade', () => {

        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

        it('Cadastrar Matriz ICP Idade - Criar Modelo Novo', () => {
            cy.acessarMatrizIcpIdade();

            cy.gerarDadosMatrizIcpIdade({
                nome: true,
                prefixo: 'MATRIZ_NOVO'
            }).then((dados) => {
                cy.abrirCriarMatrizIcpIdade();
                cy.clicarCriarModeloNovoMatrizIcpIdade();
                cy.preencherNomeMatrizIcpIdadeNovo(dados.nome);
                cy.preencherPesoMatrizIcpIdade();
                cy.proximoMatrizIcpIdade();
                cy.preencherValoresMatrizIcpIdade();
                cy.proximoMatrizIcpIdade();
                cy.finalizarMatrizIcpIdade();
                cy.confirmarFinalizacaoMatrizIcpIdade();
            });
        });

        it('Cadastrar Matriz ICP Idade - Utilizando Modelo Existente', () => {
            cy.acessarMatrizIcpIdade();

            cy.gerarDadosMatrizIcpIdade({
                nome: true,
                prefixo: 'MATRIZ'
            }).then((dados) => {
                cy.abrirCriarMatrizIcpIdade();
                cy.clicarUtilizarModeloMatrizIcpIdade();
                cy.selecionarMatrizIcpIdade();
                cy.proximoMatrizIcpIdade();
                cy.finalizarMatrizIcpIdade();
                cy.confirmarFinalizacaoMatrizIcpIdade();
            });
        });

        it('Editar Matriz ICP Idade - Alterar valor da célula', () => {
            cy.acessarMatrizIcpIdade();
            cy.editarUltimaMatrizIcpIdade();
        });

    });

});