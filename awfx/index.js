/*
 * Código da Função Appwrite (Backend) - COM CACHE DE AUTENTICAÇÃO
 * Usando o formato ES Modules
 * Suporta: Upload URL + Listagem de arquivos
 */
// Variáveis globais para cache (persistem entre execuções)
let cachedAuth = null;
let authExpiry = 0;

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
  const now = Date.now();
 
  try {
    // 2. Autoriza a conta (COM CACHE DE 23 HORAS)
    if (!cachedAuth || now > authExpiry) {
      log("🔑 Autenticando com Backblaze B2...");
      const authRes = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
        method: "GET",
        headers: {
          "Authorization": `Basic ${authHeader}`,
        }
      });
      
      cachedAuth = await authRes.json();
      
      if (authRes.status !== 200) {
        error(`Erro de autenticação B2: ${cachedAuth.message}`);
        cachedAuth = null; // Limpa cache em caso de erro
        return res.json({ error: `Erro de autenticação B2: ${cachedAuth.message}` }, 401);
      }
      
      // Cache expira em 23 horas (tokens B2 duram 24h)
      authExpiry = now + (23 * 60 * 60 * 1000);
      log("✅ Autenticação realizada e cacheada por 23 horas");
    } else {
      log("⚡ Usando token de autenticação em cache");
    }
    
    const authData = cachedAuth;
    
    // 3. Verifica qual operação executar
    let action = 'upload'; // Padrão
    
    try {
      const body = JSON.parse(req.body || '{}');
      action = body.action || 'upload';
    } catch (e) {
      log("Body vazio ou inválido, usando ação padrão: upload");
    }
    
    // --------------------------------------------
    // CASO 1: Listar arquivos do bucket
    // --------------------------------------------
    if (action === 'list') {
      log("📋 Listando arquivos do bucket...");
      
      const listRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_list_file_names`, {
        method: "POST",
        headers: {
          "Authorization": authData.authorizationToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucketId: bucketId,
          maxFileCount: 1000,
        }),
      });
      
      const listData = await listRes.json();
      
      if (listRes.status !== 200) {
        error(`Erro ao listar arquivos B2: ${listData.message}`);
        return res.json({ error: `Erro ao listar arquivos B2: ${listData.message}` }, 500);
      }
      
      log(`✅ Arquivos listados: ${listData.files?.length || 0}`);
      
      return res.json({
        files: listData.files,
        nextFileName: listData.nextFileName,
      });
    }
    
    // --------------------------------------------
    // CASO 2: Obter URL de upload (padrão)
    // --------------------------------------------
    log("📤 Obtendo URL de upload do B2...");
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
    
    log("✅ URL de upload enviada para o front-end");
    return res.json({
      uploadUrl: uploadData.uploadUrl,
      authorizationToken: uploadData.authorizationToken,
    });
    
  } catch (err) {
    error("❌ Erro no catch principal da função: " + err.message);
    return res.json({ error: "Erro interno ao processar a requisição." }, 500);
  }
};
