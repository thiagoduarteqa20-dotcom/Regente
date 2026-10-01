describe('Smoke Test - Módulo de Pavimentos', () => {
    context('Jornadas', () => {
        beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos')
                .click();
        });
        it('Cadastrar Jornada', () => {
            cy.navigateMenu(
                'Parâmetros',
                'Tipo de Jornada'
            );
            cy.createJornada(
                'Criar - Tipo de Jornada'
            );
        });
        it('Editar Jornada', () => {
            cy.navigateMenu(
                'Parâmetros',
                'Tipo de Jornada'
            );
            cy.editarJornada();
        });
        it('Excluir Jornada', () => {
            cy.navigateMenu(
                'Parâmetros',
                'Tipo de Jornada'
            );
            cy.excluirJornada();
        });
    });
});