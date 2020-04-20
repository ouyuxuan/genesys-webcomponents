#! /usr/bin/env node

const Handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');

const CDN_URL = process.env.CDN_URL || '';
console.log(`Wrapping stencil loader.`);
if (CDN_URL.length > 0) {
  console.log(`  Embedded CDN URL will be: ${CDN_URL}`);
} else {
  console.log(`  No CDN URL specified.`);
}

const templateFile = path.join(__dirname, './stencil-wrapper.ts');
const sourceOutputFolder = path.join(__dirname, '../build');
const sourceOutputFile = path.join(sourceOutputFolder, 'stencil-wrapper.ts');
const template = Handlebars.compile(fs.readFileSync(templateFile, 'utf8'));

const source = template({ cdn_url: CDN_URL });

if (!fs.existsSync(sourceOutputFolder)) {
  fs.mkdirSync(sourceOutputFolder, { recursive: true });
}
fs.writeFileSync(sourceOutputFile, source);
