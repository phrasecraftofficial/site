# site

se ao consultar partidas resposta do servidor for que não ha partidas para a consulta
usar url assinada do Backblaze;  
centralizar a consulta no cache;  
centralizar a manipulação do server CRUD;  
    // NOVO: Atualiza o cache antes de recarregar  
    await refreshLessonsCache();  deve atualizar somente a lição postada
