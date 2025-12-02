/**
 * Script to add credentials: 'include' to all fetch calls in admin pages
 * This ensures httpOnly cookies are sent with API requests
 */

const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '..', 'src', 'app', 'admin');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Pattern 1: fetch('url') -> fetch('url', { credentials: 'include' })
  content = content.replace(
    /fetch\((['"`][^'"`]+['"`])\)(?!\s*,\s*\{[^}]*credentials)/g,
    (match, url) => {
      modified = true;
      return `fetch(${url}, { credentials: 'include' })`;
    }
  );

  // Pattern 2: fetch('url', { ... }) without credentials
  content = content.replace(
    /fetch\((['"`][^'"`]+['"`]),\s*\{([^}]*)\}\)/g,
    (match, url, options) => {
      if (!options.includes('credentials')) {
        modified = true;
        const trimmedOptions = options.trim();
        if (trimmedOptions) {
          return `fetch(${url}, { credentials: 'include', ${trimmedOptions} })`;
        } else {
          return `fetch(${url}, { credentials: 'include' })`;
        }
      }
      return match;
    }
  );

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Modified: ${path.relative(process.cwd(), filePath)}`);
    return true;
  }

  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (processFile(filePath)) {
        count++;
      }
    }
  }

  return count;
}

console.log('Adding credentials to fetch calls in admin pages...\n');
const modifiedCount = walkDir(adminDir);
console.log(`\n✓ Modified ${modifiedCount} file(s)`);
