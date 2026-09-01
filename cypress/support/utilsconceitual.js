// ACESSAR NÍVEL ICP CONCEITUAL
Cypress.Commands.add('acessarIcpConceitual', () => {
    cy.log('Abrindo Parâmetros');
    cy.get('#t_MenuNav_1i')
        .should('be.visible')
        .click();
    cy.log('Abrindo Planejamento de Resultados');
    cy.get('#t_MenuNav_1_2i')
        .should('exist')
        .then(($menu) => {
            cy.wrap($menu).trigger('mouseover');
            cy.wrap($menu).trigger('mouseenter');
        });
    cy.wait(1000);
    cy.log('Forçando abertura do submenu APEX');
    cy.get('#t_MenuNav_1_2im')
        .invoke('css', 'display', 'block');
    cy.contains('a', 'Nível ICP Conceitual')
        .should('be.visible')
        .click();
    cy.url()
        .should('include', 'icp-conceitual');
});

// FRAME ICP CONCEITUAL
Cypress.Commands.add('getIcpConceitualFrame', () => {
    return cy.get('iframe', { timeout: 30000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// GERAR DADOS
Cypress.Commands.add('gerarDadosIcpConceitual', ({
    nome = false,
    prefixo = 'ICP_CONCEITUAL'
} = {}) => {
    const dados = {};

    if (nome) {
        dados.nome =
            `${prefixo}_${Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()}`;
    }

    cy.log(JSON.stringify(dados));
    return cy.wrap(dados);
});

// ABRIR MODAL - CRIAR
Cypress.Commands.add('abrirCriarIcpConceitual', () => {
    cy.log('Abrindo modal - Criar');
    cy.get('button[data-otel-label="CREATE"]')
        .should('be.visible')
        .should('not.be.disabled')
        .click();
    cy.contains('.ui-dialog-title', 'Criar', {
        timeout: 15000
    })
        .should('be.visible');
});

// CRIAR MODELO NOVO
Cypress.Commands.add('clicarCriarModeloNovoIcpConceitual', () => {
    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
        .find('.a-CardView-fullLink')
        .first()
        .should('be.visible')
        .click({ force: true });
    cy.get('iframe', { timeout: 30000 })
        .should(($iframes) => {
            const encontrado = [...$iframes].some((iframe) => {
                const doc = iframe.contentDocument;
                return doc && doc.querySelector('#P91_NOME');
            });
            expect(
                encontrado,
                'Formulário ICP Conceitual carregado'
            ).to.be.true;
        });
});

// UTILIZAR MODELO EXISTENTE
Cypress.Commands.add('clicarUtilizarModeloIcpConceitual', () => {
    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
        .find('.a-CardView-fullLink')
        .last()
        .should('be.visible')
        .click({ force: true });
    cy.get('iframe', { timeout: 30000 })
        .should(($iframes) => {
            const encontrado = [...$iframes].some((iframe) => {
                const doc = iframe.contentDocument;
                return doc && doc.querySelector('#P91_NOME_NOVO');
            });
            expect(
                encontrado,
                'Formulário ICP Conceitual carregado'
            ).to.be.true;
        });
});

// PREENCHER NOME - MODELO NOVO
Cypress.Commands.add('preencherNomeIcpConceitualNovo', (nome) => {
    cy.getIcpConceitualFrame()
        .then(($frame) => {
            cy.wrap($frame)
                .find('#P91_NOME')
                .first()
                .should('exist')
                .should('be.visible')
                .click({ force: true })
                .clear({ force: true })
                .type(nome, { delay: 50 })
                .trigger('input', { force: true })
                .trigger('change', { force: true });
        });
});

// PREENCHER NOME - MODELO EXISTENTE
Cypress.Commands.add('preencherNomeIcpConceitual', (nome) => {
    cy.getIcpConceitualFrame()
        .then(($frame) => {
            cy.wrap($frame)
                .find('#P91_NOME_NOVO')
                .first()
                .should('exist')
                .should('be.visible')
                .click({ force: true })
                .clear({ force: true })
                .type(nome, { delay: 50 })
                .trigger('input', { force: true })
                .trigger('change', { force: true });
        });
});

// SELECIONAR 2ª OPÇÃO
Cypress.Commands.add('selecionarIcpConceitual', () => {
    cy.log('Abrindo seleção...');
    cy.getIcpConceitualFrame()
        .then(($frame) => {
            cy.wrap($frame)
                .find('#P91_NOME_SELECT')
                .should('be.visible')
                .click({ force: true });
        });
    cy.get('.a-PopupLOV-results li, .ui-menu-item', {
        timeout: 10000
    })
        .should('have.length.at.least', 2)
        .eq(1)
        .click({ force: true });
});

// PREENCHER INTERVALOS - MODELO NOVO
Cypress.Commands.add('preencherValoresIntervaloIcpConceitual', () => {
    const intervalos = [
        { min: '0', max: '30' },
        { min: '30', max: '50' },
        { min: '50', max: '80' },
        { min: '80', max: '90' },
        { min: '90', max: '100' }
    ];

    cy.wait(1000);

    intervalos.forEach((item, index) => {
        const rowNum = index + 1;

        cy.getIcpConceitualFrame()
            .then(($frame) => {
                const celulaMin = cy.wrap($frame)
                    .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                    .find('td.a-GV-cell')
                    .eq(3);

                if (rowNum === 1) {
                    celulaMin.dblclick({ force: true });
                } else {
                    celulaMin.click({ force: true });
                }
            });

        cy.getIcpConceitualFrame()
            .then(($frame) => {
                cy.wrap($frame)
                    .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                    .find('td.a-GV-cell')
                    .eq(3)
                    .find('input, textarea', { timeout: 10000 })
                    .should('be.visible')
                    .first()
                    .clear({ force: true })
                    .type(item.min, { delay: 30 });
            });

        cy.getIcpConceitualFrame()
            .then(($frame) => {
                cy.wrap($frame)
                    .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                    .find('td.a-GV-cell')
                    .eq(4)
                    .click({ force: true });
            });

        cy.getIcpConceitualFrame()
            .then(($frame) => {
                cy.wrap($frame)
                    .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                    .find('td.a-GV-cell')
                    .eq(4)
                    .find('input, textarea', { timeout: 10000 })
                    .should('be.visible')
                    .first()
                    .clear({ force: true })
                    .type(item.max, { delay: 30 })
                    .type('{enter}', { force: true });
            });

        cy.wait(300);
    });
});

// PRÓXIMO
Cypress.Commands.add('proximoIcpConceitual', () => {
    cy.get('iframe', { timeout: 30000 })
        .then(($iframes) => {
            const iframeEncontrado = [...$iframes].find((iframe) => {
                try {
                    const doc = iframe.contentDocument;
                    return doc &&
                        doc.querySelector(
                            'button[data-otel-label="NEXT"]'
                        );
                } catch (e) {
                    return false;
                }
            });

            expect(
                iframeEncontrado,
                'Iframe com botão Next'
            ).to.exist;

            cy.wrap(iframeEncontrado.contentDocument.body)
                .find('button[data-otel-label="NEXT"]')
                .should('be.visible')
                .should('not.be.disabled')
                .click({ force: true });
        });
});

// SELECIONAR TODOS
Cypress.Commands.add('selecionarTodosIcpConceitual', () => {
    cy.wait(1000);

    cy.getIcpConceitualFrame()
        .then(($frame) => {
            cy.wrap($frame)
                .find(
                    '[aria-label="Select All Rows"], .a-GV-headerCheckbox, th.a-GV-header--selection input',
                    { timeout: 30000 }
                )
                .should('exist')
                .should('be.visible')
                .first()
                .click({ force: true });
        });

    cy.wait(500);
});

// FINALIZAR
Cypress.Commands.add('finalizarIcpConceitual', () => {
    cy.log('Finalizando...');

    cy.wait(1500);

    cy.get('iframe', { timeout: 30000 })
        .should(($iframes) => {
            const encontrado = [...$iframes].some((iframe) => {
                try {
                    const doc = iframe.contentDocument;
                    return doc &&
                        doc.querySelector(
                            'button[data-otel-label="FINISH"]'
                        );
                } catch (e) {
                    return false;
                }
            });

            expect(
                encontrado,
                'Botão FINISH dentro do iframe'
            ).to.be.true;
        })
        .then(($iframes) => {

            const iframeEncontrado = [...$iframes].find((iframe) => {
                try {
                    const doc = iframe.contentDocument;
                    return doc &&
                        doc.querySelector(
                            'button[data-otel-label="FINISH"]'
                        );
                } catch (e) {
                    return false;
                }
            });

            const bodyDoIframe =
                iframeEncontrado.contentDocument.body;

            // Força atualização/foco do iframe
            cy.wrap(bodyDoIframe)
                .click(1, 1, { force: true });

            cy.wait(500);

            // Clica no FINISH real
            cy.wrap(bodyDoIframe)
                .find('button[data-otel-label="FINISH"]')
                .should('exist')
                .should('be.visible')
                .scrollIntoView()
                .click({ force: true });
        });

    cy.wait(1500);
});

// CONFIRMAR FINALIZAÇÃO
Cypress.Commands.add('confirmarFinalizacaoIcpConceitual', () => {
    cy.log('Confirmando finalização...');

    cy.wait(1000);

    cy.get(
        'button.js-confirmBtn, .ui-dialog-buttonpane button',
        { timeout: 30000 }
    )
        .should('be.visible')
        .last()
        .click({ force: true });

    cy.wait(1000);
});
// EDITAR MAIS RECENTE
Cypress.Commands.add('editarUltimoIcpConceitual', () => {
    const valor = Cypress._.random(1, 9);
    cy.log(`Editando ICP Conceitual com valor: ${valor}`);

    cy.get('a[aria-roledescription="dialog link"]')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.getIcpConceitualFrame().then(($frame) => {
        cy.wrap($frame)
            .find('tr.a-GV-row[data-rownum="1"]')
            .find('td.a-GV-cell')
            .eq(3)
            .dblclick({ force: true });

        cy.wrap($frame)
            .find('tr.a-GV-row[data-rownum="1"]')
            .find('td.a-GV-cell')
            .eq(3)
            .find('input, textarea', { timeout: 10000 })
            .should('be.visible')
            .first()
            .clear({ force: true })
            .type(valor, { delay: 30 });

        cy.wrap($frame)
            .find('tr.a-GV-row[data-rownum="1"]')
            .find('td.a-GV-cell')
            .eq(3)
            .type('{enter}', { force: true });
    });

    cy.wait(1000);

    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .then(cy.wrap)
        .find('button[data-action="save"]')
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);

    cy.get('button.ui-dialog-titlebar-close, button[title="Close"]')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);
});