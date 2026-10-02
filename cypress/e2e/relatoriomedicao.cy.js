describe('Fluxo da Aba de Relatório de Medição em Jornadas', () => {
    
       beforeEach(() => {
            cy.sessionLogin()
            cy.contains('Pavimentos').click()
        })


    it('Deve preencher relatórios de medição com datas do ano atual e interagir com o mapa', () => {
        // 1. Acesso multinível (Jornadas > Relatório de medição)
        cy.acessarRelatorioMedicao();
        
        // 3. Interagir com a checkbox da legenda e acessar Segmentos desativados
        cy.interagirMapaESegmentos();

        // Log final
        cy.log('Fluxo de Relatório de medição concluído com sucesso!');
    });
});