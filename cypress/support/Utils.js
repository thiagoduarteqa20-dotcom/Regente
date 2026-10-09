import { parameterTypeElements } from './elements/parameterType.elements';
import { jornadaElements } from './elements/jornadas.elements';

// ==================== Utils.js ====================
// FRAME DO MODAL
Cypress.Commands.add('getParameterTypeFrame', () => {
    cy.log('Obtendo iframe do modal...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});
// GERA DADOS
Cypress.Commands.add('gerarDadosCadastro', ({
    codigo = false,
    descricao = false,
    prefixo = 'TESTE',
    codigoMin = 1,
    codigoMax = 99
} = {}) => {
    const dados = {};
    if (codigo) {
        dados.codigo = Cypress._.random(codigoMin, codigoMax).toString();
    }
    if (descricao) {
        dados.descricao =
            `${prefixo}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    cy.log(JSON.stringify(dados));
    return cy.wrap(dados);
});
// MENU
Cypress.Commands.add('navigateMenu', (menu, submenu, urlEsperada) => {
    cy.log(`Abrindo menu ${menu}`);
    cy.contains('button.a-MenuBar-label', menu)
        .click();
    cy.contains('a', submenu)
        .click();
    if (urlEsperada) {
        cy.url().should('include', urlEsperada);
    }
});
// PREENCHER FORMULÁRIO
Cypress.Commands.add('preencherFormulario', (dados) => {
    cy.getParameterTypeFrame().then(($frame) => {
        if (dados.codigo) {
            cy.wrap($frame)
                .find(parameterTypeElements.codigo)
                .should('have.length', 1)
                .then(($campo) => {
                    cy.log(`Campo código encontrado: ${$campo.length}`);
                    cy.wrap($campo)
                        .clear()
                        .type(dados.codigo);
                });
        }
        if (dados.descricao) {
            cy.wrap($frame)
                .find(parameterTypeElements.descricao)
                .should('have.length', 1)
                .then(($campo) => {
                    cy.log(`Campo descrição encontrado: ${$campo.length}`);
                    cy.wrap($campo)
                        .clear()
                        .type(dados.descricao);
                });
        }
    });
});
// SALVAR
Cypress.Commands.add('salvarTipoParametro', () => {
    cy.getParameterTypeFrame().then(($frame) => {
        cy.log('Procurando botão de salvar...');
        const criar =
            $frame.find('button:contains("Criar")');
        const editar =
            $frame.find('button:contains("Aplicar Alterações")');
        cy.log(`Botão Criar: ${criar.length}`);
        cy.log(`Botão Alterar: ${editar.length}`);
        if (criar.length) {
            cy.wrap(criar).click();
        } else if (editar.length) {
            cy.wrap(editar).click();
        } else {
            throw new Error('Nenhum botão encontrado.');
        }
    });
});
// ABRIR MODAL DE CRIAÇÃO
Cypress.Commands.add('createParameterType', (title = 'Cadastrar Tipo de Parâmetro') => {
    cy.log('Abrindo modal...');
    cy.contains('button.t-Button', 'Criar')
        .should('be.visible')
        .should('not.be.disabled')
        .click();
    cy.contains('.ui-dialog-title', title, { timeout: 10000 })
        .should('be.visible');
    cy.log('Modal aberto.');
    return cy.gerarDadosCadastro({
        codigo: true,
        descricao: true,
        prefixo: 'TP'
    }).then((dados) => {
        cy.preencherFormulario(dados);
        cy.printPasso('tipo-parametro-dados-preenchidos');
        cy.salvarTipoParametro();
        cy.printPasso('tipo-parametro-salvo');
        return cy.wrap(dados);
    });
});
Cypress.Commands.add('validarParametroCriado', (dados) => {
    cy.log(`Validando parâmetro: ${dados.descricao}`);
    cy.contains('table', 'Descrição do Tipo de Parâmetro')
        .should('exist');
    cy.contains(dados.descricao)
        .should('be.visible');
});

// ==================== utilsativos.js ====================
// FRAME DO MODAL DE ATIVOS
Cypress.Commands.add('getAtivosFrame', () => {
    cy.log('Obtendo iframe do modal de Ativos...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO PARA ATIVOS
Cypress.Commands.add('acessarAtivos', () => {
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

    cy.log('Clicando em Ativos...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Ativos')
        .should('exist')
        .click({ force: true });

    cy.url().should('include', 'ativos');
    cy.get('.a-IRR-table, table', { timeout: 15000 }).should('be.visible');
    cy.wait(500);
    cy.printPasso('ativos-tela-acessada');
});

// CRIAR ATIVO
Cypress.Commands.add('criarAtivo', () => {
    cy.log('Abrindo modal de criação de Ativo...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');
    cy.printPasso('ativos-modal-criacao-aberto');

    const descRandom = `ATIVO_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P117_CD_TP_ATIVO')
            .should('be.visible')
            .children('option')
            .eq(1)
            .then(($opt) => {
                cy.wrap($frame).find('#P117_CD_TP_ATIVO').select($opt.val(), { force: true });
            });

        cy.wrap($frame)
            .find('#P117_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descRandom, { delay: 30 });

        cy.wrap($frame)
            .find('#P117_TP_REFERENCIA_ESPACIAL_0')
            .check({ force: true });

        cy.wrap($frame)
            .find('#P117_DH_INICIO_VIGENCIA_input')
            .clear({ force: true })
            .type('01/01/2026', { delay: 20 });

        cy.wrap($frame)
            .find('#P117_DH_FIM_VIGENCIA_input')
            .clear({ force: true })
            .type('31/12/2030', { delay: 20 });

        cy.wrap($frame).find('#P117_CONDICOES_0').check({ force: true });
        cy.wrap($frame).find('#P117_CONDICOES_5').check({ force: true });
        cy.wrap($frame).find('#P117_MATERIAIS_0').check({ force: true });
        cy.wrap($frame).find('#P117_HIERARQUIAS_4').check({ force: true });

        cy.printPasso('ativos-formulario-preenchido');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"]')
            .should('be.visible')
            .click({ force: true });
        cy.wait(2000);
        cy.printPasso('ativos-criado-com-sucesso');
        return cy.wrap({ descricao: descRandom });
    });

});

// EDITAR ATIVO POR DESCRIÇÃO
Cypress.Commands.add('editarAtivoPorDescricao', (descricao) => {
    cy.log(`Abrindo edição do Ativo: ${descricao}...`);

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${descricao}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);
    cy.printPasso('ativos-modal-edicao-aberto');

    const novaDescricao = `${descricao}_EDITADO`;

    cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P117_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(novaDescricao, { delay: 30 });

        cy.printPasso('ativos-edicao-preenchida');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('ativos-edicao-salva');
    return cy.wrap({ novaDescricao });
});

// CONFIGURAR CAMPOS DO ATIVO
Cypress.Commands.add('configurarCamposAtivo', (descricao) => {
    cy.log(`Acessando configuração de campos para o Ativo: ${descricao}...`);

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${descricao}")`)
        .last()
        .scrollIntoView()
        .find('a[href*="campos-do-ativo"]')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);
    cy.printPasso('ativos-config-campos-aberta');

    cy.log('Criando campo customizado...');
    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const nomeCampo = `CAMPO_${Math.floor(Math.random() * 1000)}`;
    const aliasCampo = `AL_${Math.floor(Math.random() * 1000)}`;

    cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame).find('#P111_NOME_CAMPO').type(nomeCampo, { delay: 30 });
        cy.wrap($frame).find('#P111_ALIAS_CAMPO').type(aliasCampo, { delay: 30 });

        cy.wrap($frame).find('#P111_CD_TP_DADO_CAMPO').children('option').eq(1).then(($opt) => {
            cy.wrap($frame).find('#P111_CD_TP_DADO_CAMPO').select($opt.val(), { force: true });
        });

        cy.wrap($frame).find('#P111_DH_INICIO_VIGENCIA_input').type('01/01/2026', { delay: 20 });
        cy.wrap($frame).find('#P111_DH_FIM_VIGENCIA_input').type('31/12/2030', { delay: 20 });

        cy.printPasso('ativos-campo-customizado-preenchido');

        cy.wrap($frame).find('button[data-otel-label="CREATE"]').click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('ativos-campo-customizado-criado');

    // Editar o campo recém criado
    cy.log('Editando campo customizado criado...');
    cy.get('tbody tr').last().find('span.fa-edit').parents('a').first().click({ force: true });
    cy.wait(1500);

    cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame).find('#P111_NOME_CAMPO').clear().type(`${nomeCampo}_MOD`, { delay: 30 });
        cy.printPasso('ativos-campo-customizado-editado');
        cy.wrap($frame).find('button[data-otel-label="SAVE"]').click({ force: true });
    });

    cy.wait(2000);

    // Deletar o campo criado
    cy.log('Deletando campo customizado...');
    cy.get('tbody tr').last().find('span.fa-edit').parents('a').first().click({ force: true });
    cy.wait(1500);

    cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame).find('button[data-otel-label="DELETE"]').click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('ativos-campo-customizado-confirmacao-delecao');

    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 }).click({ force: true });
    cy.wait(2000);
    cy.printPasso('ativos-campo-customizado-deletado');

    cy.go('back');
    cy.wait(1500);
});

// DELETAR ATIVO POR DESCRIÇÃO
Cypress.Commands.add('deletarAtivoPorDescricao', (descricao) => {
    cy.log(`Abrindo Ativo para exclusão: ${descricao}...`);

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${descricao}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.getAtivosFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('ativos-confirmacao-exclusao');

    cy.log('Confirmando exclusão do Ativo...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('ativos-deletado');
});

// ==================== utilsativosinventario.js ====================
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

// ==================== utilsciclo.js ====================
// ACESSAR MENU CICLOS
Cypress.Commands.add('acessarCiclos', () => {
    cy.log('Abrindo Parâmetros');
    cy.get('#t_MenuNav_1i')
        .should('be.visible')
        .click();

    cy.log('Hover no item Ciclos');
    cy.contains('.a-Menu-label, .a-Tree-label, span, a', 'Ciclos')
        .should('exist')
        .then(($menu) => {
            cy.wrap($menu).trigger('mouseover');
            cy.wrap($menu).trigger('mouseenter');
        });

    cy.wait(1000);

    cy.log('Exibindo submenu e clicando em Ciclo');
    cy.get('.a-Menu').invoke('css', 'display', 'block');

    cy.contains('a', /^Ciclo$/i)
        .should('be.visible')
        .click({ force: true });

    cy.url().should('include', 'ciclo');
});

// OBTER IFRAME DO MODAL DE CICLOS
Cypress.Commands.add('getCicloFrame', () => {
    return cy.get('iframe', { timeout: 30000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// GERAR DADOS DINÂMICOS
Cypress.Commands.add('gerarDadosCiclo', ({ prefixo = 'CICLO' } = {}) => {
    const sulfixo = Math.random().toString(36).substring(2, 8).toUpperCase();
    const dados = {
        nome: `${prefixo}_${sulfixo}`,
        descricao: `Descrição automatizada do ${prefixo}_${sulfixo}`,
        dtInicio: '01/01/2026',
        dtFim: '31/12/2026'
    };

    cy.log(JSON.stringify(dados));
    return cy.wrap(dados);
});

// ABRIR MODAL DE CRIAÇÃO
Cypress.Commands.add('abrirCriarCiclo', () => {
    cy.log('Abrindo modal de criação');
    cy.get('button[data-otel-label="CREATE"]')
        .should('be.visible')
        .click({ force: true });

    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .should('not.be.empty');
});

// PREENCHER FORMULÁRIO DE CICLO
Cypress.Commands.add('preencherFormularioCiclo', (dados) => {
    cy.log('Preenchendo formulário no iframe do Ciclo');

    cy.getCicloFrame().then(($frame) => {
        // Tipo de Atividade: Seleciona a 2ª opção
        cy.wrap($frame)
            .find('#P41_CD_TP_ATIVIDADE_CAMPO')
            .should('exist')
            .find('option')
            .eq(1)
            .then(($option) => {
                cy.wrap($frame)
                    .find('#P41_CD_TP_ATIVIDADE_CAMPO')
                    .select($option.val(), { force: true });
            });

        // Nome do Ciclo
        cy.wrap($frame)
            .find('#P41_NM_CICLO')
            .should('be.visible')
            .clear({ force: true })
            .type(dados.nome, { delay: 30 });

        // Descrição do Ciclo
        cy.wrap($frame)
            .find('#P41_DS_CICLO')
            .should('be.visible')
            .clear({ force: true })
            .type(dados.descricao, { delay: 20 });

        // Tipo Parâmetro: Seleciona a 3ª opção
        cy.wrap($frame)
            .find('#P41_CD_PARAMETRO')
            .should('exist')
            .find('option')
            .eq(2)
            .then(($option) => {
                cy.wrap($frame)
                    .find('#P41_CD_PARAMETRO')
                    .select($option.val(), { force: true });
            });

        // Data Início
        cy.wrap($frame)
            .find('#P41_DT_INICIO_input')
            .should('be.visible')
            .clear({ force: true })
            .type(dados.dtInicio, { delay: 30 });

        // Data Fim
        cy.wrap($frame)
            .find('#P41_DT_FIM_input')
            .should('be.visible')
            .clear({ force: true })
            .type(dados.dtFim, { delay: 30 });
    });

    cy.wait(500);
    cy.printPasso('ciclo-formulario-preenchido');
});

// CONFIRMAR CRIAÇÃO
Cypress.Commands.add('confirmarCriarCiclo', () => {
    cy.log('Submetendo cadastro no iframe');

    cy.getCicloFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#B6521182125618423, button[data-otel-label="CREATE"]')
            .first()
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('ciclo-cadastrado-com-sucesso');
});

// EDITAR ÚLTIMO CICLO
Cypress.Commands.add('editarUltimoCiclo', () => {
    cy.log('Abrindo edição do último Ciclo criado');
    cy.get('span.fa-edit, .fa-edit')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);

    cy.getCicloFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P41_DS_CICLO')
            .should('be.visible')
            .clear({ force: true })
            .type('Descrição editada do ciclo', { delay: 20 });

        cy.log('Clicando no botão Aplicar (SAVE)');
        cy.wrap($frame)
            .find('#B6520763013618423, button[data-otel-label="SAVE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('ciclo-editado-com-sucesso');
});

// DELETAR ÚLTIMO CICLO
Cypress.Commands.add('deletarUltimoCiclo', () => {
    cy.log('Abrindo edição do último Ciclo para deletar');
    cy.get('span.fa-edit, .fa-edit')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);

    cy.getCicloFrame().then(($frame) => {
        cy.log('Clicando no botão Deletar');
        cy.wrap($frame)
            .find('#B6520397486618423, button[data-otel-label="DELETE"]')
            .should('be.visible')
            .click({ force: true });
    });

    // Aguarda o modal de confirmação do APEX aparecer
    cy.wait(1500);

    cy.log('Confirmando exclusão no modal');
    cy.get('button.js-confirmBtn, .ui-button--danger')
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('ciclo-deletado-com-sucesso');
});

// ==================== utilsconceitual.js ====================
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

    cy.wait(300);
    cy.printPasso('icp-conceitual-tabela-preenchida');
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
            cy.wait(300);
            cy.printPasso('icp-conceitual-tabela-preenchida');
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
    cy.printPasso('icp-conceitual-salvo');
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
    cy.printPasso('icp-conceitual-dados-alterados');

    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .then(cy.wrap)
        .find('button[data-action="save"]')
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('icp-conceitual-edicao-salva');

    cy.get('button.ui-dialog-titlebar-close, button[title="Close"]')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);
});

// ==================== utilsjornada.js ====================
// FRAME JORNADA
Cypress.Commands.add('getJornadaFrame', () => {
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// GERAR DADOS
Cypress.Commands.add('gerarDadosJornada', ({ tipoJornada = false, prefixo = 'TESTE' } = {}) => {
    const dados = {};
    if (tipoJornada) {
        dados.tipoJornada = `${prefixo}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }
    return cy.wrap(dados);
});

// PREENCHER FORMULÁRIO
Cypress.Commands.add('preencherFormularioJornada', (dados) => {
    cy.getJornadaFrame().then(($frame) => {
        cy.wrap($frame).find(jornadaElements.TipoAtividade).should('have.length', 1).select(1);
        cy.wrap($frame).find(jornadaElements.TipoJornada).should('have.length', 1).clear().type(dados.tipoJornada);
    });
});

// SALVAR JORNADA
Cypress.Commands.add('salvarJornada', () => {
    cy.getJornadaFrame().then(($frame) => {
        const criar = $frame.find('button:contains("Criar")');
        const editar = $frame.find('button:contains("Aplicar Alterações")');
        if (criar.length) {
            cy.wrap(criar).click();
        } else if (editar.length) {
            cy.wrap(editar).click();
        } else {
            throw new Error('Botão salvar jornada não encontrado');
        }
    });
});

// CRIAR JORNADA
Cypress.Commands.add('createJornada', (title = 'Criar - Tipo de Jornada') => {
    cy.contains('button.t-Button', 'Criar').should('be.visible').click();
    cy.contains('.ui-dialog-title', title).should('be.visible');

    cy.gerarDadosJornada({ tipoJornada: true, prefixo: 'TP' }).then((dados) => {
        cy.preencherFormularioJornada(dados);
        cy.printPasso('01-criar-dados-preenchidos');
        cy.salvarJornada();
        cy.printPasso('02-criar-salvo');
    });
});

// EDITAR JORNADA
Cypress.Commands.add('editarJornada', () => {
    cy.get('span[role="img"][aria-label="Edit"].fa.fa-edit').last().should('be.visible').click();
    cy.getJornadaFrame().then(($frame) => {
        cy.wrap($frame).find(jornadaElements.TipoJornada).should('have.length', 1).clear().type('editado');

        cy.printPasso('03-editar-dados-alterados');

        cy.wrap($frame).find('button').contains('Aplicar Alterações').should('exist').click();

        cy.printPasso('04-editar-alteracao-salva');
    });
});

// EXCLUIR JORNADA
Cypress.Commands.add('excluirJornada', () => {
    cy.get('span[role="img"][aria-label="Edit"].fa.fa-edit').last().should('be.visible').click();
    cy.wait(2000);

    cy.printPasso('05-excluir-selecionado');
    cy.get('iframe', { timeout: 20000 }).should('exist').then(($iframes) => {
        let encontrou = false;
        for (let i = 0; i < $iframes.length; i++) {
            const body = $iframes[i].contentDocument?.body;
            if (!body) continue;

            const botaoDelete = body.querySelector('button[data-otel-label="DELETE"]');
            if (botaoDelete) {
                encontrou = true;
                cy.wrap(body).find('button[data-otel-label="DELETE"]')
                    .should('be.visible').should('not.be.disabled')
                    .click();
                break;
            }
        }
        if (!encontrou) throw new Error('Botão DELETE não apareceu.');
    });

    cy.get('button.js-confirmBtn', { timeout: 20000 }).should('be.visible').contains('Deletar');
    cy.get('button.js-confirmBtn').click();

    cy.printPasso('06-exclusao-concluida');
});

// ==================== utilsmatrizicp.js ====================
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

// PREENCHER NOME - MODELO NOVO
Cypress.Commands.add('preencherNomeMatrizIcpIdadeNovo', (nome) => {
    cy.getMatrizIcpIdadeFrame()
        .find('#P51_NOME_MATRIZ_ICP_IDADE')
        .should('be.visible')
        .clear()
        .type(nome, { delay: 50 });
});

// PREENCHER NOME - MODELO EXISTENTE
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

// SELECIONAR MODELO EXISTENTE
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

// PREENCHER MATRIZ
Cypress.Commands.add('preencherValoresMatrizIcpIdade', () => {
    const matriz = [
        ['9', '2', '3', '4'],
        ['6', '7', '8', '9'],
        ['11', '12', '13', '14'],
        ['16', '17', '18', '19'],
        ['21', '22', '23', '24']
    ];

    cy.log('Aguardando a Grid da Matriz carregar após a mudança de tela...');

    cy.get('iframe', { timeout: 30000 }).should(($iframes) => {
        const encontrado = [...$iframes].some((iframe) => {
            try {
                const doc = iframe.contentDocument;
                return doc &&
                    doc.querySelector('tr.a-GV-row[data-rownum="1"]');
            } catch (e) {
                return false;
            }
        });

        expect(
            encontrado,
            'Grid da Matriz carregada no iframe'
        ).to.be.true;
    });

    cy.wait(600);

    matriz.forEach((linha, linhaIndex) => {
        const rowNum = linhaIndex + 1;

        linha.forEach((valor, colunaIndex) => {
            const coluna = colunaIndex + 3;

            // Abrir edição da célula
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

            // Preencher valor da célula
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

// CONFIRMAR FINALIZAÇÃO
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

// SELECIONAR TODOS - MATRIZ ICP IDADE
Cypress.Commands.add('selecionarTodosMatrizIcpIdade', () => {
    cy.log('Aguardando a etapa seguinte da Matriz ICP Idade...');

    const seletorLinha = 'tr.a-GV-row[data-rownum="1"]';
    const seletorFinish = 'button[data-otel-label="FINISH"]';

    const seletorCheckbox = [
        '[aria-label="Select All Rows"]',
        '.a-GV-headerCheckbox',
        'th.a-GV-header--selection input',
        'th.a-GV-header--selection',
        '.a-GV-header--selection [role="checkbox"]',
        '.a-GV-header--selection input[type="checkbox"]'
    ].join(', ');

    // Procura em todos os iframes, inclusive aninhados.
    const obterDocumentos = (iframes) => {
        const documentos = [];
        const visitados = new Set();

        const percorrer = (doc) => {
            if (!doc || visitados.has(doc)) return;

            visitados.add(doc);
            documentos.push(doc);

            Array.from(doc.querySelectorAll('iframe')).forEach((iframe) => {
                try {
                    percorrer(iframe.contentDocument);
                } catch (e) {
                    // Ignora iframes que não podem ser acessados.
                }
            });
        };

        Array.from(iframes).forEach((iframe) => {
            try {
                percorrer(iframe.contentDocument);
            } catch (e) {
                // Ignora iframes que não podem ser acessados.
            }
        });

        return documentos;
    };

    // Aguarda a grade ou o botão FINISH aparecer.
    cy.get('iframe', { timeout: 30000 })
        .should(($iframes) => {
            const documentos = obterDocumentos($iframes);

            const gradeEncontrada = documentos.some((doc) =>
                doc.querySelector(seletorLinha)
            );

            const finalizarEncontrado = documentos.some((doc) =>
                doc.querySelector(seletorFinish)
            );

            expect(
                gradeEncontrada || finalizarEncontrado,
                'Grade da Matriz ou botão FINISH carregado após NEXT'
            ).to.be.true;
        })
        .then(($iframes) => {
            const documentos = obterDocumentos($iframes);

            const documentoGrade = documentos.find((doc) =>
                doc.querySelector(seletorLinha)
            );

            // Se a etapa já chegou ao FINISH e não existe grade,
            // não tenta clicar num checkbox inexistente.
            if (!documentoGrade) {
                cy.log(
                    'A etapa não possui grade de seleção; seguindo para FINISH.'
                );
                return;
            }

            const linha = documentoGrade.querySelector(seletorLinha);

            const grade =
                linha.closest('.a-GV') ||
                linha.closest('table') ||
                documentoGrade;

            const checkbox = grade.querySelector(seletorCheckbox);

            if (!checkbox) {
                cy.log(
                    'A grade não apresenta checkbox Select All; continuando o fluxo.'
                );
                return;
            }

            cy.wrap(checkbox).click({ force: true });

            cy.log('Checkbox Select All da Matriz ICP Idade clicado.');
        });

    cy.wait(300);
});

// ==================== utilsnivelIcp.js ====================
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

    cy.wait(500);
    cy.printPasso('nivel-icp-tabela-preenchida');
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
    cy.printPasso('nivel-icp-salvo');
});
// EDITAR MAIS RECENTE
Cypress.Commands.add('editarUltimoNivelIcp', () => {
    const valor = Cypress._.random(1, 9);
    cy.log(`Editando Nível ICP com valor: ${valor}`);
    cy.get('a[aria-roledescription="dialog link"]')
        .last()
        .should('be.visible')
        .click({ force: true });
    cy.wait(1500);
    cy.getNivelIcpFrame().then(($frame) => {
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
    cy.printPasso('nivel-icp-dados-alterados');

    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .then(cy.wrap)
        .find('button[data-action="save"]')
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('nivel-icp-edicao-salva');

    cy.get('button.ui-dialog-titlebar-close, button[title="Close"]')
        .last()
        .should('be.visible')
        .click({ force: true });
    cy.wait(1000);
});

// ==================== utilsnivelidade.js ====================
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
            cy.printPasso('nivel-idade-tabela-preenchida');
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
    cy.printPasso('nivel-idade-salvo');
});

// EDITAR ÚLTIMO NÍVEL IDADE
Cypress.Commands.add('editarUltimoNivelIdade', () => {
    const valorPrimeiraLinha = Cypress._.random(16, 99);
    const valorSegundaLinha = valorPrimeiraLinha - 1;

    cy.log(`Editando Nível Idade - Linha 1: ${valorPrimeiraLinha}, Linha 2: ${valorSegundaLinha}`);

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

    cy.getNivelIdadeFrame().then(($frame) => {
        // --- EDITANDO A PRIMEIRA LINHA ---
        const $celulaMinL1 = cy.wrap($frame)
            .find('tr.a-GV-row[data-rownum="1"]')
            .find('td.a-GV-cell')
            .eq(3)
            .should('exist');

        $celulaMinL1.dblclick({ force: true });

        cy.wrap($frame)
            .find('tr.a-GV-row[data-rownum="1"]')
            .find('td.a-GV-cell')
            .eq(3)
            .find('input, textarea', { timeout: 10000 })
            .should('be.visible')
            .first()
            .clear({ force: true })
            .type(valorPrimeiraLinha, { delay: 30 });

        cy.wrap($frame)
            .find('tr.a-GV-row[data-rownum="1"]')
            .find('td.a-GV-cell')
            .eq(3)
            .type('{enter}', { force: true });

        cy.wait(500);

        // --- EDITANDO A SEGUNDA LINHA ---
        const $celulaMinL2 = cy.wrap($frame)
            .find('tr.a-GV-row[data-rownum="2"]')
            .find('td.a-GV-cell')
            .eq(4)
            .should('exist');

        $celulaMinL2.click({ force: true });

        cy.wrap($frame)
            .find('tr.a-GV-row[data-rownum="2"]')
            .find('td.a-GV-cell')
            .eq(4)
            .find('input, textarea', { timeout: 10000 })
            .should('be.visible')
            .first()
            .clear({ force: true })
            .type(valorSegundaLinha, { delay: 30 });

        cy.wrap($frame)
            .find('tr.a-GV-row[data-rownum="2"]')
            .find('td.a-GV-cell')
            .eq(4)
            .type('{enter}', { force: true });
    });

    cy.wait(1000);
    cy.printPasso('nivel-idade-dados-alterados');

    // CLICAR EM SALVAR
    cy.get('iframe', { timeout: 30000 })
        .its('0.contentDocument.body')
        .then(cy.wrap)
        .find('button[data-action="save"]')
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    // CONFIRMAR POPUP DO APEX CASO APAREÇA ("There are unsaved changes / OK")
    cy.get('body').then(($body) => {
        const btnConfirm = $body.find('button.js-confirmBtn, .ui-dialog-buttonpane button, button:contains("OK")');
        if (btnConfirm.length > 0) {
            cy.wrap(btnConfirm)
                .filter(':visible')
                .first()
                .click({ force: true });
        }
    });

    cy.wait(1500);
    cy.printPasso('nivel-idade-edicao-salva');

    // FECHAR A JANELA MODAL
    cy.get('button.ui-dialog-titlebar-close, button[title="Close"]')
        .last()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1000);
});

// ==================== utilsnivelvdm.js ====================
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

// ==================== utilssubciclo.js ====================
// FRAME DO MODAL
Cypress.Commands.add('getSubcicloFrame', () => {
    cy.log('Obtendo iframe do modal de Subciclos...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL CORRIGIDA PARA SUBCICLO
Cypress.Commands.add('acessarSubciclo', () => {
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

    cy.log('Clicando em Subciclo...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Subciclo')
        .should('exist')
        .click({ force: true });

    cy.url().should('include', 'subciclo');
});

// GERAR DADOS SUBCICLO
Cypress.Commands.add('gerarDadosSubciclo', ({
    prefixo = 'SUBCICLO',
    dataInicio = '01/01/2026',
    dataFim = '31/12/2026'
} = {}) => {
    const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
    const dados = {
        nome: `${prefixo}_${hash}`,
        descricao: `Descrição ${prefixo} ${hash}`,
        dataInicio,
        dataFim
    };
    cy.log(JSON.stringify(dados));
    return cy.wrap(dados);
});

// PREENCHER FORMULÁRIO SUBCICLO (UTILIZANDO API NATIVA DO APEX PARA LOV)
Cypress.Commands.add('preencherFormularioSubciclo', (dados) => {
    cy.getSubcicloFrame().then(($frame) => {
        // Atribuição direta via API JS do APEX
        if (dados.selecionarCiclo !== false) {
            cy.log('Selecionando o item de Ciclo via API APEX...');
            const win = $frame[0].ownerDocument.defaultView;
            const valorCiclo = dados.cicloId || '1';

            win.apex.item('P43_CD_CAMPO_CICLO').setValue(valorCiclo);
            cy.wrap($frame).find('#P43_CD_CAMPO_CICLO').trigger('change');
        }

        // Preencher Nome
        if (dados.nome) {
            cy.log(`Preenchendo Nome: ${dados.nome}`);
            cy.wrap($frame)
                .find('#P43_NM_SUBCICLO')
                .clear({ force: true })
                .type(dados.nome, { delay: 30 });
        }

        // Preencher Descrição
        if (dados.descricao) {
            cy.log(`Preenchendo Descrição: ${dados.descricao}`);
            cy.wrap($frame)
                .find('#P43_DS_SUBCICLO')
                .clear({ force: true })
                .type(dados.descricao, { delay: 30 });
        }

        // Preencher Data Início
        if (dados.dataInicio) {
            cy.log(`Preenchendo Data Início: ${dados.dataInicio}`);
            cy.wrap($frame)
                .find('#P43_DT_INICIO_input')
                .clear({ force: true })
                .type(dados.dataInicio, { delay: 30 });
        }

        // Preencher Data Fim
        if (dados.dataFim) {
            cy.log(`Preenchendo Data Fim: ${dados.dataFim}`);
            cy.wrap($frame)
                .find('#P43_DT_FIM_input')
                .clear({ force: true })
                .type(dados.dataFim, { delay: 30 });
        }
    });
});

// ABRIR E CRIAR SUBCICLO
Cypress.Commands.add('criarSubciclo', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    return cy.gerarDadosSubciclo().then((dados) => {
        dados.selecionarCiclo = true;
        cy.preencherFormularioSubciclo(dados);
        cy.printPasso('subciclo-dados-preenchidos');

        cy.getSubcicloFrame().then(($frame) => {
            cy.wrap($frame)
                .find('button[data-otel-label="CREATE"], #B6555546556198462')
                .should('be.visible')
                .click({ force: true });
        });

        cy.wait(2000);
        cy.printPasso('subciclo-salvo-com-sucesso');
        return cy.wrap(dados);
    });
});

// EDITAR ÚLTIMO SUBCICLO (BUSCA O REGISTRO 'SUBCICLO_')
Cypress.Commands.add('editarUltimoSubciclo', (descricao) => {
    cy.log('Abrindo edição do registro...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        cy.contains('tr', 'SUBCICLO_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    const novaDescricao = `SUBCICLO_EDITADO_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    cy.preencherFormularioSubciclo({
        selecionarCiclo: false,
        descricao: novaDescricao
    });

    cy.printPasso('subciclo-dados-alterados');

    cy.getSubcicloFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"], button:contains("Aplicar Alterações"), button:contains("Salvar")')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('subciclo-edicao-salva');
});

// EXCLUIR ÚLTIMO SUBCICLO (BUSCA O REGISTRO 'SUBCICLO_')
Cypress.Commands.add('deletarUltimoSubciclo', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        cy.contains('tr', 'SUBCICLO_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    cy.getSubcicloFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"], #B6554771603198461')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('subciclo-confirmar-exclusao');

    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('subciclo-excluido-com-sucesso');
});

// ==================== utilstipoinventario.js ====================
// FRAME DO MODAL DE TIPO DO INVENTÁRIO
Cypress.Commands.add('getTipoInventarioFrame', () => {
    cy.log('Obtendo iframe do modal de Tipo do Inventário...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL PARA TIPO DO INVENTÁRIO
Cypress.Commands.add('acessarTipoInventario', () => {
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

    cy.log('Clicando em Tipo do Inventário...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Tipo do Inventário')
        .should('exist')
        .click({ force: true });

    // Tratado para evitar quebra por caracteres especiais na URL (ex: 'ç', 'á')
    cy.url().should('include', 'tipo-do-inven');

    cy.get('.a-IRR-table, table', { timeout: 15000 }).should('be.visible');
    cy.wait(500);
});

// CRIAR TIPO DO INVENTÁRIO
Cypress.Commands.add('criarTipoInventario', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const descricaoRandom = `INV_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    cy.getTipoInventarioFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P109_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });

        cy.printPasso('tipo-inventario-dados-preenchidos');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"], #B10938271074570816')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-inventario-salvo-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom });
});

// EDITAR TIPO DO INVENTÁRIO
Cypress.Commands.add('editarUltimoTipoInventario', (descricao) => {
    cy.log('Abrindo edição do registro...');

    const termoBusca = descricao || 'INV_';

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${termoBusca}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.getTipoInventarioFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P109_DESCRICAO')
            .should('be.visible')
            .then(($input) => {
                const valorAtual = $input.val();
                cy.wrap($input)
                    .clear({ force: true })
                    .type(`${valorAtual}_EDITADO`, { delay: 30 });
            });

        cy.printPasso('tipo-inventario-dados-alterados');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-inventario-edicao-salva');
});

// DELETAR TIPO DO INVENTÁRIO
Cypress.Commands.add('deletarUltimoTipoInventario', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    const termoBusca = descricao || 'INV_';

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${termoBusca}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.getTipoInventarioFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"]')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('tipo-inventario-confirmar-exclusao');

    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('tipo-inventario-excluido-com-sucesso');
});

// ==================== utilstiposativo.js ====================
// FRAME DO MODAL
Cypress.Commands.add('getTiposAtivoFrame', () => {
    cy.log('Obtendo iframe do modal de Tipos de Ativo...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL CORRIGIDA PARA TIPOS DE ATIVO
Cypress.Commands.add('acessarTiposAtivo', () => {
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

    cy.log('Clicando em Tipos de Ativo...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Tipos de Ativo')
        .should('exist')
        .click({ force: true });

    cy.url().should('include', 'tipo');
});

// CRIAR TIPO DE ATIVO
Cypress.Commands.add('criarTipoAtivo', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const descricaoRandom = `ATIVO_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    cy.getTiposAtivoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P101_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });

        cy.printPasso('tipo-ativo-dados-preenchidos');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"], #B10207853400457142')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-ativo-salvo-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom });
});

// EDITAR TIPO DE ATIVO (RECEBE DESCRIÇÃO OU BUSCA REGISTRO DE TESTE 'ATIVO_')
Cypress.Commands.add('editarUltimoTipoAtivo', (descricao) => {
    cy.log('Abrindo edição do registro...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        // Localiza a linha da tabela que possui o prefixo de teste 'ATIVO_'
        cy.contains('tr', 'ATIVO_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    cy.getTiposAtivoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P101_DESCRICAO')
            .then(($input) => {
                const valorAtual = $input.val();
                cy.wrap($input)
                    .clear({ force: true })
                    .type(`${valorAtual}_EDITADO`, { delay: 30 });
            });

        cy.printPasso('tipo-ativo-dados-alterados');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"], #B10207496122457142')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-ativo-edicao-salva');
});

// DELETAR TIPO DE ATIVO (RECEBE DESCRIÇÃO OU BUSCA REGISTRO DE TESTE)
Cypress.Commands.add('deletarUltimoTipoAtivo', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        // Filtra pela linha que contém 'ATIVO_' ou '_EDITADO'
        cy.contains('tr', 'ATIVO_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    cy.getTiposAtivoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"], #B10207080746457142')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('tipo-ativo-confirmar-exclusao');

    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('tipo-ativo-excluido-com-sucesso');
});

// ==================== utilstiposcondicao.js ====================
// FRAME DO MODAL DE TIPOS DE CONDIÇÃO
Cypress.Commands.add('getTiposCondicaoFrame', () => {
    cy.log('Obtendo iframe do modal de Tipos de Condição...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL PARA TIPOS DE CONDIÇÃO
Cypress.Commands.add('acessarTiposCondicao', () => {
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

    cy.log('Clicando em Tipos de Condição...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Tipos de Condição')
        .should('exist')
        .click({ force: true });
    // Ajustado para aceitar a URL codificada sem quebrar por causa do 'ç' e 'ã'
    cy.url().should('include', 'tipos-de-condi');

    cy.get('.a-IRR-table, table', { timeout: 15000 }).should('be.visible');
    cy.wait(500);
});

// CRIAR TIPO DE CONDIÇÃO
Cypress.Commands.add('criarTipoCondicao', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const descricaoRandom = `COND_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    cy.getTiposCondicaoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P103_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });

        cy.printPasso('tipo-condicao-dados-preenchidos');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"], #B10288759149581920')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-condicao-salvo-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom });
});

// EDITAR TIPO DE CONDIÇÃO
Cypress.Commands.add('editarUltimoTipoCondicao', (descricao) => {
    cy.log('Abrindo edição do registro...');
    const termoBusca = descricao || 'COND_';
    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);
    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${termoBusca}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.getTiposCondicaoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P103_DESCRICAO')
            .should('be.visible')
            .then(($input) => {
                const valorAtual = $input.val();
                cy.wrap($input)
                    .clear({ force: true })
                    .type(`${valorAtual}_EDITADO`, { delay: 30 });
            });
        cy.printPasso('tipo-condicao-dados-alterados');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"], #B10288303209581920')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-condicao-edicao-salva');
});

// DELETAR TIPO DE CONDIÇÃO
Cypress.Commands.add('deletarUltimoTipoCondicao', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    const termoBusca = descricao || 'COND_';

    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);

    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${termoBusca}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });

    cy.wait(1500);

    cy.getTiposCondicaoFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"], #B10287965795581920')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('tipo-condicao-confirmar-exclusao');

    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('tipo-condicao-excluido-com-sucesso');
});

// ==================== utilstiposmaterial.js ====================
// FRAME DO MODAL DE TIPOS DE MATERIAL
Cypress.Commands.add('getTiposMaterialFrame', () => {
    cy.log('Obtendo iframe do modal de Tipos de Material...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});

// NAVEGAÇÃO MULTI-NÍVEL PARA TIPOS DE MATERIAL
Cypress.Commands.add('acessarTiposMaterial', () => {
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

    cy.log('Clicando em Tipos de Material...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Tipos de Material')
        .should('exist')
        .click({ force: true });

    cy.url().should('include', 'tipo');
});

// CRIAR TIPO DE MATERIAL
Cypress.Commands.add('criarTipoMaterial', () => {
    cy.log('Abrindo modal de criação...');

    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();

    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');

    const descricaoRandom = `MATERIAL_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    cy.getTiposMaterialFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P105_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });

        cy.printPasso('tipo-material-dados-preenchidos');

        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"], #B10313275096906010')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-material-salvo-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom });
});

// EDITAR TIPO DE MATERIAL (BUSCA O REGISTRO 'MATERIAL_')
Cypress.Commands.add('editarUltimoTipoMaterial', (descricao) => {
    cy.log('Abrindo edição do registro...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        cy.contains('tr', 'MATERIAL_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    cy.getTiposMaterialFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P105_DESCRICAO')
            .then(($input) => {
                const valorAtual = $input.val();
                cy.wrap($input)
                    .clear({ force: true })
                    .type(`${valorAtual}_EDITADO`, { delay: 30 });
            });

        cy.printPasso('tipo-material-dados-alterados');

        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"], #B10312873679906010')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(2000);
    cy.printPasso('tipo-material-edicao-salva');
});

// DELETAR TIPO DE MATERIAL (BUSCA O REGISTRO 'MATERIAL_')
Cypress.Commands.add('deletarUltimoTipoMaterial', (descricao) => {
    cy.log('Abrindo registro para exclusão...');

    if (descricao) {
        cy.contains('tr', descricao)
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    } else {
        cy.contains('tr', 'MATERIAL_')
            .last()
            .find('a[aria-roledescription="dialog link"], span.fa-edit, .fa-edit, a')
            .first()
            .click({ force: true });
    }

    cy.wait(1500);

    cy.getTiposMaterialFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"], #B10312463902906010')
            .should('be.visible')
            .click({ force: true });
    });

    cy.wait(1000);
    cy.printPasso('tipo-material-confirmar-exclusao');

    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });

    cy.wait(2000);
    cy.printPasso('tipo-material-excluido-com-sucesso');
});

// ==================== UNIDADES DE MEDIDA ====================
// FRAME DO MODAL DE UNIDADES DE MEDIDA
Cypress.Commands.add('getUnidadesMedidaFrame', () => {
    cy.log('Obtendo iframe do modal de Unidades de Medida...');
    return cy.get('iframe', { timeout: 15000 })
        .should('exist')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(cy.wrap);
});
// NAVEGAÇÃO
Cypress.Commands.add('acessarUnidadesMedida', () => {
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
    cy.log('Clicando em Unidades de Medida...');
    cy.contains('.a-Menu-label, .a-Menu-link, a', 'Unidades de Medida')
        .should('exist')
        .click({ force: true });
    cy.url().should('include', 'unidades-de-medida');
    // Garante que a tabela da página carregou completamente antes de prosseguir
    cy.get('.a-IRR-table, table', { timeout: 15000 }).should('be.visible');
    cy.wait(500);
});
// CRIAR
Cypress.Commands.add('criarUnidadeMedida', () => {
    cy.log('Abrindo modal de criação...');
    cy.get('button[data-otel-label="CREATE"]', { timeout: 15000 })
        .should('be.visible')
        .focus()
        .click();
    cy.get('.ui-dialog, iframe', { timeout: 15000 }).should('be.visible');
    const descricaoRandom = `UM_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const siglaRandom = `U${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    cy.getUnidadesMedidaFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P107_DESCRICAO')
            .should('be.visible')
            .clear({ force: true })
            .type(descricaoRandom, { delay: 30 });
        cy.wrap($frame)
            .find('#P107_SIGLA')
            .should('be.visible')
            .clear({ force: true })
            .type(siglaRandom, { delay: 30 });
        cy.printPasso('unidade-medida-dados-preenchidos');
        cy.wrap($frame)
            .find('button[data-otel-label="CREATE"], #B10331630203031980')
            .should('be.visible')
            .click({ force: true });
    });
    cy.wait(2000);
    cy.printPasso('unidade-medida-salva-com-sucesso');
    return cy.wrap({ descricao: descricaoRandom, sigla: siglaRandom });
});
// EDITAR
Cypress.Commands.add('editarUltimaUnidadeMedida', (descricao) => {
    cy.log('Abrindo edição do registro...');
    const termoBusca = descricao || 'UM_';
    // Aguarda a tabela sumir
    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);
    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${termoBusca}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });
    cy.wait(1500);
    cy.getUnidadesMedidaFrame().then(($frame) => {
        cy.wrap($frame)
            .find('#P107_DESCRICAO')
            .should('be.visible')
            .then(($input) => {
                const valorAtual = $input.val();
                cy.wrap($input)
                    .clear({ force: true })
                    .type(`${valorAtual}_EDITADO`, { delay: 30 });
            });
        cy.printPasso('unidade-medida-dados-alterados');
        cy.wrap($frame)
            .find('button[data-otel-label="SAVE"], #B10331292220031980')
            .should('be.visible')
            .click({ force: true });
    });
    cy.wait(2000);
    cy.printPasso('unidade-medida-edicao-salva');
});
// DELETAR
Cypress.Commands.add('deletarUltimaUnidadeMedida', (descricao) => {
    cy.log('Abrindo registro para exclusão...');
    const termoBusca = descricao || 'UM_';
    cy.get('.a-IRR-container').should('not.have.class', 'is-loading');
    cy.wait(1000);
    cy.get('tbody tr', { timeout: 15000 })
        .filter(`:contains("${termoBusca}")`)
        .last()
        .scrollIntoView()
        .find('span.fa-edit, span[aria-label="Edit"]')
        .parents('a')
        .first()
        .should('be.visible')
        .click({ force: true });
    cy.wait(1500);
    cy.getUnidadesMedidaFrame().then(($frame) => {
        cy.wrap($frame)
            .find('button[data-otel-label="DELETE"], #B10330870935031980')
            .should('be.visible')
            .click({ force: true });
    });
    cy.wait(1000);
    cy.printPasso('unidade-medida-confirmar-exclusao');
    cy.log('Confirmando exclusão no modal...');
    cy.get('button.js-confirmBtn, button.ui-button--danger', { timeout: 10000 })
        .should('be.visible')
        .click({ force: true });
    cy.wait(2000);
    cy.printPasso('unidade-medida-excluida-com-sucesso');
});