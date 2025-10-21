const fetch = require('node-fetch');

// Função para autorizar a conta no Backblaze e obter as credenciais de upload
module.exports = async function(req, res) {
  // Configura headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Para dev, permite todas origens
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Responde rápido a pré-flight OPTIONS
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const keyId = process.env.B2_KEY_ID;        // Sua chave de conta do Backblaze
  const applicationKey = process.env.B2_APP_KEY;  // Sua chave de aplicação do Backblaze
  const bucketId = process.env.B2_BUCKET_ID;  // O ID do bucket de upload
  
  const authHeader = Buffer.from(`${keyId}:${applicationKey}`).toString('base64');
  
  try {
    // 1. Autoriza a conta e pega o token de autorização
    const authRes = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
      method: "GET",
      headers: {
        "Authorization": `Basic ${authHeader}`,
      }
    });

    const authData = await authRes.json();

    if (authRes.status !== 200) {
      throw new Error(`Erro de autenticação: ${authData.message}`);
    }

    // 2. Obter a URL de upload
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
      throw new Error(`Erro ao obter URL de upload: ${uploadData.message}`);
    }

    // 3. Envia as credenciais de upload de volta para o front-end
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      uploadUrl: uploadData.uploadUrl,
      authorizationToken: uploadData.authorizationToken,
    }));

  } catch (err) {
    console.error("Erro ao autorizar Backblaze B2:", err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: "Erro ao obter credenciais de upload." }));
  }
};
