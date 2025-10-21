/*
 * Código da Função Appwrite (Backend)
 * Usando o formato ES Modules (o seu formato)
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
