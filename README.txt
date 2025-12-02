# site

transformar a o select em checkbox, 
diminuir alutra do video, colocar barra de botoes em duas linha ao lado do video, 
ao editar inicio e fim considerar a caixa de selecao, ou seja ao clicar em fim considerar se linha atual, todas, atual e proximas, 
adiantar e atrasar continua, 
cuidado para quebrar o redo undo, coracao da edicao

usar o codigo existente para impedir que a performance inicie antes do video ser carregado, tocar o trecho e liberar os botoes.

saltar para legenda conforme o player avanca.

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

// --------------
// fluxo atua
// --------------

Com certeza. Entender o fluxo atual é o passo mais importante para injetar essa lógica de *fallback* (plano B) sem quebrar o resto.

Aqui está o mapeamento detalhado do fluxo atual do seu código (`previewLesson` e `loadLessonsToCache`):

### 1. Inicialização (Montagem do "Menu")
*Ocorre ao carregar a página (`init`) ou ao atualizar a lista.*

1.  **Consulta ao Appwrite:** O App pede a lista de documentos na coleção `Posts`.
2.  **Recebimento de Metadados:** O Appwrite devolve apenas *dados textuais* (Nome da lição, `videoFileId`, `srtFileId`, `thumbFileId`).
3.  **Construção de URLs (Strings):** O Javascript itera sobre esses documentos e **gera strings** de URL apontando para o Backblaze usando o ID (`...b2api/v1/b2_download_file_by_id?fileId=...`).
4.  **Cache de Metadados:** Esses objetos (contendo IDs e as strings das URLs, mas **não** os arquivos pesados) são salvos no `lessonsCache`.

---

### 2. Execução (Ao clicar em "Preview" ou "Jogar")
*Ocorre dentro da função `previewLesson(lesson)`.*

1.  **Verificação de Cache (Conteúdo Real):**
    * O código verifica se, dentro do objeto `lesson` no cache, já existem os dados processados:
        * **Vídeo:** Existe um `blobUrl` (ex: `blob:http://...`)?
        * **Legenda:** Existe o conteúdo de texto (`srt.content`) parseado?
    * *Se SIM:* Usa o cache local e não consome banda.

2.  **Requisição de Rede (O "Gasto" do Backblaze):**
    * *Se NÃO existir no cache:*
    * O código pega a **URL do Backblaze** (gerada no passo 1.3).
    * Executa um `fetch(url)` real. **(Aqui é onde você bate no limite do B2)**.

3.  **Processamento e Armazenamento:**
    * **Vídeo:** Converte a resposta em `Blob`, cria uma URL local (`URL.createObjectURL`) e salva no `lesson.video.blobUrl`.
    * **Legenda:** Converte a resposta em Texto, faz o parse e salva no `lesson.srt.content`.

4.  **Renderização:**
    * Atualiza os elementos HTML (`video.src`, `srtData`) com esses dados locais.

---

### Onde a lógica de Fallback deve entrar?

Para o seu objetivo (evitar bater no B2 durante testes), a mudança deve ocorrer no **Passo 2.2 da Execução**.

Ao invés de fazer o `fetch` direto na URL do Backblaze, você terá que inserir uma verificação:
1.  Verifica se existe uma URL de fallback para aquela lição específica no seu array de testes.
2.  Se existir, faz o `fetch` nessa URL alternativa.
3.  Se não existir (produção), faz o `fetch` na URL do Backblaze gerada pelo Appwrite.
