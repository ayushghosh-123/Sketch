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
    } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.css')) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk('src');
console.log('Found', files.length, 'files to normalize in src/');

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Write clean UTF-8
  fs.writeFileSync(f, content, { encoding: 'utf8', flag: 'w' });
});
console.log('Successfully written pure UTF-8');
