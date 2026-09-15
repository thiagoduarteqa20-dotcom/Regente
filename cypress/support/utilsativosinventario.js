// FRAME DO MODAL DE ATIVOS POR TIPO DE INVENTÁRIO
Cypress.Commands.add('getAtivosTipoInventarioFrame', () => {
    cy.log('Obtendo iframe do modal de Ativos por Tipo de Inventário...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL PARA ATIVOS POR TIPO DE INVENTÁRIO
Cypress.Commands.add('acessarAtivosTipoInventario', () => {
    cy.log('Aguardando carregamento dos scripts do menu APEX...');
    cy.wait(1500);

    cy.log('Abrindo Parâmetros...');
    cy.get('#t_MenuNav_1i, a.a-MenuBar-label, .a-MenuBar-item a')
        .contains('Parâmetros')
        .should('exist')
        .click({ force: true });

    cy.wait(500);

    cy.log('Forçando exibição dos submenus...');
    cy.get('.a-Menu, .a-Menu-content').invoke('css', 'display', 'block');

    cy.wait(500);

    cy.log('Clicando em Ativos por Tipo de Inventário...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Ativos por Tipo de Inventário')
        .should('exist')
        .click({ force: true });

    cy.url().should('include', 'ativos-por-tipo');
    
    cy.get('.a-IRR-table, table', { timeout: 15000 }).should('be.visible');
    cy.wait(500);
    cy.printPasso('ativos-tipo-inventario-acessado');
});

// CRIAR ATIVOS POR TIPO DE INVENTÁRIO (COM FALLBACK SEGURO)
Cypress.Commands.add('criarAtivosTipoInventario', () => {
    cy.log('Mapeando registros já existentes na tabela...');

    return cy.get('tbody tr', { timeout: 15000 }).then(($rows) => {
        const registrosExistentes = [];
        $rows.each((index, row) => {
            registrosExistentes.push(Cypress.$(row).text().trim());
        });

        cy.log('Abrindo modal de criação...');
        cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
            .should('be.visible')
            .focus()
            .click();

        cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');
        cy.printPasso('ativos-tipo-inventario-modal-criacao-aberto');

        const ordemRandom = Math.floor(Math.random() * (100 - 15 + 1)) + 15;

        return cy.getAtivosTipoInventarioFrame().then(($frame) => {
            cy.wait(800);

            const $tpSelect = $frame.find('#P121_CD_TP_INVENTARIO');
            const $ativoSelect = $frame.find('#P121_CD_ATIVO');

            const tpOptions = $tpSelect.find('option').toArray().map(el => ({ val: el.value, text: el.text })).filter(o => o.val && o.val !== '');
            const ativoOptions = $ativoSelect.find('option').toArray().map(el => ({ val: el.value, text: el.text })).filter(o => o.val && o.val !== '');

            let escolhidoTp = null;
            let escolhidoAtivo = null;

            if (tpOptions.length > 0 && ativoOptions.length > 0) {
                for (let i = 0; i < tpOptions.length; i++) {
                    for (let j = 0; j < ativoOptions.length; j++) {
                        const jaExiste = registrosExistentes.some(reg => 
                            reg.includes(tpOptions[i].text.trim()) && reg.includes(ativoOptions[j].text.trim())
                        );

                        if (!jaExiste) {
                            escolhidoTp = tpOptions[i];
                            escolhidoAtivo = ativoOptions[j];
                            break;
                        }
                    }
                    if (escolhidoTp) break;
                }
            }

            const tpFinal = escolhidoTp ? escolhidoTp.val : (tpOptions.length > 0 ? tpOptions[0].val : '1');
            const ativoFinal = escolhidoAtivo ? escolhidoAtivo.val : (ativoOptions.length > 0 ? ativoOptions[0].val : '1');

            cy.wrap($frame).find('#P121_CD_TP_INVENTARIO').select(tpFinal, { force: true });
            cy.wait(400);
            cy.wrap($frame).find('#P121_CD_ATIVO').select(ativoFinal, { force: true });

            cy.wrap($frame)
                .find('#P121_ORDEM')
                .should('be.visible')
                .clear({ force: true })
                .type(ordemRandom.toString(), { delay: 30 });

            cy.printPasso('ativos-tipo-inventario-preenchido');

            cy.wrap($frame)
                .find('button[data-otel-label="CREATE"]')
                .should('be.visible')
                .click({ force: true });

            cy.wait(2000);
            cy.printPasso('ativos-tipo-inventario-criado');
            return cy.wrap({ ordem: ordemRandom });
        });
    });
});

// EDITAR ATIVO POR TIPO DE INVENTÁRIO (BASEADO NO ÚLTIMO REGISTRO OU ORDEM)
Cypress.Commands.add('editarAtivosTipoInventarioPorOrdem', (ordem) => {
    cy.log(`Abrindo edição do registro...`);

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    const seletorLinha = (ordem && ordem !== '') ? `tbody tr:contains("${ordem}")` : 'tbody tr';

    cy.get(seletorLinha, { timeout: 15000 })
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);
    cy.printPasso('ativos-tipo-inventario-modal-edicao-aberto');

    const novaOrdem = Math.floor(Math.random() * (200 - 101 + 1)) + 101;

    cy.getAtivosTipoInventarioFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P121_ORDEM')
            .should('be.visible')
            .clear({ force: true })
            .type(novaOrdem.toString(), { delay: 30 });

        cy.printPasso('ativos-tipo-inventario-editado-preenchido');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('ativos-tipo-inventario-edicao-salva');
    return cy.wrap({ novaOrdem });
});

// DELETAR ATIVO POR TIPO DE INVENTÁRIO (BASEADO NO ÚLTIMO REGISTRO OU ORDEM)
Cypress.Commands.add('deletarAtivosTipoInventarioPorOrdem', (ordem) => {
    cy.log(`Abrindo registro para exclusão...`);

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    const seletorLinha = (ordem && ordem !== '') ? `tbody tr:contains("${ordem}")` : 'tbody tr';

    cy.get(seletorLinha, { timeout: 15000 })
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.getAtivosTipoInventarioFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('ativos-tipo-inventario-confirmacao-exclusao');

    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('ativos-tipo-inventario-deletado');
});