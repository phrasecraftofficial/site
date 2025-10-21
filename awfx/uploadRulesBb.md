```
// update-cors-direct.js
const https = require('https');

const KEY_ID = '36ade63e4ef9';
const APP_KEY = '005b062f88bc09cccebb369116fd792103fb4ff6b1';
const BUCKET_ID = 'f346aafd4eb6036e94ae0f19';

const corsRules = [
  {
    "corsRuleName": "downloadFromAnyOrigin",
    "allowedOrigins": ["*"],
    "allowedOperations": ["b2_download_file_by_id", "b2_download_file_by_name"],
    "allowedHeaders": ["authorization", "range"],
    "exposeHeaders": [],
    "maxAgeSeconds": 3600
  },
  {
    "corsRuleName": "s3DownloadFromAnyOrigin",
    "allowedOrigins": ["*"],
    "allowedOperations": ["s3_head", "s3_get"],
    "allowedHeaders": ["authorization", "range"],
    "exposeHeaders": [],
    "maxAgeSeconds": 3600
  },
  {
    "corsRuleName": "AllowUpload",
    "allowedOrigins": ["*"],
    "allowedOperations": ["b2_upload_file", "b2_upload_part"],
    "allowedHeaders": ["authorization", "content-type", "x-bz-file-name", "x-bz-content-sha1", "x-bz-info-*"],
    "exposeHeaders": ["x-bz-content-sha1", "x-bz-file-id"],
    "maxAgeSeconds": 3600
  }
];

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function updateCors() {
  try {
    console.log("🔐 Autorizando com Backblaze...");
    
    // 1. Autorizar
    const authHeader = Buffer.from(`${KEY_ID}:${APP_KEY}`).toString('base64');
    const authResponse = await makeRequest({
      hostname: 'api.backblazeb2.com',
      path: '/b2api/v2/b2_authorize_account',
      method: 'GET',
      headers: { 'Authorization': `Basic ${authHeader}` }
    });

    if (authResponse.status !== 200) {
      console.error('❌ Erro na autenticação:', authResponse.data);
      return;
    }

    const { authorizationToken, apiUrl } = authResponse.data;
    console.log("✅ Autorizado!");

    // 2. Atualizar bucket
    console.log("📝 Atualizando regras CORS...");
    
    const apiUrlObj = new URL(apiUrl);
    const updateData = JSON.stringify({
      accountId: authResponse.data.accountId,
      bucketId: BUCKET_ID,
      corsRules: corsRules
    });

    const updateResponse = await makeRequest({
      hostname: apiUrlObj.hostname,
      path: '/b2api/v2/b2_update_bucket',
      method: 'POST',
      headers: {
        'Authorization': authorizationToken,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(updateData)
      }
    }, updateData);

    if (updateResponse.status !== 200) {
      console.error('❌ Erro ao atualizar:', updateResponse.data);
      return;
    }

    console.log("\n🎉 --- SUCESSO! ---");
    console.log("\n📋 Regras CORS aplicadas:");
    console.log(JSON.stringify(updateResponse.data.corsRules, null, 2));

    // Verificar se a regra de upload existe
    const hasUpload = updateResponse.data.corsRules.some(
      rule => rule.allowedOperations.includes('b2_upload_file')
    );
    
    if (hasUpload) {
      console.log("\n✅✅✅ REGRA DE UPLOAD CONFIRMADA! Pode testar agora! ✅✅✅");
    } else {
      console.log("\n⚠️ Upload ainda não aparece. Vamos tentar pela interface web.");
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

updateCors();
```
