export default async ({ req, res, log, error }) => {
  const keyId = process.env.B2_KEY_ID;
  const applicationKey = process.env.B2_APP_KEY;
  const bucketId = process.env.B2_BUCKET_ID;
 
  if (!keyId || !applicationKey || !bucketId) {
    error("ERRO: Variáveis de ambiente não definidas.");
    return res.json({ error: "Configuração de chaves incompleta." }, 500);
  }
  
  const authHeader = Buffer.from(`${keyId}:${applicationKey}`).toString('base64');
  const now = Date.now();
 
  try {
    // Autorização com cache
    if (!cachedAuth || now > authExpiry) {
      log("🔑 Autenticando com Backblaze B2...");
      const authRes = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
        method: "GET",
        headers: { "Authorization": `Basic ${authHeader}` }
      });
      
      cachedAuth = await authRes.json();
      
      if (authRes.status !== 200) {
        error(`Erro de autenticação B2: ${cachedAuth.message}`);
        cachedAuth = null;
        return res.json({ error: `Erro de autenticação: ${cachedAuth.message}` }, 401);
      }
      
      authExpiry = now + (23 * 60 * 60 * 1000);
      log("✅ Autenticação cacheada");
    } else {
      log("⚡ Usando token em cache");
    }
    
    const authData = cachedAuth;
    
    // Pega a ação do body
    let action = 'upload';
    let fileId, fileName;
    
    try {
      const body = JSON.parse(req.body || '{}');
      action = body.action || 'upload';
      fileId = body.fileId;
      fileName = body.fileName;
    } catch (e) {
      log("Body vazio, usando ação padrão: upload");
    }
    
    // ============================================
    // CASO 1: Deletar arquivo
    // ============================================
    if (action === 'delete') {
      log(`🗑️ Deletando arquivo: ${fileName} (ID: ${fileId})`);
      
      if (!fileId || !fileName) {
        error("fileId e fileName são obrigatórios para deletar");
        return res.json({ error: "fileId e fileName obrigatórios" }, 400);
      }
      
      const deleteRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_delete_file_version`, {
        method: "POST",
        headers: {
          "Authorization": authData.authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId: fileId,
          fileName: fileName,
        }),
      });
      
      const deleteData = await deleteRes.json();
      
      if (deleteRes.status !== 200) {
        error(`Erro ao deletar arquivo: ${deleteData.message}`);
        return res.json({ error: `Erro ao deletar: ${deleteData.message}` }, 500);
      }
      
      log(`✅ Arquivo deletado: ${fileName}`);
      return res.json({ 
        success: true,
        fileId: fileId,
        fileName: fileName 
      });
    }
    
    // ============================================
    // CASO 2: Listar TODAS as versões (incluindo duplicatas)
    // ============================================
    if (action === 'list' || action === 'list_versions') {
      log("📋 Listando TODAS as versões de arquivos...");
      
      const listRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_list_file_versions`, {
        method: "POST",
        headers: {
          "Authorization": authData.authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucketId: bucketId,
          maxFileCount: 10000, // Aumentado para pegar todas as versões
        }),
      });
      
      const listData = await listRes.json();
      
      if (listRes.status !== 200) {
        error(`Erro ao listar: ${listData.message}`);
        return res.json({ error: `Erro ao listar: ${listData.message}` }, 500);
      }
      
      log(`✅ ${listData.files?.length || 0} versões listadas (incluindo duplicatas)`);
      return res.json({
        files: listData.files,
        nextFileName: listData.nextFileName,
        nextFileId: listData.nextFileId,
      });
    }
    
    // ============================================
    // CASO 3: Upload URL (padrão)
    // ============================================
    log("📤 Obtendo URL de upload...");
    const uploadUrlRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: "POST",
      headers: {
        "Authorization": authData.authorizationToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bucketId: bucketId }),
    });
    
    const uploadData = await uploadUrlRes.json();
    
    if (uploadUrlRes.status !== 200) {
      error(`Erro ao obter URL: ${uploadData.message}`);
      return res.json({ error: `Erro ao obter URL: ${uploadData.message}` }, 500);
    }
    
    log("✅ URL de upload enviada");
    return res.json({
      uploadUrl: uploadData.uploadUrl,
      authorizationToken: uploadData.authorizationToken,
    });
    
  } catch (err) {
    error("❌ Erro: " + err.message);
    return res.json({ error: "Erro interno." }, 500);
  }
};
