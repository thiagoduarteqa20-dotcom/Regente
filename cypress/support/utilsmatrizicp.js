// ACESSAR MATRIZ - ICP/IDADE
Cypress.Commands.add('acessarMatrizIcpIdade', () => {
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
    cy.contains('a', 'Matriz - ICP/Idade')
        .should('be.visible')
        .click();
    cy.url()
        .should('include', 'matriz-icp-idade');
});

// FRAME
Cypress.Commands.add('getMatrizIcpIdadeFrame', () => {
    cy.log('Aguardando iframe da Matriz - ICP Idade...');
    return cy.get('iframe', { timeout: 30000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// GERAR DADOS
Cypress.Commands.add('gerarDadosMatrizIcpIdade', ({
    nome = false,
    prefixo = 'MATRIZ_ICP_IDADE'
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
Cypress.Commands.add('abrirCriarMatrizIcpIdade', () => {
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
Cypress.Commands.add('clicarCriarModeloNovoMatrizIcpIdade', () => {
    cy.getMatrizIcpIdadeFrame()
        .find('.a-CardView-fullLink')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);

    cy.get('iframe', { timeout: 30000 })
        .should(($iframes) => {
            const encontrado = [...$iframes].some((iframe) => {
                const doc = iframe.contentDocument;

                return doc &&
                    doc.querySelector(
                        '#P51_NOME_MATRIZ_ICP_IDADE'
                    );
            });

            expect(
                encontrado,
                'Formulário Matriz ICP Idade - Modelo Novo'
            ).to.be.true;
        });
});

// UTILIZAR MODELO EXISTENTE
Cypress.Commands.add('clicarUtilizarModeloMatrizIcpIdade', () => {
    cy.getMatrizIcpIdadeFrame()
        .find('.a-CardView-fullLink')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);

    cy.get('iframe', { timeout: 30000 })
        .should(($iframes) => {
            const encontrado = [...$iframes].some((iframe) => {
                const doc = iframe.contentDocument;

                return doc &&
                    doc.querySelector(
                        '#P51_NOME_MATRIZ_ICP_IDADE_SELECT'
                    );
            });

            expect(
                encontrado,
                'Formulário Matriz ICP Idade - Modelo Existente'
            ).to.be.true;
        });
});

// PREENCHER NOME - MODELO NOVO (ID preservado)
Cypress.Commands.add('preencherNomeMatrizIcpIdadeNovo', (nome) => {
    cy.getMatrizIcpIdadeFrame()
        .find('#P51_NOME_MATRIZ_ICP_IDADE')
        .should('be.visible')
        .clear()
        .type(nome, { delay: 50 });
});

// PREENCHER NOME - MODELO EXISTENTE (Novo ID correto)
Cypress.Commands.add('preencherNomeMatrizIcpIdadeExistente', (nome) => {
    cy.getMatrizIcpIdadeFrame()
        .find('#P51_NEW_NOME_MATRIZ_ICP_IDADE')
        .should('be.visible')
        .clear()
        .type(nome, { delay: 50 });
});

// PREENCHER PESO
Cypress.Commands.add('preencherPesoMatrizIcpIdade', () => {
    cy.getMatrizIcpIdadeFrame()
        .find('#P51_PESO')
        .should('be.visible')
        .clear()
        .type('1,00', { delay: 50 });
});

// SELECIONAR MODELO EXISTENTE (Seleciona a primeira opção do combobox)
Cypress.Commands.add('selecionarMatrizIcpIdade', () => {
    cy.getMatrizIcpIdadeFrame()
        .find('#P51_NOME_MATRIZ_ICP_IDADE_SELECT')
        .should('be.visible')
        .click({ force: true });

    cy.get('.a-PopupLOV-results li, .ui-menu-item', {
        timeout: 10000
    })
        .should('have.length.at.least', 1)
        .eq(0)
        .click({ force: true });
});

// PREENCHER MATRIZ (Aguardando a transição de página e a Grid carregar)
Cypress.Commands.add('preencherValoresMatrizIcpIdade', () => {
    const matriz = [
        ['9', '2', '3', '4'],
        ['6', '7', '8', '9'],
        ['11', '12', '13', '14'],
        ['16', '17', '18', '19'],
        ['21', '22', '23', '24']
    ];

    cy.log('Aguardando a Grid da Matriz carregar após a mudança de tela...');

    // 1. Aguarda dinamicamente o APEX recarregar o iframe e renderizar as linhas da tabela
    cy.get('iframe', { timeout: 30000 }).should(($iframes) => {
        const encontrado = [...$iframes].some((iframe) => {
            try {
                const doc = iframe.contentDocument;
                return doc && doc.querySelector('tr.a-GV-row[data-rownum="1"]');
            } catch (e) {
                return false;
            }
        });
        expect(encontrado, 'Grid da Matriz carregada no iframe').to.be.true;
    });

    cy.wait(600); // Respiro para o APEX ativar os eventos de clique nas células

    // 2. Preenchimento célula por célula
    matriz.forEach((linha, linhaIndex) => {
        const rowNum = linhaIndex + 1;

        linha.forEach((valor, colunaIndex) => {
            const coluna = colunaIndex + 3;

            // Foca e abre o modo de edição na célula
            cy.getMatrizIcpIdadeFrame().then(($frame) => {
                const celula = cy.wrap($frame)
                    .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                    .find('td.a-GV-cell')
                    .eq(coluna);

                if (linhaIndex === 0 && colunaIndex === 0) {
                    celula.dblclick({ force: true });
                } else {
                    celula.click({ force: true });
                }
            });

            // Localiza o input gerado pelo APEX e digita o valor
            cy.getMatrizIcpIdadeFrame().then(($frame) => {
                cy.wrap($frame)
                    .find(`tr.a-GV-row[data-rownum="${rowNum}"]`)
                    .find('td.a-GV-cell')
                    .eq(coluna)
                    .find('input, textarea', { timeout: 10000 })
                    .should('be.visible')
                    .first()
                    .clear({ force: true })
                    .type(valor, { delay: 30 })
                    .type('{enter}', { force: true });
            });

            cy.wait(300);
        });
    });

    cy.wait(500);
    cy.printPasso('matriz-icp-idade-preenchida');
});

// PRÓXIMO
Cypress.Commands.add('proximoMatrizIcpIdade', () => {
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

// FINALIZAR
Cypress.Commands.add('finalizarMatrizIcpIdade', () => {
    cy.log('Finalizando Matriz ICP Idade...');
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

// CONFIRMAR
Cypress.Commands.add('confirmarFinalizacaoMatrizIcpIdade', () => {
    cy.wait(1000);

    cy.get(
        'button.js-confirmBtn, .ui-dialog-buttonpane button',
        { timeout: 30000 }
    )
        .should('be.visible')
        .last()
        .click({ force: true });

    cy.wait(1000);
    cy.printPasso('matriz-icp-idade-salva');
});

// EDITAR
Cypress.Commands.add('editarUltimaMatrizIcpIdade', () => {
    const valor = Cypress._.random(1, 9);

    cy.log(`Editando Matriz ICP Idade com valor: ${valor}`);

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

    cy.getMatrizIcpIdadeFrame()
        .then(($frame) => {
            cy.wrap($frame)
                .find('tr.a-GV-row[data-rownum="1"]')
                .find('td.a-GV-cell')
                .eq(3)
                .dblclick({ force: true });

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
    cy.printPasso('matriz-icp-idade-alterada');

    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .then(cy.wrap)
        .find('button[data-action="save"]')
        .should('be.visible')
        .scrollIntoView()
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('matriz-icp-idade-edicao-salva');

    cy.get('button.ui-dialog-titlebar-close, button[title="Close"]')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);
});

// SELECIONAR TODOS (Marca a checkmark da header na grid)
Cypress.Commands.add('selecionarTodosMatrizIcpIdade', () => {
    cy.wait(1000);

    cy.getMatrizIcpIdadeFrame()
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