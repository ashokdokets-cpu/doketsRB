const fs = require('fs');
let c = fs.readFileSync('js/pdf-export.js', 'utf8');

// Add ENHANCE sections to TEXT export before the Blob creation
const oldText = `  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });`;
const newText = `  // Add ENHANCE sections to text export
  if (rd.myTime && rd.myTime.length > 0) {
    text += '\nMY TIME\n' + '-'.repeat(30) + '\n';
    rd.myTime.forEach(function(item) {
      if (item.activity && item.percentage > 0) {
        text += item.activity + ': ' + item.percentage + '%\n';
      }
    });
    text += '\n';
  }
  
  if (rd.strengths && rd.strengths.length > 0) {
    text += 'STRENGTHS\n' + '-'.repeat(30) + '\n';
    text += rd.strengths.join(', ') + '\n\n';
  }
  
  if (rd.philosophy) {
    text += 'PHILOSOPHY\n' + '-'.repeat(30) + '\n';
    text += '"' + rd.philosophy + '"\n\n';
  }
  
  if (rd.books && rd.books.length > 0) {
    text += 'BOOKS & INFLUENCES\n' + '-'.repeat(30) + '\n';
    rd.books.forEach(function(b) {
      if (b.title) text += b.title + (b.author ? ' - ' + b.author : '') + '\n';
    });
    text += '\n';
  }
  
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });`;

if (c.includes(oldText)) {
    c = c.replace(oldText, newText);
    fs.writeFileSync('js/pdf-export.js', c, 'utf8');
    console.log('SUCCESS: TEXT export now includes ENHANCE sections!');
} else {
    console.log('TEXT export pattern not found');
}
