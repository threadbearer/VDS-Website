/* eslint-disable */
const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  path.join(__dirname, '../../src/app/page.tsx'),
  path.join(__dirname, '../../src/components/landing/CandidateMatchWidget.tsx')
];

const replacements = [
  { regex: /bg-\[#0A1628\]/g, replacement: 'bg-white' },
  { regex: /bg-\[#0F1D32\]/g, replacement: 'bg-slate-50' },
  { regex: /bg-\[#1E293B\]/g, replacement: 'bg-white' },
  { regex: /bg-\[#334155\]/g, replacement: 'bg-slate-100' },
  
  { regex: /text-\[#F1F5F9\]/g, replacement: 'text-slate-900' },
  { regex: /text-white/g, replacement: 'text-slate-900' },
  { regex: /text-\[#94A3B8\]/g, replacement: 'text-slate-600' },
  { regex: /text-\[#64748B\]/g, replacement: 'text-slate-500' },
  
  { regex: /border-\[#1E293B\]/g, replacement: 'border-slate-200' },
  { regex: /border-\[#334155\]/g, replacement: 'border-slate-200' },
  
  { regex: /hover:bg-\[#334155\]/g, replacement: 'hover:bg-slate-50' },
  { regex: /hover:border-\[#334155\]/g, replacement: 'hover:border-slate-300' },
  { regex: /hover:text-white/g, replacement: 'hover:text-slate-900' },
  
  // Specific tweaks
  { regex: /bg-night-sky/g, replacement: 'bg-slate-50' },
];

for (const filePath of filesToUpdate) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    for (const rule of replacements) {
      content = content.replace(rule.regex, rule.replacement);
    }
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
}
