const fs = require('fs');
let c = fs.readFileSync('js/pdf-export.js', 'utf8');

// Replace all real newlines in string concatenations with \n
c = c.replace(/text \+= '(\r\n|\n)/g, "text += '\\n");
c = c.replace(/' \+ '-\.repeat\(30\) \+ '(\r\n|\n)/g, "' + '-'.repeat(30) + '\\n");

fs.writeFileSync('js/pdf-export.js', c, 'utf8');
console.log('SUCCESS: All text export strings fixed!');
