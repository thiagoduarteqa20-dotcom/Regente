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
                cy.preencherNomeMatrizIcpIdadeExistente(dados.nome);
                cy.selecionarMatrizIcpIdade();
                
                // 1º NEXT: Vai para a tela da Grid
                cy.proximoMatrizIcpIdade();
                
                // O PASSO CHAVE QUE FALTAVA: Marca a checkmark das linhas
                cy.selecionarTodosMatrizIcpIdade();
                
                // 2º NEXT: Vai para a tela final
                cy.proximoMatrizIcpIdade();
                
                // Agora sim o botão FINISH vai existir na tela!
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