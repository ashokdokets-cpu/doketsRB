const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Rename our rd to enhanceRd in DOCX export section
const oldText = `            // Add ENHANCE sections
            var rd = App.resumeData;`;
const newText = `            // Add ENHANCE sections
            var enhanceRd = App.resumeData;`;

c = c.replace(oldText, newText);

// Replace all rd. with enhanceRd. in ENHANCE section
c = c.replace(/rd\.myTime/g, 'enhanceRd.myTime');
c = c.replace(/rd\.strengths/g, 'enhanceRd.strengths');
c = c.replace(/rd\.philosophy/g, 'enhanceRd.philosophy');
c = c.replace(/rd\.books/g, 'enhanceRd.books');

fs.writeFileSync('index.html', c, 'utf8');
console.log('SUCCESS: Renamed rd to enhanceRd in DOCX section!');
