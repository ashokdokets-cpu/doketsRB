const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
c = c.split('js/currency-loader.js').join('');
fs.writeFileSync('index.html', c, 'utf8');
console.log('currency-loader references removed');
