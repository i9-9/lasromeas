#!/usr/bin/env node
/**
 * Injects filter metadata into products.ts entries.
 * Run: node scripts/generate-filters.js 2>/dev/null > /tmp/filters.json
 *      node scripts/apply-filters.js /tmp/filters.json
 */

const fs = require('fs');
const path = require('path');

const jsonPath = process.argv[2];
if (!jsonPath) { console.error('Usage: node scripts/apply-filters.js <filters.json>'); process.exit(1); }

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.ts');
let src = fs.readFileSync(productsPath, 'utf8');

// Step 1: Remove ALL existing filter lines (grainTypes, originCountries, cacaoPercents, chocolateTypes, isLimited)
src = src.replace(/^    grainTypes: \[.*?\],?\n/gm, '');
src = src.replace(/^    originCountries: \[.*?\],?\n/gm, '');
src = src.replace(/^    cacaoPercents: \[.*?\],?\n/gm, '');
src = src.replace(/^    chocolateTypes: \[.*?\],?\n/gm, '');
src = src.replace(/^    isLimited: true,?\n/gm, '');

// Step 2: Inject new filter lines before the closing `  },` of each product
let patched = 0;

for (const [id, filters] of Object.entries(data)) {
  const idIdx = src.indexOf(`id: "${id}"`);
  if (idIdx === -1) {
    console.error(`✗ Not found: ${id}`);
    continue;
  }

  // Find closing of this object (next `\n  },` or `\n  }\n]`)
  let closingIdx = src.indexOf('\n  },', idIdx);
  const altClosing = src.indexOf('\n  }\n]', idIdx);
  if (altClosing !== -1 && (closingIdx === -1 || altClosing < closingIdx)) {
    closingIdx = altClosing;
  }

  if (closingIdx === -1) continue;

  // Build filter lines
  const lines = [];
  if (filters.grainTypes) lines.push(`    grainTypes: ${JSON.stringify(filters.grainTypes)},`);
  if (filters.originCountries) lines.push(`    originCountries: ${JSON.stringify(filters.originCountries)},`);
  if (filters.cacaoPercents) lines.push(`    cacaoPercents: ${JSON.stringify(filters.cacaoPercents)},`);
  if (filters.chocolateTypes) lines.push(`    chocolateTypes: ${JSON.stringify(filters.chocolateTypes)},`);
  if (filters.isLimited) lines.push(`    isLimited: true,`);

  if (lines.length === 0) {
    patched++;
    continue;
  }

  const insertion = '\n' + lines.join('\n');
  src = src.substring(0, closingIdx) + insertion + src.substring(closingIdx);
  patched++;
}

fs.writeFileSync(productsPath, src, 'utf8');
console.log(`✓ Patched ${patched} products with filter data`);
