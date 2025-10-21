/*
 * Este é o código da sua Função Appwrite (backend)
 */

// CORREÇÃO 1: A assinatura da função deve receber 'context'
module.exports = async (context) => {
  
  // CORREÇÃO 2: 'req' e 'res' vêm do objeto 'context'
  const { req, res } = context;

  // Pega as credenciais das Variáveis de Ambiente da função
  const keyId = process.env.B2_KEY_ID;
  const applicationKey = process.env.B2_APP_KEY;
  const bucketId = process.env.B2_BUCKET_ID;
 
  // VERIFICAÇÃO IMPORTANTE: Garante que as variáveis existem
  if (!keyId || !applicationKey || !bucketId) {
    // Isso aparecerá nos "Logs" da sua função
    context.error("ERRO: Uma ou mais variáveis de ambiente (B2_KEY_ID, B2_APP_KEY, B2_BUCKET_ID) não foram definidas.");
    // Retorna um erro claro para o front-end
    return res.status(500).json({ error: "Configuração de chaves incompleta no servidor." });
  }

  const authHeader = Buffer.from(`${keyId}:${applicationKey}`).toString('base64');
 
  try {
    // 1. Autoriza a conta e pega o token de autorização
    context.log("Autorizando com Backblaze B2...");
    const authRes = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
      method: "GET",
      headers: {
        "Authorization": `Basic ${authHeader}`,
      }
    });

    const authData = await authRes.json();

    if (authRes.status !== 200) {
      context.error(`Erro de autenticação B2: ${authData.message}`);
      throw new Error(`Erro de autenticação B2: ${authData.message}`);
    }

    // 2. Obter a URL de upload
    context.log("Obtendo URL de upload do B2...");
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
      context.error(`Erro ao obter URL de upload B2: ${uploadData.message}`);
      throw new Error(`Erro ao obter URL de upload B2: ${uploadData.message}`);
    }

    // 3. Envia as credenciais de upload de volta para o front-end
    context.log("URL de upload enviada para o front-end.");
    return res.json({
      uploadUrl: uploadData.uploadUrl,
      authorizationToken: uploadData.authorizationToken,
    });

  } catch (err) {
    // Agora o 'res' existe e pode enviar o erro corretamente
    context.error("Erro no catch principal da função: " + err.message);
    return res.status(500).json({ error: "Erro interno ao processar a requisição." });
  }
};
