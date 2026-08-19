const fs = require('fs');
let c = fs.readFileSync('js/pdf-export.js', 'utf8');

// Fix the broken multi-line string
const broken = `    text += '\r\nMY TIME\r\n' + '-'.repeat(30) + '\r\n';`;
const fixed = `    text += '\\nMY TIME\\n' + '-'.repeat(30) + '\\n';`;

if (c.includes(broken)) {
    c = c.replace(broken, fixed);
    fs.writeFileSync('js/pdf-export.js', c, 'utf8');
    console.log('SUCCESS: Fixed broken string!');
} else {
    // Try simpler - just fix all split strings in TEXT export section
    c = c.replace(/text \+= '\r\n/g, "text += '\\n");
    c = c.replace(/'\ \+ '-\.repeat\(30\) \+ '\r\n/g, "' + '-'.repeat(30) + '\\n");
    fs.writeFileSync('js/pdf-export.js', c, 'utf8');
    console.log('SUCCESS: Fixed with regex!');
}
