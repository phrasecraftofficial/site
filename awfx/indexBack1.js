/*
 * Código da Função Appwrite (Backend)
 * Usando o formato ES Modules
 * Suporta: Upload URL + Listagem de arquivos
 */
export default async ({ req, res, log, error }) => {
  // Pega as credenciais das Variáveis de Ambiente
  const keyId = process.env.B2_KEY_ID;
  const applicationKey = process.env.B2_APP_KEY;
  const bucketId = process.env.B2_BUCKET_ID;
 
  // 1. VERIFICAÇÃO: Garante que as variáveis existem
  if (!keyId || !applicationKey || !bucketId) {
    error("ERRO: Uma ou mais variáveis de ambiente (B2_KEY_ID, B2_APP_KEY, B2_BUCKET_ID) não foram definidas.");
    return res.json({ error: "Configuração de chaves incompleta no servidor." }, 500);
  }
  
  const authHeader = Buffer.from(`${keyId}:${applicationKey}`).toString('base64');
 
  try {
    // 2. Autoriza a conta e pega o token de autorização
    log("Autorizando com Backblaze B2...");
    const authRes = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
      method: "GET",
      headers: {
        "Authorization": `Basic ${authHeader}`,
      }
    });
    
    const authData = await authRes.json();
    
    if (authRes.status !== 200) {
      error(`Erro de autenticação B2: ${authData.message}`);
      return res.json({ error: `Erro de autenticação B2: ${authData.message}` }, 401);
    }
    
    // ============================================
    // NOVO BLOCO: Verifica qual operação executar
    // ============================================
    
    // Verifica se o corpo da requisição contém a ação desejada
    let action = 'upload'; // Padrão: buscar URL de upload
    
    try {
      const body = JSON.parse(req.body || '{}');
      action = body.action || 'upload';
    } catch (e) {
      // Se não conseguir fazer parse do body, mantém 'upload' como padrão
      log("Body vazio ou inválido, usando ação padrão: upload");
    }
    
    // --------------------------------------------
    // CASO 1: Listar arquivos do bucket
    // --------------------------------------------
    if (action === 'list') {
      log("Listando arquivos do bucket...");
      
      const listRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_list_file_names`, {
        method: "POST",
        headers: {
          "Authorization": authData.authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucketId: bucketId,
          maxFileCount: 1000, // Máximo de arquivos por requisição (até 10000)
          // Parâmetros opcionais:
          // startFileName: "nome_do_arquivo.jpg", // Para paginação
          // prefix: "thumbnails/", // Para filtrar por pasta
          // delimiter: "/", // Para listar apenas um nível de pastas
        }),
      });
      
      const listData = await listRes.json();
      
      if (listRes.status !== 200) {
        error(`Erro ao listar arquivos B2: ${listData.message}`);
        return res.json({ error: `Erro ao listar arquivos B2: ${listData.message}` }, 500);
      }
      
      log(`Arquivos listados: ${listData.files?.length || 0}`);
      
      // Retorna a lista de arquivos
      return res.json({
        files: listData.files,
        nextFileName: listData.nextFileName, // Para paginação
      });
    }
    
    // --------------------------------------------
    // CASO 2: Obter URL de upload (padrão)
    // --------------------------------------------
    log("Obtendo URL de upload do B2...");
    const uploadUrlRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: "POST",
      headers: {
        "Authorization": authData.authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucketId: bucketId,
      }),
    });
    
    const uploadData = await uploadUrlRes.json();
    
    if (uploadUrlRes.status !== 200) {
      error(`Erro ao obter URL de upload B2: ${uploadData.message}`);
      return res.json({ error: `Erro ao obter URL de upload B2: ${uploadData.message}` }, 500);
    }
    
    log("URL de upload enviada para o front-end.");
    return res.json({
      uploadUrl: uploadData.uploadUrl,
      authorizationToken: uploadData.authorizationToken,
    });
    
  } catch (err) {
    error("Erro no catch principal da função: " + err.message);
    return res.json({ error: "Erro interno ao processar a requisição." }, 500);
  }
};

/*
 * ==========================================
 * ==========================================
 * ==========================================
 */
/*
 * ============ Back1 ==================
 * Código da Função Appwrite (Backend)
 * Usando o formato ES Modules (o seu formato)
 */
/*
 * ==========================================
 * ==========================================
 * ==========================================
 */
export default async ({ req, res, log, error }) => {
  // Pega as credenciais das Variáveis de Ambiente
  const keyId = process.env.B2_KEY_ID;
  const applicationKey = process.env.B2_APP_KEY;
  const bucketId = process.env.B2_BUCKET_ID;
 
  // 1. VERIFICAÇÃO IMPORTANTE: Garante que as variáveis existem
  if (!keyId || !applicationKey || !bucketId) {
    error("ERRO: Uma ou mais variáveis de ambiente (B2_KEY_ID, B2_APP_KEY, B2_BUCKET_ID) não foram definidas.");
    return res.json({ error: "Configuração de chaves incompleta no servidor." }, 500);
  }

  const authHeader = Buffer.from(`${keyId}:${applicationKey}`).toString('base64');
 
  try {
    // 2. Autoriza a conta e pega o token de autorização
    log("Autorizando com Backblaze B2...");
    const authRes = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
      method: "GET",
      headers: {
        "Authorization": `Basic ${authHeader}`,
      }
    });

    const authData = await authRes.json();

    if (authRes.status !== 200) {
      error(`Erro de autenticação B2: ${authData.message}`);
      return res.json({ error: `Erro de autenticação B2: ${authData.message}` }, 401); // 401 = Unauthorized
    }

    // 3. Obter a URL de upload
    log("Obtendo URL de upload do B2...");
    const uploadUrlRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: "POST",
      headers: {
        "Authorization": authData.authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bucketId: bucketId,
      }),
    });

    const uploadData = await uploadUrlRes.json();

    if (uploadUrlRes.status !== 200) {
      error(`Erro ao obter URL de upload B2: ${uploadData.message}`);
      return res.json({ error: `Erro ao obter URL de upload B2: ${uploadData.message}` }, 500);
    }

    // 4. Envia as credenciais de upload de volta para o front-end
    log("URL de upload enviada para o front-end.");
    return res.json({
      uploadUrl: uploadData.uploadUrl,
      authorizationToken: uploadData.authorizationToken,
    });

  } catch (err) {
    // Erro geral (ex: falha de rede ao tentar fazer 'fetch')
    error("Erro no catch principal da função: " + err.message);
    return res.json({ error: "Erro interno ao processar a requisição." }, 500);
  }
};
