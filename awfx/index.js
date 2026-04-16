const ytdl = require('@distube/ytdl-core');

module.exports = async function (context) {
    // Log para ver o que está chegando
    context.log('Corpo recebido: ' + context.req.body);

    try {
        const body = typeof context.req.body === 'string' 
            ? JSON.parse(context.req.body) 
            : context.req.body;

        const videoUrl = body.url;

        if (!videoUrl) {
            return context.res.json({ error: 'URL do YouTube não fornecida' }, 400);
        }

        context.log('Validando URL: ' + videoUrl);
        
        // Obtendo informações do vídeo
        const info = await ytdl.getInfo(videoUrl);
        
        // Filtrando para pegar apenas o áudio com melhor qualidade
        const format = ytdl.chooseFormat(info.formats, { 
            filter: 'audioonly', 
            quality: 'highestaudio' 
        });

        // O LOG QUE VOCÊ QUERIA:
        context.log('-----------------------------------');
        context.log('LINK DO ÁUDIO GERADO:');
        context.log(format.url);
        context.log('-----------------------------------');

        return context.res.json({
            status: 'success',
            title: info.videoDetails.title,
            directUrl: format.url
        });

    } catch (err) {
        context.error('Erro no processamento: ' + err.message);
        return context.res.json({ 
            status: 'error', 
            message: err.message 
        }, 500);
    }
};
