const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (/\.(tsx?|jsx?|mjs|json|css)$/.test(file)) {
      results.push(fullPath);
    }
  });
  return results;
}

const allFiles = walk('src');
console.log('Total files checked:', allFiles.length);

let fixedCount = 0;
allFiles.forEach(file => {
  const raw = fs.readFileSync(file);
  let text = raw.toString('binary');
  // Check if contains non-ascii
  let hasNonAscii = false;
  let clean = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    if (code > 127) {
      hasNonAscii = true;
      // Convert common symbols or drop
      if (code === 0x96 || code === 0x97 || code === 0x2014 || code === 0x2013) clean += '-';
      else if (code === 0x95 || code === 0x2022) clean += '*';
      else if (code === 0x91 || code === 0x92 || code === 0x2018 || code === 0x2019) clean += "'";
      else if (code === 0x93 || code === 0x94 || code === 0x201C || code === 0x201D) clean += '"';
      else if (code === 0x2026) clean += '...';
      else clean += ' ';
    } else {
      clean += text[i];
    }
  }

  if (hasNonAscii) {
    fs.writeFileSync(file, clean, 'utf8');
    fixedCount++;
    console.log('Normalized non-ASCII in:', file);
  }
});
console.log('Fixed', fixedCount, 'files successfully.');