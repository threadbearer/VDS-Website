/* eslint-disable */
const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Not available by default, I'll use recursive read

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, '../../src'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;

  // Replace bg-gradient-to-* from-[X] to-[Y] with bg-[X]
  content = content.replace(/bg-gradient-to-[a-z]+\s+from-(\[[^\]]+\]|[a-z0-9\-]+)\s+to-(\[[^\]]+\]|[a-z0-9\-]+)/g, 'bg-$1');
  
  // Replace text-transparent bg-clip-text bg-gradient-to-* from-[X] to-[Y] with text-[X]
  content = content.replace(/text-transparent\s+bg-clip-text\s+bg-gradient-to-[a-z]+\s+from-(\[[^\]]+\]|[a-z0-9\-]+)\s+to-(\[[^\]]+\]|[a-z0-9\-]+)/g, 'text-$1');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Removed gradients in ${file}`);
  }
}
