```
Entrada - Saida = 8h12  
2 pausas = 20min  
almoco = 1h  
---------------------  
8h12 - 1h20 = 6h52  
  
Incentive Plan = 95% das horas logadas produtivas.  
6h52 * 95% = 6h31  
```
```
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Página Dark Responsiva</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        /* Bloco de CSS */
        :root {
            /* Variáveis Dark Theme */
            --bg-color: #121212;
            --main-bg: #1e1e1e;
            --text-color: #ffffff;
            --text-secondary: #aaaaaa;
            --accent-color: #bb86fc; /* Púrpura, comum em Dark Themes */
            --sidebar-width: 240px;
            --mobile-header-height: 56px;
            --mobile-footer-height: 60px;
        }

        /* Estilos Globais e Reset */
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Roboto', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
        }

        /* Classes de Layout */
        .container {
            display: flex;
            min-height: 100vh;
        }

        /* -------------------------------------- */
        /* ESTILOS MOBILE            */
        /* -------------------------------------- */

        /* HEADER (Mobile Only) */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: var(--mobile-header-height);
            padding: 0 16px;
            background-color: var(--main-bg);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 100;
        }

        .header-logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--accent-color);
        }

        .header-action-btn {
            background: none;
            border: none;
            color: var(--text-color);
            font-size: 1.25rem;
            cursor: pointer;
            padding: 8px;
            text-decoration: none; /* Para o link Home */
        }

        /* FOOTER (Mobile Only) */
        .footer {
            display: flex;
            justify-content: space-around;
            align-items: center;
            height: var(--mobile-footer-height);
            background-color: var(--main-bg);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 100;
        }

        .footer-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 4px;
            color: var(--text-secondary);
            font-size: 0.7rem;
            text-align: center;
            cursor: pointer;
            width: 20%;
        }

        .footer-item i {
            font-size: 1.25rem;
            margin-bottom: 2px;
        }

        .footer-item.active {
            color: var(--text-color);
        }

        /* -------------------------------------- */
        /* ESTILOS WIDESCREEN        */
        /* -------------------------------------- */

        /* SIDEBAR (Widescreen Only) */
        .sidebar {
            width: var(--sidebar-width);
            background-color: var(--main-bg);
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            padding-top: 20px;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 50;
        }

        .sidebar-logo {
            padding: 0 24px 20px 24px;
            font-size: 1.5rem;
            font-weight: bold;
            color: var(--accent-color);
        }

        .sidebar-menu-item {
            display: flex;
            align-items: center;
            padding: 10px 24px;
            text-decoration: none;
            color: var(--text-color);
            transition: background-color 0.2s;
            cursor: pointer;
        }

        .sidebar-menu-item:hover {
            background-color: rgba(255, 255, 255, 0.08);
        }

        .sidebar-menu-item.active {
            background-color: rgba(255, 255, 255, 0.15);
            font-weight: bold;
        }

        .sidebar-menu-item i {
            margin-right: 16px;
            font-size: 1.25rem;
            width: 24px; /* Garante alinhamento */
            text-align: center;
        }


        /* -------------------------------------- */
        /* ESTILOS MAIN CONTENT      */
        /* -------------------------------------- */

        .main-content {
            flex-grow: 1;
            background-color: var(--bg-color);
            padding: var(--mobile-header-height) 20px var(--mobile-footer-height) 20px; /* Padding para mobile */
            overflow-y: auto;
        }

        /* Visibilidade Única */
        .content-section {
            min-height: calc(100vh - var(--mobile-header-height) - var(--mobile-footer-height));
            display: none; /* Por padrão, todas as seções estão ocultas */
            padding-top: 20px;
        }

        .content-section.visible {
            display: block; /* A seção visível */
        }

        .content-section h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            border-bottom: 2px solid var(--accent-color);
            padding-bottom: 8px;
        }

        /* -------------------------------------- */
        /* MEDIA QUERIES             */
        /* -------------------------------------- */

        @media (min-width: 768px) {
            /* Layout Widescreen (Desktop/Tablet) */
            .container {
                padding-left: var(--sidebar-width); /* Espaço para o menu lateral fixo */
            }

            .sidebar {
                display: block;
            }

            .header, .footer {
                display: none; /* Oculta Header e Footer */
            }

            .main-content {
                /* Remove o padding do header/footer mobile e adiciona um padding mais uniforme */
                padding: 20px 40px;
            }

            .content-section {
                /* Altura mínima ajustada para o desktop (sem header/footer) */
                min-height: calc(100vh - 40px);
            }
        }

        @media (max-width: 767px) {
            /* Layout Mobile */
            .sidebar {
                display: none; /* Oculta Sidebar */
            }
        }
    </style>
</head>
<body>

    <div class="container">

        <header class="header">
            <div class="header-logo">DarkPage</div>
            <a href="#home" id="mobile-home-btn" class="header-action-btn" onclick="showSection('home')">
                <i class="fa-solid fa-house"></i>
            </a>
        </header>

        <aside class="sidebar">
            <div class="sidebar-logo">DarkPage</div>
            <nav class="sidebar-menu" id="sidebar-menu">
                <a class="sidebar-menu-item active" data-section="home" href="#home" onclick="showSection('home')">
                    <i class="fa-solid fa-house"></i>
                    <span>Início</span>
                </a>
                <a class="sidebar-menu-item" data-section="trends" href="#trends" onclick="showSection('trends')">
                    <i class="fa-solid fa-fire"></i>
                    <span>Em Alta</span>
                </a>
                <a class="sidebar-menu-item" data-section="subs" href="#subs" onclick="showSection('subs')">
                    <i class="fa-solid fa-layer-group"></i>
                    <span>Inscrições</span>
                </a>
                <a class="sidebar-menu-item" data-section="history" href="#history" onclick="showSection('history')">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <span>Histórico</span>
                </a>
            </nav>
        </aside>

        <main class="main-content">
            <section id="home" class="content-section visible">
                <h2><i class="fa-solid fa-house"></i> Início</h2>
                <p>Bem-vindo à página inicial. Este é o conteúdo principal da sua aplicação. Apenas esta seção está visível agora.</p>
                <p>Role para ver mais conteúdo (apenas de exemplo).</p>
                <div style="height: 1000px; background-color: rgba(255, 255, 255, 0.05); padding: 20px; margin-top: 20px;">
                    Conteúdo de Exemplo para Preencher o Espaço
                </div>
            </section>

            <section id="trends" class="content-section">
                <h2><i class="fa-solid fa-fire"></i> Em Alta</h2>
                <p>Aqui você encontra o que está em alta no momento. Seção de Tendências.</p>
            </section>

            <section id="subs" class="content-section">
                <h2><i class="fa-solid fa-layer-group"></i> Inscrições</h2>
                <p>Conteúdo relacionado às suas inscrições. Seção de Canais/Grupos.</p>
            </section>

            <section id="history" class="content-section">
                <h2><i class="fa-solid fa-clock-rotate-left"></i> Histórico</h2>
                <p>Seção do seu histórico de navegação. Lembre-se que em mobile, o footer é usado para navegação.</p>
            </section>
        </main>

        <footer class="footer" id="mobile-footer">
            <div class="footer-item active" data-section="home" onclick="showSection('home')">
                <i class="fa-solid fa-house"></i>
                <span>Início</span>
            </div>
            <div class="footer-item" data-section="trends" onclick="showSection('trends')">
                <i class="fa-solid fa-fire"></i>
                <span>Em Alta</span>
            </div>
            <div class="footer-item" data-section="subs" onclick="showSection('subs')">
                <i class="fa-solid fa-layer-group"></i>
                <span>Inscrições</span>
            </div>
            <div class="footer-item" data-section="history" onclick="showSection('history')">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <span>Histórico</span>
            </div>
        </footer>
    </div>

    <script>
        // Bloco de JavaScript
        
        /**
         * @typedef {('home' | 'trends' | 'subs' | 'history')} SectionName
         */

        /**
         * 1. Oculta todas as seções e remove a classe 'active' de todos os elementos de navegação (sidebar/footer).
         * 2. Exibe a seção alvo.
         * 3. Atualiza os elementos de navegação (sidebar/footer) para destacar a seção ativa.
         * @param {SectionName} sectionId O 'id' da seção a ser mostrada (ex: 'home').
         */
        function showSection(sectionId) {
            // 1. Oculta todas as seções
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(section => {
                section.classList.remove('visible');
            });

            // 2. Exibe a seção alvo
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('visible');
                // Sobe o scroll ao topo da seção
                document.querySelector('.main-content').scrollTop = 0;
            }

            // 3. Atualiza os elementos de navegação
            updateElementsForSection(sectionId);
        }

        /**
         * Atualiza a classe 'active' nos menus de navegação (Sidebar e Footer)
         * para refletir a seção que está atualmente visível.
         * @param {SectionName} activeSectionId O 'id' da seção ativa.
         */
        function updateElementsForSection(activeSectionId) {
            // Atualiza Sidebar
            document.querySelectorAll('.sidebar-menu-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-section') === activeSectionId) {
                    item.classList.add('active');
                }
            });

            // Atualiza Footer (Mobile)
            document.querySelectorAll('.footer-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-section') === activeSectionId) {
                    item.classList.add('active');
                }
            });
        }

        // Função de inicialização: Verifica se o hash na URL corresponde a uma seção
        document.addEventListener('DOMContentLoaded', () => {
            const hash = window.location.hash.substring(1); // Remove o '#'
            if (hash) {
                // Tenta mostrar a seção se ela existir
                if (document.getElementById(hash)) {
                    showSection(hash);
                } else {
                    showSection('home'); // Volta para home se o hash for inválido
                }
            } else {
                showSection('home'); // Se não houver hash, mostra a Home
            }
        });

        // Opcional: Adiciona um listener para o evento popstate para navegação com o botão "Voltar" do navegador
        window.addEventListener('popstate', () => {
             const hash = window.location.hash.substring(1) || 'home';
             showSection(hash);
        });

        // Opcional: Intercepta os cliques de link para atualizar o hash e o estado
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href').substring(1);
                // Não previne o default para que o hash da URL seja atualizado
                // O popstate ou a função showSection() se encarregam do resto.
                if (document.getElementById(targetId)) {
                    showSection(targetId);
                }
            });
        });
    </script>
</body>
</html>
```
---  
```
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Page - UX Responsiva</title>
    <style>
        /* ================================================= */
        /* CSS                      */
        /* ================================================= */

        /* Variáveis e Reset Básico */
        :root {
            --cor-fundo-principal: #18191a;
            --cor-fundo-secundario: #242526;
            --cor-texto-principal: #e4e6eb;
            --cor-texto-secundario: #b0b3b8;
            --cor-destaque: #3a8dff;
            --largura-menu-lateral: 240px;
            --altura-header-footer-mobile: 60px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: var(--cor-fundo-principal);
            color: var(--cor-texto-principal);
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* --- Layout Desktop (Widescreen) --- */
        @media (min-width: 769px) {
            body {
                display: block; /* Desativa o flex para o layout principal de duas colunas */
            }

            .main-content-container {
                display: flex;
                min-height: 100vh;
            }

            /* Menu Lateral */
            .sidebar {
                width: var(--largura-menu-lateral);
                background-color: var(--cor-fundo-secundario);
                padding: 16px 0;
                position: fixed;
                height: 100vh;
                overflow-y: auto;
                border-right: 1px solid #333;
                z-index: 10;
            }

            .sidebar ul {
                list-style: none;
            }

            .sidebar a {
                display: block;
                padding: 10px 20px;
                color: var(--cor-texto-secundario);
                text-decoration: none;
                transition: background-color 0.2s, color 0.2s;
                border-radius: 8px;
                margin: 4px 12px;
                font-weight: 500;
            }

            .sidebar a:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            
            .sidebar a.active {
                background-color: var(--cor-destaque);
                color: var(--cor-texto-principal);
            }

            /* Main Content */
            main {
                flex-grow: 1;
                margin-left: var(--largura-menu-lateral); /* Compensa a barra lateral fixa */
                padding: 24px;
            }
            
            /* Header e Footer invisíveis no desktop */
            .header-mobile, .footer-mobile {
                display: none;
            }
        }

        /* --- Layout Mobile --- */
        @media (max-width: 768px) {
            
            .main-content-container {
                flex-grow: 1;
                padding-bottom: var(--altura-header-footer-mobile); /* Evita que o footer mobile esconda o conteúdo */
            }

            /* Header Mobile */
            .header-mobile {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: var(--altura-header-footer-mobile);
                background-color: var(--cor-fundo-secundario);
                border-bottom: 1px solid #333;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 16px;
                z-index: 20;
            }
            
            .header-mobile .logo {
                font-size: 1.5em;
                font-weight: bold;
                color: var(--cor-destaque);
            }

            .header-mobile .home-link {
                color: var(--cor-texto-principal);
                text-decoration: none;
                padding: 8px 12px;
                border-radius: 4px;
                background-color: rgba(255, 255, 255, 0.1);
                font-weight: 600;
                transition: background-color 0.2s;
            }
            .header-mobile .home-link:hover {
                 background-color: rgba(255, 255, 255, 0.2);
            }

            /* Main Content em Mobile */
            main {
                padding: calc(var(--altura-header-footer-mobile) + 16px) 16px 16px; /* Desloca o conteúdo abaixo do header */
                flex-grow: 1;
            }

            /* Footer Mobile (Bottom Navigation Bar) */
            .footer-mobile {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                height: var(--altura-header-footer-mobile);
                background-color: var(--cor-fundo-secundario);
                border-top: 1px solid #333;
                display: flex;
                justify-content: space-around;
                align-items: center;
                z-index: 20;
                /* Melhor prática de UX: ícones e labels curtas */
            }

            .footer-mobile a {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-decoration: none;
                color: var(--cor-texto-secundario);
                font-size: 0.75rem;
                transition: color 0.2s;
                padding: 8px;
            }

            .footer-mobile a:hover {
                color: var(--cor-texto-principal);
            }

            .footer-mobile a.active {
                color: var(--cor-destaque);
            }
            
            .footer-mobile i {
                font-size: 1.2rem; /* Tamanho dos ícones */
                margin-bottom: 2px;
            }

            /* Menu Lateral invisível no mobile */
            .sidebar {
                display: none;
            }
        }

        /* --- Estilo das Seções (Comum) --- */
        section {
            padding: 20px;
            margin-bottom: 20px;
            background-color: var(--cor-fundo-secundario);
            border-radius: 8px;
            min-height: 80vh; /* Para garantir que o main tenha altura suficiente */
            
            /* Lógica de Visibilidade: a seção visível tem o ID do JS */
            display: none;
        }

        section.active {
            display: block; /* Apenas a seção ativa é visível */
        }

        section h2 {
            color: var(--cor-destaque);
            margin-bottom: 15px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }

        /* Adicionando Font Awesome para ícones */
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

    </style>
</head>
<body>
    
    <header class="header-mobile">
        <div class="logo">AppDark</div>
        <a href="#home" class="home-link" onclick="showSection('section-home'); return false;">Início</a>
    </header>

    <div class="main-content-container">

        <nav class="sidebar">
            <h2><i class="fas fa-grip-lines-vertical" style="color: var(--cor-destaque); margin-right: 8px;"></i> Navegação</h2>
            <ul>
                <li><a href="#home" data-section-id="section-home" class="nav-link"><i class="fas fa-home"></i> Home</a></li>
                <li><a href="#perfil" data-section-id="section-perfil" class="nav-link"><i class="fas fa-user-circle"></i> Perfil</a></li>
                <li><a href="#config" data-section-id="section-config" class="nav-link"><i class="fas fa-cog"></i> Configurações</a></li>
                <li><a href="#ajuda" data-section-id="section-ajuda" class="nav-link"><i class="fas fa-question-circle"></i> Ajuda</a></li>
            </ul>
        </nav>

        <main>
            
            <section id="section-home" class="active">
                <h2>Página Inicial 🏠</h2>
                <p>Boas-vindas ao seu layout dark responsivo. Esta é a seção principal.</p>
                <p>Em telas grandes, você vê o menu de navegação lateral (como o YouTube). Em telas pequenas, a navegação principal está no footer.</p>
            </section>

            <section id="section-perfil">
                <h2>Meu Perfil 👤</h2>
                <p>Aqui estarão as informações do usuário, histórico e dados pessoais.</p>
            </section>

            <section id="section-config">
                <h2>Configurações ⚙️</h2>
                <p>Opções para personalizar a experiência, como tema e notificações.</p>
            </section>
            
            <section id="section-ajuda">
                <h2>Ajuda e Suporte ❓</h2>
                <p>Conteúdo de FAQ, tutoriais e como entrar em contato conosco.</p>
            </section>

        </main>
        
    </div>

    <footer class="footer-mobile">
        <a href="#home" data-section-id="section-home" class="nav-link active">
            <i class="fas fa-home"></i>
            <span>Home</span>
        </a>
        <a href="#perfil" data-section-id="section-perfil" class="nav-link">
            <i class="fas fa-user-circle"></i>
            <span>Perfil</span>
        </a>
        <a href="#config" data-section-id="section-config" class="nav-link">
            <i class="fas fa-cog"></i>
            <span>Config.</span>
        </a>
        <a href="#ajuda" data-section-id="section-ajuda" class="nav-link">
            <i class="fas fa-question-circle"></i>
            <span>Ajuda</span>
        </a>
    </footer>


    <script>
        /* ================================================= */
        /* JS                       */
        /* ================================================= */

        document.addEventListener('DOMContentLoaded', () => {
            
            // Adiciona listener de clique para todos os links de navegação
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault(); // Impede o comportamento padrão do link
                    const sectionId = link.getAttribute('data-section-id');
                    
                    if (sectionId) {
                        showSection(sectionId);
                    }
                });
            });

            // Garante que a seção correta é carregada ao iniciar (útil para links diretos ou histórico)
            const initialSectionId = window.location.hash.substring(1) ? `section-${window.location.hash.substring(1)}` : 'section-home';
            showSection(initialSectionId);
        });


        /**
         * 1. Oculta todas as seções.
         * 2. Exibe a seção com o ID fornecido, adicionando a classe 'active'.
         * @param {string} sectionId - O ID da seção a ser exibida (ex: 'section-home').
         */
        function showSection(sectionId) {
            // Oculta todas as seções
            document.querySelectorAll('section').forEach(section => {
                section.classList.remove('active');
            });

            // Exibe a seção desejada
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Atualiza a URL (opcional, mas bom para histórico/compartilhamento)
                const hash = sectionId.replace('section-', '#');
                history.pushState(null, null, hash);
                
                // Atualiza o estado visual dos elementos de navegação
                updateElementsForSection(sectionId);
            }
        }


        /**
         * 1. Remove a classe 'active' de todos os links de navegação.
         * 2. Adiciona a classe 'active' ao link de navegação que corresponde à seção exibida.
         * @param {string} activeSectionId - O ID da seção ativa.
         */
        function updateElementsForSection(activeSectionId) {
            
            // 1. Remove 'active' de todos os links de navegação (sidebar e footer)
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            // 2. Adiciona 'active' aos links correspondentes à seção ativa
            const activeLinkSelector = `.nav-link[data-section-id="${activeSectionId}"]`;
            document.querySelectorAll(activeLinkSelector).forEach(link => {
                link.classList.add('active');
            });
        }

    </script>
</body>
</html>
```
