#!/usr/bin/env node

/**
 * =========================================================================
 * CRAFTINATOR-V2 AUTOMATED i18n SCANNER & SYNCHRONIZER
 * =========================================================================
 *
 * Capabilities:
 * 1. Automatically scans all React components & pages in `src/` for `t('key')`
 *    and `t('key', 'Default Text')` calls.
 * 2. Automatically syncs newly added keys to all 15+ language dictionaries
 *    in `src/i18n/translations.js` so no translation key is ever missing.
 * 3. Quickly scaffolds a brand-new language in one command:
 *    `node scripts/i18n-sync.js --add-lang <code > <name> <nativeName> <dir> <flag>`
 *    Example: `node scripts/i18n-sync.js --add-lang tr Turkish Türkçe ltr 🇹🇷`
 * 4. Audits translation coverage with `--check`.
 * =========================================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const translationsPath = path.join(srcDir, 'i18n', 'translations.js');

// 1. Recursive File Scanner
function scanFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanFiles(fullPath, fileList);
    } else if (
      (file.endsWith('.jsx') || file.endsWith('.js')) &&
      !fullPath.includes('translations.js')
    ) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// 2. Extract t('key') and t('key', 'default text') from source code
function extractTranslationCalls(files) {
  const keysFound = new Map(); // key -> default text
  // Matches: t('key'), t("key"), t('key', 'default'), t("key", "default")
  const tRegex = /\bt\(\s*['"]([^'"]+)['"](?:\s*,\s*['"]([^'"]+)['"])?\s*\)/g;

  for (const filePath of files) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let match;
    while ((match = tRegex.exec(content)) !== null) {
      const key = match[1].trim();
      const defaultText = match[2] ? match[2].trim() : null;

      // Ignore if key is a code param like 'lang'
      if (key === 'lang') continue;

      if (!keysFound.has(key) || (!keysFound.get(key) && defaultText)) {
        keysFound.set(key, defaultText);
      }
    }
  }

  return keysFound;
}

// 3. Humanize a key if no default text was provided
function humanizeKey(key) {
  return key
    .replace(/^[a-z]+_/, '') // strip common prefixes like nav_, shop_, etc.
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

// 4. Main Sync & CLI Runner
async function run() {
  const args = process.argv.slice(2);
  const isCheckOnly = args.includes('--check');
  const addLangIndex = args.indexOf('--add-lang');

  // Dynamically import current translations file
  const translationsModule = await import(
    `file:///${translationsPath.replace(/\\/g, '/')}`
  );
  const supportedLanguages = [...translationsModule.SUPPORTED_LANGUAGES];
  const translations = { ...translationsModule.translations };

  // Handle: Add New Language Flag
  if (addLangIndex !== -1) {
    const langCode = args[addLangIndex + 1]?.toLowerCase();
    const langName = args[addLangIndex + 2];
    const nativeName = args[addLangIndex + 3] || langName;
    const dir = args[addLangIndex + 4] === 'rtl' ? 'rtl' : 'ltr';
    const flag = args[addLangIndex + 5] || '🌐';

    if (!langCode || !langName) {
      console.error(
        '❌ Error: Please provide language parameters.\nUsage: node scripts/i18n-sync.js --add-lang <code> <name> [nativeName] [dir] [flag]'
      );
      process.exit(1);
    }

    if (supportedLanguages.some(l => l.code === langCode)) {
      console.log(`ℹ️ Language "${langCode}" already exists in SUPPORTED_LANGUAGES.`);
    } else {
      supportedLanguages.push({
        code: langCode,
        name: langName,
        nativeName,
        dir,
        flag
      });
      console.log(`✅ Added "${langName}" (${langCode}) to SUPPORTED_LANGUAGES.`);
    }

    if (!translations[langCode]) {
      // Clone all English keys as starting baseline
      translations[langCode] = { ...translations['en'] };
      console.log(
        `✅ Initialized dictionary for "${langCode}" with ${Object.keys(translations[langCode]).length} keys.`
      );
    }
  }

  // Scan codebase
  const sourceFiles = scanFiles(srcDir);
  const detectedKeys = extractTranslationCalls(sourceFiles);
  console.log(`🔍 Scanned ${sourceFiles.length} source files in src/`);
  console.log(`🔑 Total active t(...) keys detected: ${detectedKeys.size}\n`);

  let addedCount = 0;
  const missingReport = {};

  // Verify and sync keys across all languages
  for (const lang of Object.keys(translations)) {
    missingReport[lang] = [];
    const langDict = translations[lang];

    for (const [key, defaultText] of detectedKeys.entries()) {
      if (!langDict[key]) {
        missingReport[lang].push(key);

        if (!isCheckOnly) {
          // Use provided default text, or English equivalent, or humanized key
          const fallbackValue =
            translations['en']?.[key] ||
            defaultText ||
            humanizeKey(key);
          langDict[key] = fallbackValue;
          addedCount++;
        }
      }
    }
  }

  // Reporting
  let hasMissing = false;
  for (const [lang, missingKeys] of Object.entries(missingReport)) {
    if (missingKeys.length > 0) {
      hasMissing = true;
      console.log(`⚠️ Language [${lang}] missing ${missingKeys.length} keys:`);
      console.log(`   ${missingKeys.slice(0, 5).join(', ')}${missingKeys.length > 5 ? ' ...' : ''}`);
    }
  }

  if (!hasMissing) {
    console.log('🎉 All languages are 100% in sync with the codebase!');
  } else if (isCheckOnly) {
    console.log('\n💡 Run `npm run i18n:sync` to automatically sync all missing keys into translations.js');
    process.exit(0);
  }

  // Write updated file if changes occurred
  if (!isCheckOnly && (addedCount > 0 || addLangIndex !== -1)) {
    const outputContent = `export const SUPPORTED_LANGUAGES = ${JSON.stringify(
      supportedLanguages,
      null,
      2
    )};\n\nexport const translations = ${JSON.stringify(
      translations,
      null,
      2
    )};\n`;

    fs.writeFileSync(translationsPath, outputContent, 'utf-8');
    console.log(`\n💾 Successfully updated translations.js! Auto-added ${addedCount} missing translation entries.`);
  }
}

run().catch(err => {
  console.error('❌ Failed to run i18n sync script:', err);
  process.exit(1);
});
