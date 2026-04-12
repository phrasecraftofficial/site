export default async ({ req, res, log, error }) => {
  log("--- INÍCIO DA EXECUÇÃO ---");
  
  // No Appwrite, req.query contém os parâmetros da URL ?param=valor
  const proxyUrl = req.query.proxyUrl;
  
  log(`📋 URL via Query: ${proxyUrl || 'NÃO ENCONTRADA'}`);

  if (proxyUrl && proxyUrl.startsWith('http')) {
    try {
      log(`🌐 Buscando áudio: ${proxyUrl}`);
      
      const audioRes = await fetch(proxyUrl);
      if (!audioRes.ok) throw new Error(`Status ${audioRes.status}`);

      const audioBuffer = await audioRes.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      
      log(`✅ Sucesso: ${audioBuffer.byteLength} bytes`);

      return res.json({
        audio: base64Audio,
        success: true
      });
    } catch (err) {
      error("❌ Erro: " + err.message);
      return res.json({ error: err.message }, 500);
    }
  }

  error("❌ Nenhuma URL encontrada na query string.");
  return res.json({ error: "Parâmetro proxyUrl é obrigatório na URL" }, 400);
};
