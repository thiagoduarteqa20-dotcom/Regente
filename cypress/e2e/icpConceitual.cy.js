describe('Smoke Test - ICP Conceitual', () => {

    context('ICP Conceitual', () => {

        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

        it('Cadastrar ICP Conceitual - Criar Modelo Novo', () => {
            cy.acessarIcpConceitual();

            cy.gerarDadosIcpConceitual({
                nome: true,
                prefixo: 'ICP_CONCEITUAL_NOVO'
            }).then((dados) => {
                cy.abrirCriarIcpConceitual();
                cy.clicarCriarModeloNovoIcpConceitual();
                cy.preencherNomeIcpConceitualNovo(dados.nome);
                cy.proximoIcpConceitual();
                cy.preencherValoresIntervaloIcpConceitual();
                cy.proximoIcpConceitual();
                cy.finalizarIcpConceitual();
                cy.confirmarFinalizacaoIcpConceitual();
            });
        });

        it('Cadastrar ICP Conceitual - Utilizando Modelo Existente', () => {
            cy.acessarIcpConceitual();

            cy.gerarDadosIcpConceitual({
                nome: true,
                prefixo: 'ICP_CONCEITUAL'
            }).then((dados) => {
                cy.abrirCriarIcpConceitual();
                cy.clicarUtilizarModeloIcpConceitual();
                cy.preencherNomeIcpConceitual(dados.nome);
                cy.selecionarIcpConceitual();
                cy.proximoIcpConceitual();
                cy.selecionarTodosIcpConceitual();
                cy.proximoIcpConceitual();
                cy.finalizarIcpConceitual();
                cy.confirmarFinalizacaoIcpConceitual();
            });
        });

        it('Editar ICP Conceitual - Alterar valor da célula', () => {
            cy.acessarIcpConceitual();
            cy.editarUltimoIcpConceitual();
        });

    });

});