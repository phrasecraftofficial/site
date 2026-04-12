export default async ({ req, res, log, error }) => {
  log("--- INÍCIO DA EXECUÇÃO ---");
  
  let proxyUrl = "";

  // No Appwrite, dados de execução via API (POST /executions) chegam aqui:
  const payloadRaw = req.payload || req.body; 
  log("Conteúdo do Payload/Body: " + JSON.stringify(payloadRaw));

  try {
    const data = typeof payloadRaw === 'string' ? JSON.parse(payloadRaw || '{}') : payloadRaw;
    proxyUrl = data.proxyUrl;
  } catch (e) {
    error("Erro ao parsear payload: " + e.message);
  }

  log("URL para processar: " + (proxyUrl || "NÃO ENCONTRADA"));

  if (proxyUrl && proxyUrl.startsWith('http')) {
    try {
      log("Buscando áudio...");
      const response = await fetch(proxyUrl);
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      
      log("Sucesso. Tamanho Base64: " + base64.length);
      return res.json({ audio: base64 });
    } catch (err) {
      error("Erro no fetch: " + err.message);
      return res.json({ error: err.message }, 500);
    }
  }

  return res.json({ error: "proxyUrl ausente no payload" }, 400);
};
