#!/usr/bin/env node
/**
 * Reads the shortnames JSON and patches products.ts.
 * Handles both initial insertion and updates of shortName, subtitle, badge.
 *
 * Run: node scripts/generate-short-names.js 2>/dev/null > /tmp/sn.json
 *      node scripts/apply-short-names.js /tmp/sn.json
 */

const fs = require('fs');
const path = require('path');

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error('Usage: node scripts/apply-short-names.js <shortnames.json>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.ts');
let src = fs.readFileSync(productsPath, 'utf8');

let patched = 0;
let missed = 0;

for (const [id, { shortName, subtitle, badge }] of Object.entries(data)) {
  const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sn = shortName.replace(/"/g, '\\"');
  const st = subtitle.replace(/"/g, '\\"');
  const bd = (badge || '').replace(/"/g, '\\"');

  // Try to match existing shortName/subtitle/badge block (update case)
  const updatePattern = new RegExp(
    `(id:\\s*"${esc}",\\s*\\n\\s*slug:\\s*"[^"]+",\\s*\\n\\s*name:\\s*"[^"]+",)\\s*\\n\\s*shortName:\\s*"[^"]*",\\s*\\n\\s*subtitle:\\s*"[^"]*",\\s*\\n(\\s*)(badge:\\s*"[^"]*",\\s*\\n)?(\\s*categoryId:)`
  );

  let match = src.match(updatePattern);
  if (match) {
    const indent = match[2];
    const replacement = `${match[1]}\n${indent}shortName: "${sn}",\n${indent}subtitle: "${st}",\n${indent}badge: "${bd}",\n${indent}categoryId:`;
    src = src.replace(updatePattern, replacement);
    patched++;
    continue;
  }

  // Try without existing badge (shortName+subtitle exist but no badge)
  const updatePattern2 = new RegExp(
    `(id:\\s*"${esc}",\\s*\\n\\s*slug:\\s*"[^"]+",\\s*\\n\\s*name:\\s*"[^"]+",)\\s*\\n\\s*shortName:\\s*"[^"]*",\\s*\\n\\s*subtitle:\\s*"[^"]*",\\s*\\n(\\s*)(categoryId:)`
  );

  match = src.match(updatePattern2);
  if (match) {
    const indent = match[2];
    const replacement = `${match[1]}\n${indent}shortName: "${sn}",\n${indent}subtitle: "${st}",\n${indent}badge: "${bd}",\n${indent}${match[3]}`;
    src = src.replace(updatePattern2, replacement);
    patched++;
    continue;
  }

  // Fresh insertion (no shortName/subtitle yet)
  const insertPattern = new RegExp(
    `(id:\\s*"${esc}",\\s*\\n\\s*slug:\\s*"[^"]+",\\s*\\n\\s*name:\\s*"[^"]+",)\\s*\\n(\\s*)(categoryId:)`
  );

  match = src.match(insertPattern);
  if (match) {
    const indent = match[2];
    const replacement = `${match[1]}\n${indent}shortName: "${sn}",\n${indent}subtitle: "${st}",\n${indent}badge: "${bd}",\n${indent}${match[3]}`;
    src = src.replace(insertPattern, replacement);
    patched++;
    continue;
  }

  console.error(`✗ Could not find product: ${id}`);
  missed++;
}

fs.writeFileSync(productsPath, src, 'utf8');
console.log(`✓ Patched ${patched} products, ${missed} missed`);
