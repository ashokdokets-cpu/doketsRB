const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// Add missing script tags
if (!c.includes('onboarding-wizard.js')) {
    c = c.replace('<script src="js/enhance-preview.js"></script>', '<script src="js/enhance-preview.js"></script>\n<script src="js/onboarding-wizard.js"></script>\n<script src="js/push-notifications.js"></script>\n<script src="js/email-templates.js"></script>');
    fs.writeFileSync('index.html', c, 'utf8');
    console.log('SUCCESS: Missing script tags added!');
} else {
    console.log('Already present');
}
