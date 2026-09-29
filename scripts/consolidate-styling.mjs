import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src');

const colorMap = {
  '#0A1628': 'navy',
  '#0F1D32': 'navy-light',
  '#1E293B': 'navy-mid',
  '#334155': 'navy-border',
  '#D4A843': 'gold',
  '#E8C96A': 'gold-light',
  '#4F46E5': 'indigo',
  '#6366F1': 'indigo-light',
  '#F1F5F9': 'primary',
  '#94A3B8': 'secondary',
  '#64748B': 'muted',
  '#10B981': 'success',
  '#F59E0B': 'warning',
  '#F43F5E': 'error',
  '#3B82F6': 'info',
};

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.tsx') || dirPath.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  });
}

let filesUpdated = 0;

walkDir(SRC_DIR, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const [hex, name] of Object.entries(colorMap)) {
    // Escape hex for regex, replace any -[#HEX] with -name
    // Case insensitive matching for hex codes
    const hexWithoutHash = hex.substring(1);
    const regexStr = `-\\[#${hexWithoutHash}\\]`;
    const regex = new RegExp(regexStr, 'gi');
    content = content.replace(regex, `-${name}`);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesUpdated++;
    console.log(`Updated ${filePath}`);
  }
});

console.log(`Finished. Updated ${filesUpdated} files.`);
