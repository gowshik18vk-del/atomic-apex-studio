// scripts/test_models.cjs
const fs = require('fs');
const path = require('path');

// Read lib/models.ts and verify all models are properly defined
const modelsTs = fs.readFileSync(path.join(__dirname, '../lib/models.ts'), 'utf8');

const expectedModels = [
  'apex-vision',
  'apex-vision-v2',
  'apex-ultra-v2',
  'seedance-2-5',
  'flux-pro-studio',
  'photoreal-v3',
  'swift-v1',
  'studio-v1',
  'range',
  'kling-4-0',
  'gemini-2-5-flash',
  'gemini-pro-vision',
  'gpt-4o-omni',
  'apex-ultra-engine',
  'atomic-ai',
];

console.log('=== VERIFYING MODEL REGISTRY COMPLETENESS ===');
let missing = 0;
for (const model of expectedModels) {
  const pattern = `'${model}':`;
  if (modelsTs.includes(pattern)) {
    console.log(`✅ Model registered: ${model}`);
  } else {
    console.error(`❌ Missing model: ${model}`);
    missing++;
  }
}

if (missing > 0) {
  console.error(`\nFAILED: ${missing} models missing.`);
  process.exit(1);
} else {
  console.log(`\nALL ${expectedModels.length} MODELS VERIFIED SUCCESSFULLY!`);
}

// Verify Native Semantic Catalog
console.log('\n=== VERIFYING NATIVE HIGH-FIDELITY SYNTHESIS ===');
const hasSemanticCatalog = modelsTs.includes('SEMANTIC_IMAGE_CATALOG');
console.log('Native Semantic Catalog engine wired:', hasSemanticCatalog ? '✅ YES' : '❌ NO');

// Verify video polling route exists
const routePath = path.join(__dirname, '../app/api/generations/[id]/route.ts');
const routeExists = fs.existsSync(routePath);
console.log('Video async polling route (/api/generations/[id]):', routeExists ? '✅ EXISTS' : '❌ MISSING');

if (!hasSemanticCatalog || !routeExists) {
  process.exit(1);
}

console.log('\n🌟 ALL SYSTEM CHECKS PASSED PERFECTLY!');
