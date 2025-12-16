# site
##########
No plano gratuito do Appwrite Cloud, os limites de solicitações (requests) são definidos por tipo de operação e são aplicados por mês, por projeto: 
Operações de leitura (reads) no banco de dados: 500.000 por mês.
Operações de escrita (writes) no banco de dados: 250.000 por mês.
Execuções de funções (functions): 750.000 por mês. 
Além disso, existem outros limites no plano gratuito: 
Usuários ativos mensalmente: 75.000.
Largura de banda (bandwidth): 5GB.
Armazenamento (storage): 2GB.
Projetos: Limite de 2 projetos por organização.
Outros limites de recursos por projeto (como 1 banco de dados, 1 bucket, 5 funções). 
Quando esses limites são atingidos no plano gratuito, as operações adicionais são limitadas (throttled), o que significa que as solicitações além do limite não serão processadas. 
#########

>voz, repeticao, outro botoes que tem no play, pode adicionar repeticao em play, preview e editsrt, pode ter quemontar a frase com voz sintetica, dps voz real dps traducao etc
>enviar performance para posts, sera a ultima performance obtida

Essa é, sem dúvida, a **arquitetura ideal** para economizar banda e criar uma experiência mais rápida e resiliente (quase como um aplicativo nativo). Você está descrevendo, na essência, o funcionamento de uma **PWA (Progressive Web App) com estratégia de "Cache-First"**.

Aqui está a minha visão de como esse fluxo deve funcionar arquiteturalmente, separado por etapas lógicas:

### 1. O Conceito: Appwrite como "Fonte da Verdade"
O Appwrite continua sendo o cérebro. Ele diz **o que** existe e **qual a versão** atual. O Dexie (IndexedDB) vira o seu "armazém local". O Backblaze é apenas o fornecedor atacadista que você só chama quando o armazém está vazio.

### 2. O Novo Fluxo de Dados

#### A. Inicialização (Ao abrir o App)
1.  **Baixar Lista (Leve):** O App faz a consulta ao Appwrite (`databases.listDocuments`). Isso é barato e rápido.
2.  **Não baixar arquivos ainda:** Você recebe apenas os metadados: `lessonName`, `fileIds` e, crucialmente, o **`$updatedAt`** (timestamp da última modificação).
3.  **Renderizar Interface:** A UI é montada imediatamente. As thumbnails podem continuar sendo URLs normais (deixando o cache do navegador gerenciar as imagens, que é eficiente) ou serem cacheadas no Dexie se você quiser acesso offline total.

#### B. Ao Clicar em uma Lição (O "Smart Loader")
Aqui está a mágica da economia. Antes de tocar no vídeo ou legenda, o sistema faz uma **Verificação de Integridade**:

1.  **Consulta ao Dexie:** Busca no banco local pelo `baseName` ou `docId`.
2.  **Cenário 1: Não existe no Dexie (Cold Start)**
    * Baixa o Vídeo (Blob) e o SRT (Texto) do Backblaze.
    * Salva no Dexie junto com o timestamp (`$updatedAt`) que veio do Appwrite.
    * Exibe o conteúdo.
    * *Custo:* 1 download completo.

3.  **Cenário 2: Existe no Dexie e o Timestamp é IGUAL (Cache Hit)**
    * Compara o `$updatedAt` do Appwrite (que você acabou de baixar na lista) com o `savedAt` armazenado no registro do Dexie.
    * Se forem iguais, cria uma URL local (`URL.createObjectURL`) direto do Blob do Dexie.
    * O Backblaze **não é chamado**.
    * *Custo:* Zero banda. Velocidade instantânea.

4.  **Cenário 3: Existe no Dexie, mas o Timestamp é DIFERENTE (Stale/Desatualizado)**
    * Significa que você editou a lição em outro lugar.
    * Deleta o registro antigo do Dexie.
    * Baixa os novos arquivos do Backblaze.
    * Salva o novo registro com o novo timestamp.
    * *Custo:* 1 download completo (necessário para atualização).

### 3. Considerações Técnicas Importantes

Para essa visão funcionar, você precisa estar atento a três pontos:

* **Armazenamento de Blob (Vídeo é pesado):**
    O IndexedDB (onde o Dexie roda) aguenta muito dado (gigas), mas não é infinito. Se você cachear *todos* os vídeos que o usuário assistir, o navegador pode atingir a cota e pedir para limpar dados.
    * *Sugestão:* Implemente uma política simples, como "Manter apenas as últimas 5 lições abertas" ou um botão de "Limpar Downloads" nas configurações.

* **Custo de Memória vs. Disco:**
    Ler um Blob de vídeo do IndexedDB para a memória consome RAM. Certifique-se de revogar as URLs de objeto (`URL.revokeObjectURL`) quando o usuário sair da lição (voltar para a Home) para evitar vazamento de memória, já que agora os vídeos virão do disco local e não de streaming direto.

* **Offline First:**
    Com essa arquitetura, se o usuário tiver a lição no Dexie, ele pode tecnicamente assistir à aula mesmo se a internet cair (desde que o Appwrite tenha carregado a lista antes, ou se você persistir a lista de metadados no Dexie também).

### Resumo da Visão
Você vai transformar seu app de um "visualizador online" para um "gerenciador de conteúdo local".

* **Antes:** Appwrite -> Link Backblaze -> Browser Download (Sempre).
* **Depois:** Appwrite (Metadata) -> Verificação Lógica -> Dexie (Se válido) OU Backblaze (Se novo/alterado).

Essa é a abordagem profissional. Ela elimina o problema dos seus testes consumirem banda repetida e melhora drasticamente a experiência do usuário final em conexões instáveis.


transformar a o select em checkbox, 

usar o codigo existente para impedir que a performance inicie antes do video ser carregado, tocar o trecho e liberar os botoes.

Fluxo para tanto para thumb quanto para srt e video, ver visao completa abaixo nesse doc: consulta cache arquivos e nome, consulta links e nomes no aw, baixa arquivos do bb, salva arquivos e nomes no cache,

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
