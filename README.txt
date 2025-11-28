# site

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
