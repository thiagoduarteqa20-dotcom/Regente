Cypress.Commands.add('sessionLogin', () => {
    cy.visit('/')
    cy.get('#P9999_USERNAME').type('tiagoduarte.7@seven.online')
    cy.get('input[placeholder="Senha"]').type('Seven@123')
    cy.contains('button', 'Acessar').click()
})
Cypress.Commands.add('validateRegisterUsers', () => {
    cy.contains('Cadastros').click()
    cy.contains('Usuários').click()
    cy.url().should('include', 'listausuarios')

})

Cypress.Commands.add('printPasso', (nomePasso) => {
    // 1. Aumenta a largura da tela para 2560px (estica a tabela)
    cy.viewport(2560, 1080);

    // 2. Injeta CSS para matar rolagem, ajustar largura E centralizar o modal perfeitamente
    cy.document().then((doc) => {
        const style = doc.createElement('style');
        style.id = 'print-fix-apex';
        style.innerHTML = `
            .ui-dialog {
                max-width: none !important;
                overflow: visible !important;
                left: 25% !important;
                top: 50% !important;
                transform: translate(-50%, -50%) !important;
                position: fixed !important;
                margin: 0 !important;
            }
            .ui-dialog-content, .a-GV-w-scroll {
                max-width: none !important;
                overflow: visible !important;
            }
        `;
        doc.head.appendChild(style);
    });

    // 3. Aguarda o layout renderizar a largura total e o reposicionamento
    cy.wait(400);

    // 4. Tira o print limpo da TELA INTEIRA (viewport grande)
    cy.screenshot(nomePasso, { 
        capture: 'viewport', 
        overwrite: true 
    });

    // 5. Remove o CSS injetado e volta o tamanho padrão da tela para o próximo teste
    cy.document().then((doc) => {
        const style = doc.getElementById('print-fix-apex');
        if (style) style.remove();
    });
    cy.viewport(1920, 1080);
});