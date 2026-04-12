export default async ({ req, res, log, error }) => {
  log("--- INÍCIO DA EXECUÇÃO ---");
  
  let proxyUrl;
  
  try {
    // Padrão da documentação que você enviou
    const body = JSON.parse(req.body || '{}');
    proxyUrl = body.proxyUrl;
    
    log(`📋 URL recebida para proxy: ${proxyUrl || 'NENHUMA'}`);
  } catch (e) {
    error("❌ Erro ao parsear o body: " + e.message);
    return res.json({ error: "Body inválido ou vazio" }, 400);
  }

  if (proxyUrl && proxyUrl.startsWith('http')) {
    try {
      log(`🌐 Iniciando fetch externo: ${proxyUrl}`);
      
      const audioRes = await fetch(proxyUrl);
      
      if (!audioRes.ok) {
        error(`Erro no fetch externo: ${audioRes.status}`);
        return res.json({ error: `Erro no servidor de origem: ${audioRes.status}` }, 500);
      }

      const audioBuffer = await audioRes.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      
      log(`✅ Sucesso! Tamanho do áudio: ${audioBuffer.byteLength} bytes`);

      return res.json({
        audio: base64Audio,
        success: true
      });

    } catch (err) {
      error("❌ Erro no processamento: " + err.message);
      return res.json({ error: err.message }, 500);
    }
  }

  return res.json({ error: "Parâmetro proxyUrl obrigatório" }, 400);
};
