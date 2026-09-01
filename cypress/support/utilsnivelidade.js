Cypress.Commands.add('acessarNivelIdade', () => {
    cy.log('Abrindo Parâmetros');
    cy.get('#t_MenuNav_1i').should('be.visible').click();
    cy.log('Abrindo Planejamento de Resultados');
    cy.get('#t_MenuNav_1_2i').should('exist').then(($menu) => {
        cy.wrap($menu).trigger('mouseover');
        cy.wrap($menu).trigger('mouseenter');
    });
    cy.wait(1000);
    cy.log('Forçando abertura do submenu APEX');
    cy.get('#t_MenuNav_1_2im').invoke('css', 'display', 'block');
    cy.get('#t_MenuNav_1_2_1i').should('be.visible').click();
    cy.url().should('include', 'n%C3%ADvel-idade');
});

// FRAME IDADE
Cypress.Commands.add('getNivelIdadeFrame', () => {
    cy.log('Aguardando iframe do Nível Idade...');
    return cy.get('iframe', { timeout: 30000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// GERAR DADOS IDADE
Cypress.Commands.add('gerarDadosNivelIdade', ({
    nome = false,
    prefixo = 'IDADE'
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
Cypress.Commands.add('abrirCriarIdade', () => {
    cy.log('Abrindo modal - Criar');

    cy.get('button[data-otel-label="CREATE"]')
        .should('be.visible')
        .should('not.be.disabled')
        .click();

    cy.contains('.ui-dialog-title', 'Criar', {
        timeout: 15000
    })
        .should('be.visible');

    cy.log('Modal Criar aberto');
});

// CRIAR MODELO NOVO
Cypress.Commands.add('clicarCriarModeloNovoIdade', () => {
    cy.log('Procurando card Criar Modelo Novo...');

    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
        .find('.a-CardView-fullLink')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.log('Modelo novo selecionado. Aguardando formulário...');

    cy.get('iframe', { timeout: 30000 })
        .should(($iframes) => {
            const encontrado = [...$iframes].some((iframe) => {
                const doc = iframe.contentDocument;

                return doc &&
                    (
                        doc.querySelector('input[id*="NOME"]') ||
                        doc.querySelector('#P11_NOME_ICP')
                    );
            });

            expect(
                encontrado,
                'Formulário carregado no iframe'
            ).to.be.true;
        });
});

// UTILIZAR MODELO EXISTENTE
Cypress.Commands.add('clicarUtilizarModeloIdade', () => {
    cy.log('Procurando card Utilizar Modelo Existente...');

    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
        .find('.a-CardView-fullLink')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.log('Modelo selecionado. Aguardando formulário...');

    cy.get('iframe', { timeout: 30000 })
        .should(($iframes) => {
            const encontrado = [...$iframes].some((iframe) => {
                const doc = iframe.contentDocument;

                return doc &&
                    (
                        doc.querySelector('input[id*="NOME"]') ||
                        doc.querySelector('#P11_NEW_NOME_ICP')
                    );
            });

            expect(
                encontrado,
                'Formulário carregado no iframe'
            ).to.be.true;
        });
});

// PREENCHER NOME
Cypress.Commands.add('preencherNomeNivelIdade', (nome) => {
    cy.log(`Preenchendo nome: ${nome}`);

    cy.getNivelIdadeFrame()
        .then(($frame) => {
            cy.wrap($frame)
                .find('input[id*="NOME"]')
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

// PREENCHER VALORES DE INTERVALO
Cypress.Commands.add('preencherValoresIntervaloIdade', () => {
    cy.log('Aguardando a tabela de intervalos carregar...');

    const intervalos = [
        { min: '15', max: '100' },
        { min: '11', max: '15' },
        { min: '7', max: '11' },
        { min: '3', max: '7' },
        { min: '0', max: '3' }
    ];

    cy.getNivelIdadeFrame()
        .then(($frame) => {

            cy.wrap($frame)
                .find('tr.a-GV-row', { timeout: 30000 })
                .should('have.length.at.least', 5);

            intervalos.forEach((item, index) => {

                const rowNum = index + 1;

                cy.log(`Preenchendo linha ${rowNum}`);

                const $celulaMin = cy.wrap($frame)
                    .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                    .find('td.a-GV-cell')
                    .eq(3)
                    .should('exist');

                if (rowNum === 1) {
                    $celulaMin.dblclick({ force: true });
                } else {
                    $celulaMin.click({ force: true });
                }

                cy.wrap($frame)
                    .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                    .find('td.a-GV-cell')
                    .eq(3)
                    .find('input, textarea', {
                        timeout: 10000
                    })
                    .should('be.visible')
                    .first()
                    .clear({ force: true })
                    .type(item.min, { delay: 30 });

                cy.wrap($frame)
                    .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                    .find('td.a-GV-cell')
                    .eq(4)
                    .should('exist')
                    .click({ force: true })
                    .then(() => {

                        cy.wrap($frame)
                            .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                            .find('td.a-GV-cell')
                            .eq(4)
                            .find('input, textarea', {
                                timeout: 10000
                            })
                            .should('be.visible')
                            .first()
                            .clear({ force: true })
                            .type(item.max, { delay: 30 });
                    });

                cy.wrap($frame)
                    .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                    .find('td.a-GV-cell')
                    .eq(4)
                    .type('{enter}', { force: true });

                cy.wait(300);
            });

            cy.wait(500);

            cy.wrap($frame)
                .find('tr.a-GV-row[data-rownum="5"]')
                .find('td.a-GV-cell')
                .eq(4)
                .type('{enter}', { force: true });

            cy.wait(500);
        });
});

// SELECIONAR 1ª OPÇÃO
Cypress.Commands.add('selecionarNivelIdade', () => {
    cy.log('Abrindo seleção...');

    cy.getNivelIdadeFrame()
        .then(($frame) => {
            cy.wrap($frame)
                .find('input[id*="SELECT"]')
                .filter(':visible')
                .first()
                .should('be.visible')
                .click({ force: true });
        });

    cy.log('Aguardando opções do Popup LOV...');

    cy.get('.a-PopupLOV-results li, .ui-menu-item', {
        timeout: 10000
    })
        .should('have.length.at.least', 1)
        .eq(0)
        .click({ force: true });
});

// PRÓXIMO
Cypress.Commands.add('proximoIdade', () => {
    cy.log('Avançando...');

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
                'Iframe com o botão Next'
            ).to.exist;

            const bodyDoIframe =
                iframeEncontrado.contentDocument.body;

            cy.wrap(bodyDoIframe)
                .find('button[data-otel-label="NEXT"]')
                .should('be.visible')
                .should('not.be.disabled')
                .click({ force: true });
        });
});

// SELECIONAR TODOS
Cypress.Commands.add('selecionarTodosIdade', () => {
    cy.log('Selecionando todos...');

    cy.wait(1000);

    cy.getNivelIdadeFrame()
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
Cypress.Commands.add('finalizarIdade', () => {
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

                const doc = iframe.contentDocument;

                return doc &&
                    doc.querySelector(
                        'button[data-otel-label="FINISH"]'
                    );
            });

            const bodyDoIframe =
                iframeEncontrado.contentDocument.body;

            cy.wrap(bodyDoIframe)
                .click(1, 1, { force: true });

            cy.wait(500);

            cy.wrap(bodyDoIframe)
                .find('button[data-otel-label="FINISH"]')
                .should('exist')
                .should('be.visible')
                .scrollIntoView()
                .click({ force: true });
        });

    cy.wait(1000);
});

// CONFIRMAR FINALIZAÇÃO
Cypress.Commands.add('confirmarFinalizacaoIdade', () => {
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

// EDITAR
Cypress.Commands.add('editarUltimoNivelIdade', () => {
    const valor = Cypress._.random(1, 9);

    cy.log(`Editando Nível Idade com valor: ${valor}`);

    cy.get('a[aria-roledescription="dialog link"]')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);

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

    cy.getNivelIdadeFrame()
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
                .find('input, textarea', {
                    timeout: 10000
                })
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