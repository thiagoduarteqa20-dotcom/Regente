// ACESSAR NÍVEL VDM
Cypress.Commands.add('acessarNivelVdm', () => {
    cy.get('#t_MenuNav_1i')
        .should('be.visible')
        .click();

    cy.get('#t_MenuNav_1_2i')
        .then(($menu) => {
            cy.wrap($menu).trigger('mouseover');
            cy.wrap($menu).trigger('mouseenter');
        });

    cy.wait(1000);

    cy.get('#t_MenuNav_1_2im')
        .invoke('css', 'display', 'block');

    cy.contains('a', 'Nível VDM')
        .should('be.visible')
        .click();

    cy.url()
        .should('include', 'n%C3%ADvel-vdm');
});

// FRAME VDM
Cypress.Commands.add('getNivelVdmFrame', () => {
    return cy.get('iframe', { timeout: 30000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// GERAR DADOS VDM
Cypress.Commands.add('gerarDadosNivelVdm', ({
    nome = false,
    prefixo = 'VDM'
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

// ABRIR MODAL
Cypress.Commands.add('abrirCriarVdm', () => {
    cy.get('button[data-otel-label="CREATE"]')
        .should('be.visible')
        .should('not.be.disabled')
        .click();

    cy.contains('.ui-dialog-title', 'VDM - Criar', {
        timeout: 15000
    })
        .should('be.visible');
});

// CRIAR MODELO NOVO
Cypress.Commands.add('clicarCriarModeloNovoVdm', () => {
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

                return doc &&
                    doc.querySelector('#P21_NOME_VDM');
            });

            expect(
                encontrado,
                'Formulário VDM - Criar carregado'
            ).to.be.true;
        });
});

// UTILIZAR MODELO EXISTENTE
Cypress.Commands.add('clicarUtilizarModeloVdm', () => {
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

                return doc &&
                    doc.querySelector('#P21_NEW_NOME_VDM');
            });

            expect(
                encontrado,
                'Formulário VDM carregado'
            ).to.be.true;
        });
});

// PREENCHER NOME - MODELO NOVO
Cypress.Commands.add('preencherNomeNivelVdmNovo', (nome) => {
    cy.getNivelVdmFrame()
        .then(($frame) => {
            cy.wrap($frame)
                .find('#P21_NOME_VDM')
                .should('be.visible')
                .click({ force: true })
                .clear({ force: true })
                .type(nome, { delay: 50 })
                .trigger('input', { force: true })
                .trigger('change', { force: true });
        });
});

// PREENCHER NOME - MODELO EXISTENTE
Cypress.Commands.add('preencherNomeNivelVdm', (nome) => {
    cy.getNivelVdmFrame()
        .then(($frame) => {
            cy.wrap($frame)
                .find('#P21_NEW_NOME_VDM')
                .should('be.visible')
                .click({ force: true })
                .clear({ force: true })
                .type(nome, { delay: 50 })
                .trigger('input', { force: true })
                .trigger('change', { force: true });
        });
});

// SELECIONAR MODELO
Cypress.Commands.add('selecionarNivelVdm', () => {
    cy.getNivelVdmFrame()
        .then(($frame) => {
            cy.wrap($frame)
                .find('#P21_NOME_VDM_SELECT')
                .should('be.visible')
                .click({ force: true });
        });

    cy.get('.a-PopupLOV-results li, .ui-menu-item', {
        timeout: 10000
    })
        .should('have.length.at.least', 1)
        .eq(0)
        .click({ force: true });
});

// PREENCHER VALORES DE INTERVALO - MODELO NOVO
Cypress.Commands.add('preencherValoresIntervaloVdm', () => {
    const intervalos = [
        { min: '0', max: '1000' },
        { min: '1000', max: '5000' },
        { min: '5000', max: '15000' },
        { min: '15000', max: '30000' },
        { min: '30000', max: '100000' }
    ];

    cy.wait(1000);

    intervalos.forEach((item, index) => {
        const rowNum = index + 1;

        // MIN
        cy.getNivelVdmFrame().then(($frame) => {
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

        cy.getNivelVdmFrame().then(($frame) => {
            cy.wrap($frame)
                .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                .find('td.a-GV-cell')
                .eq(3)
                .find('input, textarea', { timeout: 10000 })
                .should('be.visible')
                .first()
                .clear({ force: true })
                .type(item.min, { delay: 30 })
                .type('{enter}', { force: true });
        });

        cy.wait(300);

        // MAX
        cy.getNivelVdmFrame().then(($frame) => {
            cy.wrap($frame)
                .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                .find('td.a-GV-cell')
                .eq(4)
                .click({ force: true });
        });

        cy.getNivelVdmFrame().then(($frame) => {
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

    cy.wait(500);
    cy.printPasso('nivel-vdm-tabela-preenchida');
});
// PRÓXIMO
Cypress.Commands.add('proximoVdm', () => {
    cy.get('iframe', { timeout: 30000 })
        .then(($iframes) => {
            const iframe = [...$iframes].find((iframe) => {
                const doc = iframe.contentDocument;

                return doc &&
                    doc.querySelector(
                        'button[data-otel-label="NEXT"]'
                    );
            });

            expect(
                iframe,
                'Iframe com botão Next'
            ).to.exist;

            cy.wrap(iframe.contentDocument.body)
                .find('button[data-otel-label="NEXT"]')
                .should('be.visible')
                .should('not.be.disabled')
                .click({ force: true });
        });
});

// SELECIONAR TODOS
Cypress.Commands.add('selecionarTodosVdm', () => {
    cy.wait(1000);

    cy.get('iframe', { timeout: 30000 })
        .then(($iframes) => {
            const iframe = [...$iframes].find((iframe) => {
                const body = iframe.contentDocument?.body;

                return body?.querySelector(
                    '[aria-label="Select All Rows"]'
                );
            });

            expect(
                iframe,
                'Iframe com Select All'
            ).to.exist;

            cy.wrap(iframe.contentDocument.body)
                .find('[aria-label="Select All Rows"]')
                .filter(':visible')
                .first()
                .should('be.visible')
                .click({ force: true });
        });

    cy.wait(500);
});

// FINALIZAR
Cypress.Commands.add('finalizarVdm', () => {
    cy.wait(1000);

    cy.get('iframe', { timeout: 30000 })
        .then(($iframes) => {
            const iframe = [...$iframes].find((iframe) => {
                const doc = iframe.contentDocument;

                return doc &&
                    doc.querySelector(
                        'button[data-otel-label="FINISH"]'
                    );
            });

            expect(
                iframe,
                'Iframe com botão Finish'
            ).to.exist;

            cy.wrap(iframe.contentDocument.body)
                .find('button[data-otel-label="FINISH"]')
                .should('be.visible')
                .should('not.be.disabled')
                .click({ force: true });
        });
});

// CONFIRMAR FINALIZAÇÃO
Cypress.Commands.add('confirmarFinalizacaoVdm', () => {
    cy.wait(1000);

    cy.get(
        'button.js-confirmBtn, .ui-dialog-buttonpane button',
        { timeout: 30000 }
    )
        .should('be.visible')
        .last()
        .click({ force: true });

    cy.wait(1000);
    cy.printPasso('nivel-vdm-salvo');
});
// EDITAR MAIS RECENTE
Cypress.Commands.add('editarUltimoNivelVdm', () => {
    const valor = Cypress._.random(1, 9);

    cy.log(`Editando Nível VDM com valor: ${valor}`);

    cy.get('a[aria-roledescription="dialog link"]')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);

    // Ajusta o tamanho do modal para o botão Salvar ficar acessível
    cy.get('.ui-dialog', { timeout: 10000 })
        .then(($dialog) => {
            if ($dialog.length) {
                cy.wrap($dialog).invoke('css', 'width', '90vw');
                cy.wrap($dialog).invoke('css', 'height', '85vh');
                cy.wrap($dialog).invoke('css', 'top', '5vh');
                cy.wrap($dialog).invoke('css', 'left', '5vw');
            }
        });

    cy.wait(1000);

    cy.getNivelVdmFrame()
        .then(($frame) => {
            const $celulaMin = cy.wrap($frame)
                .find('tr.a-GV-row[data-rownum="1"]')
                .find('td.a-GV-cell')
                .eq(3)
                .should('exist');

            $celulaMin.dblclick({ force: true });

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
    cy.printPasso('nivel-vdm-dados-alterados');

    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .then(cy.wrap)
        .find('button[data-action="save"]')
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('nivel-vdm-edicao-salva');

    cy.get('button.ui-dialog-titlebar-close, button[title="Close"]')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);
});