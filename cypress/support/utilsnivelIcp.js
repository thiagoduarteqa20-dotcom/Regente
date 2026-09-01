// ACESSAR NÍVEL ICP
Cypress.Commands.add('acessarNivelIcp', () => {
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
    cy.get('#t_MenuNav_1_2_0i').should('be.visible').click();
    cy.url().should('include', 'n%C3%ADvel-icp');
});
// FRAME ICP (Mesmo padrão do getJornadaFrame)
Cypress.Commands.add('getNivelIcpFrame', () => {
    cy.log('Aguardando iframe do ICP...');
    return cy.get('iframe', { timeout: 30000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});
// GERAR DADOS ICP
Cypress.Commands.add('gerarDadosNivelIcp', ({ nome = false, prefixo = 'ICP' } = {}) => {
    const dados = {};
    if (nome) {
        dados.nome = `${prefixo}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    cy.log(JSON.stringify(dados));
    return cy.wrap(dados);
});
// ABRIR MODAL ICP - CRIAR
Cypress.Commands.add('abrirCriarIcp', () => {
    cy.log('Abrindo modal ICP - Criar');
    cy.get('button[data-otel-label="CREATE"]').should('be.visible').should('not.be.disabled').click();
    cy.contains('.ui-dialog-title', 'ICP - Criar', { timeout: 15000 }).should('be.visible');
    cy.log('Modal ICP - Criar aberto');
});
// CRIAR MODELO NOVO
Cypress.Commands.add('clicarCriarModeloNovoIcp', () => {
    cy.log('Procurando card Criar Modelo Novo...');
    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
        .find('.a-CardView-fullLink')
        .first()
        .should('be.visible')
        .click({ force: true });
    cy.log('Modelo novo selecionado. Aguardando formulário ICP - Criar...');
    cy.get('iframe', { timeout: 30000 }).should(($iframes) => {
        const encontrado = [...$iframes].some((iframe) => {
            const doc = iframe.contentDocument;
            return doc && doc.querySelector('#P11_NOME_ICP');
        });
        expect(encontrado, 'Formulário ICP (Modelo Novo) carregado no iframe').to.be.true;
    });
    cy.log('Formulário ICP - Criar (Modelo Novo) carregado.');
});
// UTILIZAR MODELO EXISTENTE
Cypress.Commands.add('clicarUtilizarModeloIcp', () => {
    cy.log('Procurando card Utilizar Modelo Existente...');
    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap)
        .find('.a-CardView-fullLink')
        .last()
        .should('be.visible')
        .click({ force: true });
    cy.log('Modelo selecionado. Aguardando formulário ICP - Criar...');
    cy.get('iframe', { timeout: 30000 }).should(($iframes) => {
        const encontrado = [...$iframes].some((iframe) => {
            const doc = iframe.contentDocument;
            return doc && (doc.querySelector('#P11_NEW_NOME_ICP') || doc.querySelector('#P11_NOME_ICP_SELECT'));
        });
        expect(encontrado, 'Formulário ICP carregado no iframe').to.be.true;
    });
    cy.log('Formulário ICP - Criar carregado.');
});
// PREENCHER NOME ICP
Cypress.Commands.add('preencherNomeNivelIcp', (nome) => {
    cy.log(`Preenchendo nome ICP: ${nome}`);
    cy.getNivelIcpFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P11_NOME_ICP, #P11_NEW_NOME_ICP')
            .first()
            .should('exist')
            .should('be.visible')
            .click({ force: true })
            .clear({ force: true })
            .type(nome, { delay: 50 })
            .trigger('input', { force: true })
            .trigger('change', { force: true });
    });
    cy.log('Nome ICP preenchido com sucesso.');
});
// PREENCHER VALORES DE INTERVALO (Min e Max)
Cypress.Commands.add('preencherValoresIntervaloIcp', () => {
    cy.log('Aguardando a tabela de intervalos ICP carregar...');
    const intervalos = [
        { min: '0', max: '30' },
        { min: '30', max: '50' },
        { min: '50', max: '80' },
        { min: '80', max: '90' },
        { min: '90', max: '100' }
    ];
    cy.getNivelIcpFrame().then(($frame) => {
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
                .find('input, textarea', { timeout: 10000 })
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
                        .find('input, textarea', { timeout: 10000 })
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
    });
    cy.log('Intervalos de Min e Max preenchidos com sucesso em todas as linhas!');
});
// SELECIONAR 3ª OPÇÃO (Popup LOV)
Cypress.Commands.add('selecionarNivelIcp', () => {
    cy.log('Abrindo seleção de nível ICP...');
    cy.getNivelIcpFrame().then(($frame) => {
        cy.wrap($frame).find('#P11_NOME_ICP_SELECT').should('be.visible').click({ force: true });
    });
    cy.log('Aguardando opções do Popup LOV aparecerem na tela...');
    cy.get('.a-PopupLOV-results li, .ui-menu-item', { timeout: 10000 })
        .should('have.length.at.least', 3)
        .eq(2)
        .click({ force: true });
    cy.log('Nível ICP selecionado.');
});
// PRÓXIMO
Cypress.Commands.add('proximoIcp', () => {
    cy.log('Avançando para próxima etapa...');
    cy.get('iframe', { timeout: 30000 }).then(($iframes) => {
        const iframeEncontrado = [...$iframes].find((iframe) => {
            try {
                const doc = iframe.contentDocument;
                return doc && doc.querySelector('button[data-otel-label="NEXT"]');
            } catch (e) {
                return false;
            }
        });
        expect(iframeEncontrado, 'Iframe com o botão Next').to.exist;
        const bodyDoIframe = iframeEncontrado.contentDocument.body;
        cy.wrap(bodyDoIframe)
            .find('button[data-otel-label="NEXT"]')
            .should('be.visible')
            .should('not.be.disabled')
            .click({ force: true });
    });
});
// SELECIONAR TODOS
Cypress.Commands.add('selecionarTodosIcp', () => {
    cy.log('Selecionando todos os registros na tabela...');
    cy.wait(1000);
    cy.getNivelIcpFrame().then(($frame) => {
        cy.wrap($frame)
            .find('[aria-label="Select All Rows"], .a-GV-headerCheckbox, th.a-GV-header--selection input', { timeout: 30000 })
            .should('exist')
            .should('be.visible')
            .first()
            .click({ force: true });
    });
    cy.wait(500);
});
// FINALIZAR
Cypress.Commands.add('finalizarIcp', () => {
    cy.log('Finalizando ICP...');
    cy.wait(1500);
    cy.get('iframe', { timeout: 30000 })
        .should(($iframes) => {
            const encontrado = [...$iframes].some((iframe) => {
                try {
                    const doc = iframe.contentDocument;
                    return doc && doc.querySelector('#B5172765559955901, button[data-otel-label="FINISH"]');
                } catch (e) {
                    return false;
                }
            });
            expect(encontrado, 'Botão FINISH dentro do iframe').to.be.true;
        })
        .then(($iframes) => {
            const iframeEncontrado = [...$iframes].find((iframe) => {
                const doc = iframe.contentDocument;
                return doc && doc.querySelector('#B5172765559955901, button[data-otel-label="FINISH"]');
            });
            const bodyDoIframe = iframeEncontrado.contentDocument.body;
            cy.wrap(bodyDoIframe).click(1, 1, { force: true });
            cy.wait(500);
            cy.wrap(bodyDoIframe)
                .find('#B5172765559955901, button[data-otel-label="FINISH"]')
                .should('exist')
                .should('be.visible')
                .scrollIntoView()
                .click({ force: true });
        });
    cy.wait(1000);
});
// CONFIRMAR FINALIZAÇÃO
Cypress.Commands.add('confirmarFinalizacaoIcp', () => {
    cy.log('Confirmando finalização...');
    cy.wait(1000);
    cy.get('button.js-confirmBtn, .ui-dialog-buttonpane button', { timeout: 30000 })
        .should('be.visible')
        .last()
        .click({ force: true });
    cy.wait(1000);
});
// EDITAR MAIS RECENTE
Cypress.Commands.add('editarUltimoNivelIcp', () => {
    cy.log('Clicando no botão de editar do registro mais recente...');
    cy.get('a[aria-roledescription="dialog link"]')
        .last()
        .should('be.visible')
        .click({ force: true });
    cy.wait(1500);
    cy.log('Modificando a primeira célula (de 0 para 1) com duplo clique...');
    cy.getNivelIcpFrame().then(($frame) => {
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
            .type('1', { delay: 30 });
        cy.wrap($frame)
            .find('tr.a-GV-row[data-rownum="1"]')
            .find('td.a-GV-cell')
            .eq(3)
            .type('{enter}', { force: true });
    });
    cy.wait(1000);
    cy.log('Salvando alterações...');
    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .then(cy.wrap)
        .find('button[data-action="save"]')
        .should('be.visible')
        .click({ force: true });
    cy.wait(2000);
    cy.log('Fechando aba do modal...');
    cy.get('button.ui-dialog-titlebar-close, button[title="Close"]')
        .last()
        .should('be.visible')
        .click({ force: true });
    cy.wait(1000);
});