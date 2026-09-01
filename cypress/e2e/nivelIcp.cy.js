describe('Smoke Test - Nivel ICP', () => {

    context('Nivel ICP', () => {
        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });
        it('Cadastrar Nivel ICP - Criar Modelo Novo', () => {
            cy.acessarNivelIcp();
            cy.gerarDadosNivelIcp({
                nome: true,
                prefixo: 'ICP_NOVO'
            }).then((dados) => {
                cy.abrirCriarIcp();
                cy.clicarCriarModeloNovoIcp();
                cy.preencherNomeNivelIcp(dados.nome);
                cy.proximoIcp();
                cy.proximoIcp();
                cy.selecionarTodosIcp();
                cy.preencherValoresIntervaloIcp();
                cy.proximoIcp();
                cy.finalizarIcp();
                cy.confirmarFinalizacaoIcp();
            });
        });
        it('Cadastrar Nivel ICP - Utilizando Modelo Existente', () => {
            cy.acessarNivelIcp();
            cy.gerarDadosNivelIcp({
                nome: true,
                prefixo: 'ICP'
            }).then((dados) => {
                cy.abrirCriarIcp();
                cy.clicarUtilizarModeloIcp();
                cy.preencherNomeNivelIcp(dados.nome);
                cy.selecionarNivelIcp();
                cy.proximoIcp();
                cy.selecionarTodosIcp();
                cy.proximoIcp();
                cy.finalizarIcp();
                cy.confirmarFinalizacaoIcp();
            });
        });
        it('Editar Nível ICP - Alterar valor de célula', () => {
            cy.acessarNivelIcp();
            cy.editarUltimoNivelIcp();
        });
    });
});