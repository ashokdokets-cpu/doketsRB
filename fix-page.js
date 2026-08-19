const fs = require('fs');
let c = fs.readFileSync('js/extra-examples.js', 'utf8');

// Add page check - only inject on resume-examples page
const oldCheck = `function injectExtraExamples() {
    var grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
    if (!grid) { setTimeout(injectExtraExamples, 500); return; }`;

const newCheck = `function injectExtraExamples() {
    // ONLY inject on Resume Examples page
    if (window.location.hash !== '#resume-examples') { return; }
    
    var grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
    if (!grid) { setTimeout(injectExtraExamples, 500); return; }`;

if (c.includes(oldCheck)) {
    c = c.replace(oldCheck, newCheck);
    fs.writeFileSync('js/extra-examples.js', c, 'utf8');
    console.log('SUCCESS: Extra examples now ONLY show on Resume Examples page!');
} else {
    console.log('Pattern not found');
}
