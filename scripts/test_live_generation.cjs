// scripts/test_live_generation.cjs
const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function getJson(path) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: 3000,
        path: path,
        method: 'GET',
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🚀 TESTING ATOMIC APEX STUDIO LIVE MODELS (PORT 3000)');
  console.log('====================================================\n');

  const modelsToTest = [
    // Image Models
    { id: 'apex-vision', type: 'image', prompt: 'Cyberpunk street in rain' },
    { id: 'apex-ultra-v2', type: 'image', prompt: 'Neon portrait of cyber model' },
    { id: 'flux-pro-studio', type: 'image', prompt: 'Modern minimalist luxury villa' },
    { id: 'photoreal-v3', type: 'image', prompt: 'Vintage 35mm film photography of mountains' },

    // Original Video Models
    { id: 'swift-v1', type: 'video', prompt: 'Drone shot flying over ocean cliffs' },
    { id: 'studio-v1', type: 'video', prompt: 'Cinematic tracking shot in Tokyo' },
    { id: 'kling-4-0', type: 'video', prompt: 'Slow motion fragrance bottle shattering' },

    // NEW GEN UNLIMITED CLOUD MODELS
    { id: 'wan-2-1', type: 'video', prompt: 'Hypercar drifting in neon lights', provider: 'Wan-AI / Alibaba Cloud' },
    { id: 'ltx-video', type: 'video', prompt: 'Eagle soaring through canyon', provider: 'Lightricks Cloud' },
    { id: 'cogvideox-5b', type: 'video', prompt: 'Interstellar spaceship hyperspace', provider: 'THUDM / Zhipu AI Cloud' },
  ];

  let passed = 0;
  let failed = 0;

  for (const item of modelsToTest) {
    process.stdout.write(`Testing [${item.type.toUpperCase()}] model: ${item.id.padEnd(16)} ... `);
    try {
      const res = await postJson('/api/generate', {
        model: item.id,
        prompt: item.prompt,
        aspectRatio: '16:9',
        duration: '10s',
      });

      if (res.status === 200 && (res.body.resultUrl || res.body.jobId)) {
        if (item.type === 'video' && res.body.jobId) {
          // Poll video status
          await new Promise((r) => setTimeout(r, 700));
          const pollRes = await getJson(`/api/generations/${res.body.jobId}`);
          if (pollRes.status === 200 && pollRes.body.status) {
            console.log(`✅ OK (Job: ${res.body.jobId}, Cost: ${res.body.cost} creds)`);
            passed++;
          } else {
            console.log(`❌ Poll Failed (${pollRes.status})`);
            failed++;
          }
        } else {
          console.log(`✅ OK (Output: ${res.body.resultUrl?.substring(0, 45)}...)`);
          passed++;
        }
      } else {
        console.log(`❌ ERROR ${res.status}: ${JSON.stringify(res.body)}`);
        failed++;
      }
    } catch (e) {
      console.log(`❌ FAILED: ${e.message}`);
      failed++;
    }
  }

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passed}/${modelsToTest.length} MODELS PASSED SUCCESSFULLY`);
  console.log('====================================================');
}

runTests();
