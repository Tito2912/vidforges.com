import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'out');

function listFilesRecursive(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...listFilesRecursive(fullPath));
    else files.push(fullPath);
  }
  return files;
}

function stripQueryAndHash(value) {
  const q = value.indexOf('?');
  const h = value.indexOf('#');
  const cut = q === -1 ? h : h === -1 ? q : Math.min(q, h);
  return cut === -1 ? value : value.slice(0, cut);
}

function looksLikeFilePath(urlPath) {
  const base = urlPath.split('/').pop() || '';
  return base.includes('.');
}

function resolveOutPath(urlPath) {
  const normalized =
    urlPath === '/' ? '' : urlPath.startsWith('/') ? urlPath.slice(1) : urlPath;
  return path.join(OUT_DIR, normalized);
}

function fileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function checkInternalUrl(urlValue) {
  const urlPath = stripQueryAndHash(urlValue);
  if (!urlPath.startsWith('/')) return null;

  // Ignore scheme-relative URLs.
  if (urlPath.startsWith('//')) return null;

  // Static assets and generated runtime.
  if (urlPath.startsWith('/_next/')) return null;

  const outPath = resolveOutPath(urlPath);

  // 1) If it looks like a file (has extension), it must exist at that path.
  if (looksLikeFilePath(urlPath)) {
    return fileExists(outPath) ? null : { urlPath, expected: outPath };
  }

  // 2) Pretty URLs (directories).
  if (urlPath.endsWith('/')) {
    const expected = path.join(outPath, 'index.html');
    return fileExists(expected) ? null : { urlPath, expected };
  }

  // 3) Non-trailing slash: accept either a folder export or an .html export.
  const asDir = path.join(outPath, 'index.html');
  const asHtml = `${outPath}.html`;
  if (fileExists(asDir) || fileExists(asHtml)) return null;
  return { urlPath, expected: `${asDir} OR ${asHtml}` };
}

function extractUrlsFromHtml(html) {
  const urls = [];
  const attrRegex = /\s(?:href|src)=["']([^"']+)["']/gim;
  let match;
  while ((match = attrRegex.exec(html))) urls.push(match[1]);
  return urls;
}

function isSkippableUrl(value) {
  if (!value) return true;
  if (value.startsWith('#')) return true;
  if (value.startsWith('mailto:')) return true;
  if (value.startsWith('tel:')) return true;
  if (value.startsWith('javascript:')) return true;
  if (value.startsWith('data:')) return true;
  if (value.startsWith('http://') || value.startsWith('https://')) return true;
  return false;
}

if (!fileExists(OUT_DIR)) {
  console.error(`Missing build output directory: ${OUT_DIR}`);
  console.error('Run `npm run build` first.');
  process.exit(2);
}

const allFiles = listFilesRecursive(OUT_DIR);
const htmlFiles = allFiles.filter((x) => x.endsWith('.html'));

const problems = [];
let scanned = 0;

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  for (const url of extractUrlsFromHtml(html)) {
    if (isSkippableUrl(url)) continue;
    scanned += 1;
    const issue = checkInternalUrl(url);
    if (issue) problems.push({ from: path.relative(OUT_DIR, htmlFile), ...issue });
  }
}

if (problems.length) {
  console.error(`❌ Internal link check failed (${problems.length} missing, ${scanned} scanned).`);
  for (const p of problems.slice(0, 60)) {
    console.error(`- ${p.urlPath} (from ${p.from}) -> missing: ${p.expected}`);
  }
  if (problems.length > 60) console.error(`… and ${problems.length - 60} more`);
  process.exit(1);
}

console.log(`✅ Internal links OK (${scanned} scanned).`);
