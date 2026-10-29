# Regente Automação

## Objetivo

Apoiar a execução de testes automatizados para validar funcionalidades da aplicação Regente, reduzir o esforço de testes repetitivos e facilitar a identificação de regressões.

## Tecnologias

- **JavaScript**
- **Cypress** — automação de testes end-to-end
- **Node.js e npm** — execução e gerenciamento de dependências

## Estrutura conhecida

```text
regente_automacao/
└── cypress/
    └── support/
        └── Utils.js
```

O arquivo `Utils.js` reúne utilitários do projeto. A estrutura completa pode incluir arquivos de especificação (`cypress/e2e/`), comandos personalizados, configurações do Cypress e relatórios, mas esses itens não estavam presentes no ZIP analisado.

## Pré-requisitos

Para executar o projeto completo, normalmente são necessários:

- Node.js em uma versão compatível com a versão do Cypress usada pelo projeto;
- npm;
- acesso ao ambiente da aplicação Regente;
- credenciais de teste, caso a aplicação exija autenticação.

## Instalação

Na pasta raiz do projeto completo, execute:

```bash
npm install
```

> O arquivo `package.json` não estava incluído no ZIP enviado. Portanto, confirme as dependências e os scripts disponíveis antes de executar os comandos abaixo.

## Execução dos testes

Se os scripts estiverem configurados conforme o padrão anteriormente utilizado no projeto:

Abrir o Cypress em modo interativo:

```bash
npm test
```

Executar os testes em modo headless:

```bash
npm run testRun
```

Como alternativa, caso o Cypress esteja instalado no projeto:

```bash
npx cypress open
npx cypress run
```

A execução depende da presença da configuração do Cypress e dos arquivos de teste no projeto completo.

## Relatórios

Se o projeto estiver configurado com Allure, os relatórios podem ser gerados e abertos por meio dos scripts definidos no `package.json`. Em uma configuração que disponibilize esses scripts, os comandos podem ser semelhantes a:

```bash
npm run allure:generate
npm run allure:open
```

Confirme a configuração e os scripts reais antes de utilizar esses comandos.

## Boas práticas

- Mantenha dados de teste e credenciais fora do código-fonte.
- Prefira seletores estáveis e legíveis.
- Reutilize comandos e funções auxiliares quando isso tornar os testes mais claros.
- Evite dependências desnecessárias entre cenários.
- Valide os testes localmente antes de executá-los no pipeline de CI/CD.
- Registre evidências e resultados quando a configuração de relatórios oferecer esse recurso.

## Integração contínua

O projeto pode ser executado em um pipeline, como GitHub Actions, desde que o repositório contenha o `package.json`, o arquivo de configuração do Cypress, os testes e as variáveis necessárias para acessar o ambiente.

As credenciais devem ser configuradas como secrets do pipeline, nunca diretamente no README ou no código.

## Contribuição

1. Crie uma branch para sua alteração.
2. Implemente ou atualize os testes relacionados.
3. Execute os testes localmente.
4. Revise os resultados e as evidências.
5. Abra um Pull Request descrevendo as alterações.

## Status da documentação

Este README é uma versão inicial. Para documentar com precisão os cenários automatizados, a instalação, os relatórios e o pipeline, é necessário incluir no repositório os arquivos de configuração e os testes do projeto.

---
**Projeto:** Regente Automação  
**Área:** QA / Testes Automatizados
