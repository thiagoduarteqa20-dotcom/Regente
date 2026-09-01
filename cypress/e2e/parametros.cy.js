describe('Smoke Test - Módulo de Pavimentos', () => {

    context('Parâmetros', () => {
        beforeEach(() => {
            cy.sessionLogin()
            cy.contains('Pavimentos').click()
        })

       it('Cadastrar Parâmetros', () => {

    cy.navigateMenu(
        'Parâmetros',
        'Tipo de Parâmetros'
    );

    cy.createParameterType()
        .then((dados) => {

            cy.validarParametroCriado(dados);

        });

});

        it('Editar Parâmetros', () => {
            cy.navigateMenu('Parâmetros', 'Tipo de Parâmetros');
            cy.editParameter();
            cy.gerarDadosCadastro({
                descricao: true,
                prefixo: 'TP'
            }).then((dados) => {
                cy.preencherFormulario({
                    descricao: dados.descricao
                });
            });

            cy.salvarTipoParametro();
        });

        it('Excluir Parâmetros', () => {
            cy.navigateMenu('Parâmetros', 'Tipo de Parâmetros');
            cy.editParameter();
            cy.deletarParametros()
        })
    })
})


