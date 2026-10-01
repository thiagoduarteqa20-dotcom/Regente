describe('Fluxo da Aba de Operação em Jornadas', () => {
    
    beforeEach(() => {
       cy.sessionLogin();
            cy.contains('Pavimentos').click();
        });

    it('Deve navegar pelas consultas operacionais e acessar o segmento selecionado', () => {

        cy.acessarOperacao();
        cy.interagirVisitasTecnicos();
        cy.acessarPrimeiraJornadaDisponivel();
        cy.acessarSegmentoSelecionado();
        cy.url().should('include', 'segmento-selecionado');
        cy.log('Fluxo de Operação concluído com sucesso!');
        
    });
});