/* eslint-disable */
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
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

  // Replace text-white or text-slate-900 or text-[#D4A843] specifically around "Knight Shift"
  content = content.replace(/className="(.*?)text-white(.*?)">Knight Shift<\/span>/g, 'className="$1text-[#0F1D32]$2">Knight Shift</span>');
  content = content.replace(/className="(.*?)text-slate-900(.*?)">Knight Shift<\/span>/g, 'className="$1text-[#0F1D32]$2">Knight Shift</span>');
  content = content.replace(/className="(.*?)text-\[#D4A843\](.*?)">Knight Shift<\/span>/g, 'className="$1text-[#0F1D32]$2">Knight Shift</span>');

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated logo color in ${file}`);
  }
}
