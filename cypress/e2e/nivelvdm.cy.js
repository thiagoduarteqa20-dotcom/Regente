describe('Smoke Test - Nivel VDM', () => {

    context('Nivel VDM', () => {

        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

        it('Cadastrar Nivel VDM - Criar Modelo Novo', () => {
            cy.acessarNivelVdm();

            cy.gerarDadosNivelVdm({
                nome: true,
                prefixo: 'VDM_NOVO'
            }).then((dados) => {
                cy.abrirCriarVdm();
                cy.clicarCriarModeloNovoVdm();
                cy.preencherNomeNivelVdmNovo(dados.nome);
                cy.proximoVdm();
                cy.preencherValoresIntervaloVdm();
                cy.proximoVdm();
                cy.finalizarVdm();
                cy.confirmarFinalizacaoVdm();
            });
        });

        it('Cadastrar Nivel VDM - Utilizando Modelo Existente', () => {
            cy.acessarNivelVdm();

            cy.gerarDadosNivelVdm({
                nome: true,
                prefixo: 'VDM'
            }).then((dados) => {
                cy.abrirCriarVdm();
                cy.clicarUtilizarModeloVdm();
                cy.preencherNomeNivelVdm(dados.nome);
                cy.selecionarNivelVdm();
                cy.proximoVdm();
                cy.selecionarTodosVdm();
                cy.proximoVdm();
                cy.finalizarVdm();
                cy.confirmarFinalizacaoVdm();
            });
        });

        it('Editar Nível VDM - Alterar valor da célula', () => {
            cy.acessarNivelVdm();
            cy.editarUltimoNivelVdm();
        });

    });

});