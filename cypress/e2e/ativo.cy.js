describe('Smoke test - Gerenciamento de Ativos e Configuração de Campos', () => {
    let ativoDescricao;

    beforeEach(() => {
        cy.sessionLogin();
        cy.contains('Pavimentos').click();
        cy.acessarAtivos();
    });

    it('Criar Ativo com Sucesso', () => {
        cy.criarAtivo().then((res) => {
            ativoDescricao = res.descricao;
            cy.log(`Ativo criado com sucesso. Descrição: ${ativoDescricao}`);
        });
    });

    it('Editar Ativo Criado com Sucesso', () => {
        const busca = ativoDescricao || 'ATIVO_';
        cy.editarAtivoPorDescricao(busca).then((res) => {
            if (res && res.novaDescricao) {
                ativoDescricao = res.novaDescricao;
                cy.log(`Ativo editado. Nova descrição: ${ativoDescricao}`);
            }
        });
    });

    it('Configurar Campos Customizados do Ativo', () => {
        const busca = ativoDescricao || 'ATIVO_';
        cy.configurarCamposAtivo(busca);
    });

    it('Deletar Ativo Criado com Sucesso', () => {
        const busca = ativoDescricao || 'ATIVO_';
        cy.deletarAtivoPorDescricao(busca);
    });
});