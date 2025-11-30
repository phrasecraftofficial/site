# site

transformar a o select em checkbox, 
diminuir alutra do video, colocar barra de botoes em duas linha ao lado do video, 
ao editar inicio e fim considerar a caixa de selecao, ou seja ao clicar em fim considerar se linha atual, todas, atual e proximas, 
adiantar e atrasar continua, 
cuidado para quebrar o redo undo, coracao da edicao

Fluxo para tanto para thumb quanto para srt e video: consulta cache arquivos e nome, consulta links e nomes no aw, baixa arquivos do bb, salva arquivos e nomes no cache,

Estratégia recomendada
Lazy loading nativo (loading="lazy): simples e eficiente para a maioria dos casos.

IntersectionObserver + Paginação infinita: se você tem MUITAS thumbs (milhares), vale dividir em lotes:

Carrega 20–30 por vez.

Quando o usuário chega perto do fim, busca mais via AJAX/Fetch.

Isso evita até mesmo renderizar 100 elementos no DOM de uma vez.

📊 Exemplo de fluxo com 100 thumbs
Página inicial: renderiza 20 thumbs.

Scroll até 50% da tela: carrega mais 20.

Scroll até 80%: carrega mais 20.

Se o usuário nunca chegar ao fim, talvez só 40–60 imagens sejam carregadas, mesmo que existam 100+.

👉 Ou seja: lazy loading sozinho já resolve se você renderizar todas as thumbs no HTML, mas só carregar conforme aparecem. Se você quiser otimizar ainda mais, combine com scroll infinito para não renderizar centenas de elementos desnecessários no DOM.

criar documento editingLessons
Adicionar toggle 'em edicao' ou colocar em edicao automaticamente ao clicar em editar e exibir alert 'Ao continuar, essa licao nao ficara mais disponivel para partidas ate que seja postada novamente. Deseja continuar?'
antes de carregar licoes consulta documento para nao exibir licoes com status 'editing'
usar notificacoes para lembrar o usuario de terminar a edicao
se user editando for igual user logado = notifica 'De volta ao trabalho, os jogadores estao esperando pela sua licao:
xxxx xxxxx, em edicao ha x dia(s).'
atualiza todo dia de acordo com o dia que foi criado o registro de edicao.

editorUserId, baseName, link srt, link video, link thumb, status: editing/posted

idiomas, seleciona idioma na lista
sigla do idioma e adicionado no nome
parse do nome para saber o idioma do sintetizador e do tradutor

usar url assinada do Backblaze;  
centralizar a consulta no cache;  
centralizar a manipulação do server CRUD;  
    // NOVO: Atualiza o cache antes de recarregar  
    await refreshLessonsCache();  deve atualizar somente a lição postada
    
Quando você tenta injetar o objeto JavaScript completo ou o baseName com aspas em uma chamada onclick no HTML, o JavaScript parser dentro do navegador se confunde. O JavaScript para de analisar em O' e vê o restante como lixo, causando o erro de sintaxe. A melhor prática é remover a chamada de função do HTML inline e usar Event Listeners no JavaScript, após a renderização.
