describe('Smoke Test - Ciclos', () => {

    context('Ciclos', () => {

        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

        it('Cadastrar Novo Ciclo com Sucesso', () => {
            cy.acessarCiclos();
            cy.gerarDadosCiclo({ prefixo: 'CICLO' }).then((dados) => {
                cy.abrirCriarCiclo();
                cy.preencherFormularioCiclo(dados);
                cy.confirmarCriarCiclo();
            });
        });

        it('Editar Último Ciclo com Sucesso', () => {
            cy.acessarCiclos();
            cy.editarUltimoCiclo();
        });

        it('Deletar Último Ciclo com Sucesso', () => {
            cy.acessarCiclos();
            cy.deletarUltimoCiclo();
        });

    });

});