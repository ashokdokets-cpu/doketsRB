const fs = require('fs');
let c = fs.readFileSync('js/extra-examples.js', 'utf8');

const oldCode = `injectExtraExamples() {
    var grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');`;

const newCode = `injectExtraExamples() {
    // ONLY inject on Resume Examples page
    if (window.location.hash !== '#resume-examples') { return; }
    
    var grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');`;

if (c.includes(oldCode)) {
    c = c.replace(oldCode, newCode);
    fs.writeFileSync('js/extra-examples.js', c, 'utf8');
    console.log('SUCCESS: Page check added!');
} else {
    console.log('Still not found');
}
