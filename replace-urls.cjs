const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
};

const files = walk('./src');
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('http://localhost:5000')) {
    
    // First, define API_URL if not present
    if (!content.includes('const API_URL')) {
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const nextNewline = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, nextNewline + 1) + '\nconst API_URL = import.meta.env.VITE_API_URL || "___LOCAL_BACKEND___";\n' + content.slice(nextNewline + 1);
        } else {
            content = 'const API_URL = import.meta.env.VITE_API_URL || "___LOCAL_BACKEND___";\n\n' + content;
        }
    }
    
    // Now replace all existing occurrences
    content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${API_URL}$1`');
    content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${API_URL}$1`');
    
    // Fix href=... syntax for JSX since it would generate href=`...` instead of href={`...`}
    content = content.replace(/href=`\$\{API_URL\}([^`]*)`/g, 'href={`${API_URL}$1`}');

    // Restore the actual localhost string inside the variable declaration
    content = content.replace(/___LOCAL_BACKEND___/g, 'http://localhost:5000');
    
    fs.writeFileSync(file, content);
    changedCount++;
  }
});

console.log('Modified ' + changedCount + ' files.');
