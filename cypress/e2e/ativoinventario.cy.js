describe('Smoke test - Gerenciamento de Ativos por Tipo do Inventário', () => {
    let ordemCriada;

    beforeEach(() => {
        cy.sessionLogin();
        cy.contains('Pavimentos').click();
        cy.acessarAtivosTipoInventario();
    });

    it('Criar Ativo por Tipo do Inventário com Sucesso', () => {
        cy.criarAtivosTipoInventario().then((res) => {
            ordemCriada = res.ordem;
            cy.log(`Ativo por Tipo do Inventário criado com sucesso. Ordem gerada: ${ordemCriada}`);
        });
    });

    it('Editar Último Ativo por Tipo do Inventário com Sucesso', () => {
        const ordemBusca = ordemCriada || ''; 
        cy.editarAtivosTipoInventarioPorOrdem(ordemBusca).then((res) => {
            if (res && res.novaOrdem) {
                ordemCriada = res.novaOrdem; // Atualiza a variável com o número novo da edição
                cy.log(`Registro editado. Nova ordem atualizada para: ${ordemCriada}`);
            }
        });
    });

    it('Deletar Último Ativo por Tipo do Inventário com Sucesso', () => {
        const ordemBusca = ordemCriada || '';
        cy.deletarAtivosTipoInventarioPorOrdem(ordemBusca);
    });
});