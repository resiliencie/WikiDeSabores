# Wiki Sabores Sorocaba

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Wiki Sabores Sorocaba** é um guia gastronômico digital, interativo e totalmente responsivo, construído como uma Single Page Application (SPA) para explorar os melhores restaurantes, bares e cafés da cidade de Sorocaba. O projeto foi desenvolvido com HTML, CSS e JavaScript puros (vanilla), focando em uma experiência de usuário rica, manipulação eficiente do DOM e funcionalidades dinâmicas salvas localmente.

---

## 📄 Índice

- [📍 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades Principais](#-funcionalidades-principais)
- [🚀 Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [⚙️ Como Executar o Projeto](#️-como-executar-o-projeto)
- [📁 Estrutura de Arquivos](#-estrutura-de-arquivos)
- [🛠️ Como Adicionar Novos Locais](#️-como-adicionar-novos-locais)
- [💡 Análise da Arquitetura do Código](#-análise-da-arquitetura-do-código)
- [⚖️ Licença](#️-licença)

---

## 📍 Sobre o Projeto

O objetivo do **Wiki Sabores Sorocaba** é oferecer uma interface amigável e visualmente agradável para que os usuários possam descobrir e salvar seus locais gastronômicos preferidos. A página centraliza informações úteis como especialidades e horários de funcionamento, além de permitir interações avançadas que aprimoram a experiência de descoberta, tudo isso salvo diretamente no navegador do usuário, sem a necessidade de um backend.

---

## ✨ Funcionalidades Principais

O site oferece uma experiência de usuário moderna e completa, com as seguintes funcionalidades:

-   **🌗 Modo Escuro e Claro:** Botão de alternância de tema com a preferência do usuário salva no `localStorage` para persistir entre as visitas.
-   **❤️ Sistema de Favoritos Persistente:** Os usuários podem marcar seus locais preferidos. A seleção é salva e a seção "Meus Favoritos" é atualizada em tempo real, com opções para **ordenar por ordem alfabética** e **limpar todos** de uma vez.
-   **✨ Botão "Surpreenda-me!":** Uma função que escolhe aleatoriamente um estabelecimento (respeitando os filtros ativos) e o destaca na tela, ideal para usuários indecisos.
-   **⏰ Status de Funcionamento em Tempo Real:** Cada card exibe o status ("Aberto", "Fechado") e um aviso de **"Fecha em Breve"** (na última hora de funcionamento), calculado com base no horário local do usuário e atualizado a cada minuto.
-   **🔍 Filtros e Busca Combinados:** Permite filtrar os locais por categorias (Bares, Pizzarias, etc.) e refinar a busca por texto simultaneamente. A pesquisa busca no nome, descrição e especialidades.
-   **📄 Modal de Detalhes com Ações:** Clicar para "Ver Detalhes" abre uma janela modal com mais informações, incluindo botões para **copiar endereço e telefone** para a área de transferência.
-   **🚀 Lazy Loading de Imagens e Animações:** Os cards só são carregados e animados (efeito *fade-in*) quando aparecem na tela durante a rolagem, otimizando o desempenho e o tempo de carregamento inicial da página.
-   **📱 Design Totalmente Responsivo:** A interface se adapta perfeitamente a desktops, tablets e dispositivos móveis.
-   **⭐ Sistema de Avaliação Interativo:** Permite que os visitantes avaliem o site com estrelas. A média e o total de votos são salvos e exibidos.
-   **💨 Navegação Otimizada:** Cabeçalho dinâmico que encolhe com a rolagem, links com scroll suave para as seções e um botão "Voltar ao Topo".

---

## 🚀 Tecnologias Utilizadas

-   **HTML5:** Para a estruturação semântica do conteúdo, com uso de atributos de acessibilidade (`aria-*`).
-   **CSS3:** Para estilização, layout (Flexbox e Grid), animações, responsividade e a implementação do Modo Escuro através de variáveis CSS.
-   **JavaScript (ES6+):** Para toda a interatividade e manipulação do DOM. O código é organizado de forma modular em um único objeto (`App`).
-   **API do Navegador:**
    -   `localStorage`: Para persistir os favoritos, as avaliações e a preferência de tema.
    -   `Intersection Observer API`: Para o lazy loading dos cards.
    -   `Clipboard API`: Para a funcionalidade de "Copiar".

---

## ⚙️ Como Executar o Projeto

Este é um projeto estático (frontend puro) e não requer um servidor complexo.

1.  **Clone o repositório ou baixe os arquivos:** `index.html`, `style.css` e `script.js`.
2.  **Mantenha a estrutura:** Certifique-se de que a pasta `imagens/` está no mesmo diretório que o `index.html`.
3.  **Abra o arquivo `index.html`:** Você pode abrir o arquivo diretamente no seu navegador. Para uma melhor experiência de desenvolvimento, utilize a extensão **Live Server** no Visual Studio Code.

---

## 📁 Estrutura de Arquivos

```
.
├── 📄 index.html      # Arquivo principal com toda a estrutura da página
├── 🎨 style.css       # Folha de estilos principal
├── ⚙️ script.js       # Arquivo com todo o código JavaScript
└── 🖼️ imagens/        # Pasta para armazenar todas as imagens
    ├── logo.png
    ├── padariareal.jpg
    └── ... (outras imagens de restaurantes e bares)
```

---

## 🛠️ Como Adicionar Novos Locais

Para adicionar um novo restaurante ou bar, basta editar o arquivo `index.html`:

1.  Navegue até a seção apropriada (`<section id="melhores">` ou `<section id="bares">`).
2.  Dentro do `div.card-container`, copie e cole o bloco de um `<article class="card">` existente.
3.  Altere as informações do novo card:
    -   **`id` do `<h3>`:** **ESSENCIAL!** Dê um `id` único para o título `<h3>` (ex: `id="novo-restaurante"`).
    -   **`data-abre` e `data-fecha`:** Defina os horários de funcionamento no formato "HH:MM".
    -   **`data-address` e `data-phone`:** Adicione o endereço e telefone para o modal de detalhes (se aplicável).
    -   **Imagem:** Altere o caminho em `<img src="...">`.
    -   **Conteúdo:** Atualize o nome, descrição, especialidades e o link.
    -   **Categorias:** Certifique-se de que as palavras-chave na descrição ou especialidades correspondam aos botões de filtro (ex: "pizzaria", "bar", "hambúrguer").

---

## 💡 Análise da Arquitetura do Código

Todo o código JavaScript está encapsulado dentro de um único objeto literal chamado `App`. Esta abordagem modular organiza o código em "módulos" responsáveis por cada funcionalidade, evitando poluir o escopo global e facilitando a manutenção.

-   **`App.state`:** Um objeto central que guarda o estado da aplicação (lista de favoritos, tema atual, etc.).
-   **`App.init()`:** O ponto de entrada que inicializa a aplicação, carrega o estado salvo e configura todos os *event listeners*.
-   **`App.loadState()` e `App.saveState()`:** Funções que gerenciam a comunicação com o `localStorage`.
-   **Módulos (`App.favorites`, `App.theme`, `App.modal`, etc.):** Cada objeto interno é responsável por uma funcionalidade específica. Por exemplo, `App.theme` contém os métodos `toggle()` e `apply()` para gerenciar o modo escuro, enquanto `App.favorites` controla toda a lógica de favoritar, renderizar e ordenar. Essa separação de responsabilidades torna o código mais limpo e escalável.

---

## ⚖️ Licença

Este projeto é de código aberto e pode ser usado livremente. Distribuído sob a Licença MIT.
