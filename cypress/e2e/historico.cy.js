describe('Fluxo da Aba de Histórico em Jornadas', () => {
    
      beforeEach(() => {
            cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

    it('Deve navegar pelas etapas do histórico', () => {

        cy.acessarHistorico();
        cy.acessarCardRgHistorico();
        cy.acessarItemCardViewHistorico();
        cy.acessarSegmentoSelecionadoHistorico();
        cy.url().should('include', 'segmento-selecionado');
        cy.log('Fluxo de Histórico concluído com sucesso!');
    });
});