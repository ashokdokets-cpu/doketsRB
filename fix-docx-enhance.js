const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Find exportDOCX and add ENHANCE sections before Packer
const oldDocx = `docx.Packer.toBlob(doc).then(function(blob) {`;
const newDocx = `// Add ENHANCE sections to DOCX
    var rd = App.resumeData;
    if (rd && rd.myTime && rd.myTime.length > 0) {
      doc.addSection({
        children: [
          new docx.Paragraph({ children: [new docx.TextRun({ text: 'MY TIME', bold: true, size: 22, color: '2B579A' })], spacing: { after: 10 } })
        ].concat(rd.myTime.filter(function(i){return i.activity && i.percentage > 0;}).map(function(item) {
          return new docx.Paragraph({ children: [new docx.TextRun({ text: item.activity + ': ' + item.percentage + '%', size: 20 })], spacing: { after: 5 } });
        }))
      });
    }
    if (rd && rd.strengths && rd.strengths.length > 0) {
      doc.addSection({
        children: [
          new docx.Paragraph({ children: [new docx.TextRun({ text: 'STRENGTHS', bold: true, size: 22, color: '2B579A' })], spacing: { after: 10 } }),
          new docx.Paragraph({ children: [new docx.TextRun({ text: rd.strengths.join(', '), size: 20 })], spacing: { after: 10 } })
        ]
      });
    }
    if (rd && rd.philosophy) {
      doc.addSection({
        children: [
          new docx.Paragraph({ children: [new docx.TextRun({ text: 'PHILOSOPHY', bold: true, size: 22, color: '2B579A' })], spacing: { after: 10 } }),
          new docx.Paragraph({ children: [new docx.TextRun({ text: '"' + rd.philosophy + '"', italics: true, size: 20 })], spacing: { after: 10 } })
        ]
      });
    }
    if (rd && rd.books && rd.books.length > 0) {
      doc.addSection({
        children: [
          new docx.Paragraph({ children: [new docx.TextRun({ text: 'BOOKS & INFLUENCES', bold: true, size: 22, color: '2B579A' })], spacing: { after: 10 } })
        ].concat(rd.books.filter(function(b){return b.title;}).map(function(b) {
          return new docx.Paragraph({ children: [new docx.TextRun({ text: b.title + (b.author ? ' - ' + b.author : ''), size: 20 })], spacing: { after: 5 } });
        }))
      });
    }
    
    docx.Packer.toBlob(doc).then(function(blob) {`;

if (c.includes(oldDocx)) {
    c = c.replace(oldDocx, newDocx);
    fs.writeFileSync('index.html', c, 'utf8');
    console.log('SUCCESS: DOCX export now includes ENHANCE sections!');
} else {
    console.log('DOCX pattern not found');
}
