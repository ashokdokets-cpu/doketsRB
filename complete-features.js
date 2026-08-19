var fs = require('fs');
var path = require('path');

var htmlPath = path.join(__dirname, 'index.html');
var html = fs.readFileSync(htmlPath, 'utf8');

// ============================================
// 1. FIX EXTRA } AT LINE 991-992 (syntax error)
// ============================================
html = html.replace(/    }\n    }\n\n    async function resetPassword/, '}\n\n    async function resetPassword');
html = html.replace(/}\n    }\n\n    \/\/ ====.*GDPR/, '}\n\n    // ==== GDPR');

// ============================================
// 2. EMAIL VERIFICATION ON LOGIN
// ============================================
html = html.replace(
    "if (result.error) { showError('Login failed: ' + (result.error.message || 'Invalid credentials')); }",
    "if (result.error) { if (result.error.message && result.error.message.toLowerCase().indexOf('email not confirmed') >= 0) { showError('Please confirm your email first. Check your inbox.'); } else { showError('Login failed: ' + (result.error.message || 'Invalid credentials')); } }"
);

// ============================================
// 3. CLOUD RESUME SAVE (add before saveToStorage)
// ============================================
var cloudFunctions = `
async function saveToCloud() {
    if (!currentUser || !sbClient) return;
    try {
        await sbClient.from('resumes').upsert({
            user_id: currentUser.id,
            title: (App.resumeData.personal.fullName || 'Untitled') + ' Resume',
            resume_data: App.resumeData,
            template: App.selectedTemplate,
            job_target: App.jobTarget,
            ats_score: getATSScore().total,
            job_match_score: App.jobMatch.overallScore || 0,
            composite_score: getCompositeScore(),
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });
    } catch(e) {}
}

async function loadFromCloud() {
    if (!currentUser || !sbClient) return false;
    try {
        var { data, error } = await sbClient.from('resumes')
            .select('*').eq('user_id', currentUser.id)
            .order('updated_at', { ascending: false }).limit(1).single();
        if (error || !data) return false;
        if (data.resume_data) App.resumeData = data.resume_data;
        if (data.template) App.selectedTemplate = data.template;
        if (data.job_target) App.jobTarget = data.job_target;
        saveToStorage();
        return true;
    } catch(e) { return false; }
}
`;

html = html.replace('function saveToStorage() {', cloudFunctions + '\nfunction saveToStorage() {');

// Auto-save to cloud
html = html.replace(
    "localStorage.setItem('resumeai_pro_data', JSON.stringify(data));",
    "localStorage.setItem('resumeai_pro_data', JSON.stringify(data)); setTimeout(function(){saveToCloud();}, 500);"
);

// Load from cloud on login
html = html.replace(
    'currentUser = data.user;\n            await loadUserProfile();',
    'currentUser = data.user;\n            await loadUserProfile();\n            await loadFromCloud();'
);

// ============================================
// 4. PAYMENT RECEIPT
// ============================================
var receiptFunction = `
function generateReceipt(paymentId, plan, amount, currency, method) {
    var w = window.open('', 'Receipt', 'width=650,height=700');
    var r = '<div style=\"max-width:600px;margin:20px auto;padding:30px;border:2px solid #2563eb;border-radius:12px;font-family:Arial;\">';
    r += '<div style=\"text-align:center;margin-bottom:20px;\"><h1 style=\"color:#2563eb;\">ResumeAI Pro</h1><h2>Payment Receipt</h2></div>';
    r += '<table style=\"width:100%;border-collapse:collapse;\">';
    r += '<tr><td style=\"padding:8px;border-bottom:1px solid #ddd;\"><b>Receipt #:</b></td><td style=\"padding:8px;border-bottom:1px solid #ddd;\">' + paymentId + '</td></tr>';
    r += '<tr><td style=\"padding:8px;border-bottom:1px solid #ddd;\"><b>Date:</b></td><td style=\"padding:8px;border-bottom:1px solid #ddd;\">' + new Date().toLocaleDateString() + '</td></tr>';
    r += '<tr><td style=\"padding:8px;border-bottom:1px solid #ddd;\"><b>Plan:</b></td><td style=\"padding:8px;border-bottom:1px solid #ddd;\">' + plan.toUpperCase() + '</td></tr>';
    r += '<tr><td style=\"padding:8px;border-bottom:1px solid #ddd;\"><b>Amount:</b></td><td style=\"padding:8px;border-bottom:1px solid #ddd;\">' + (currency === 'INR' ? '₹' : '$') + (amount / 100).toFixed(2) + ' ' + currency + '</td></tr>';
    r += '<tr><td style=\"padding:8px;border-bottom:1px solid #ddd;\"><b>Method:</b></td><td style=\"padding:8px;border-bottom:1px solid #ddd;\">' + (method || 'Online') + '</td></tr>';
    r += '<tr><td style=\"padding:8px;border-bottom:1px solid #ddd;\"><b>Status:</b></td><td style=\"padding:8px;border-bottom:1px solid #ddd;color:#10b981;font-weight:bold;\">PAID</td></tr></table>';
    r += '<p style=\"text-align:center;margin-top:20px;color:#666;\">Thank you for your purchase!<br>Payments secured by Razorpay</p></div>';
    w.document.write(r);
    w.document.close();
    setTimeout(function(){ w.print(); }, 500);
}
`;

html = html.replace('function initiateRazorpayPayment(plan) {', receiptFunction + '\nfunction initiateRazorpayPayment(plan) {');

// Add receipt to Razorpay success
html = html.replace(
    "if (result.success) { alert('Payment verified!'); loadUserProfile(); navigate('dashboard'); }",
    "if (result.success) { showSuccess('Payment successful!'); loadUserProfile(); generateReceipt(response.razorpay_payment_id, plan, data.amount, data.currency, 'Razorpay'); navigate('dashboard'); }"
);

// Add receipt to PayPal success
html = html.replace(
    /if \(result\.success\) \{[\s\S]*?alert\('Paid via PayPal! Plan activated\.'\);[\s\S]*?loadUserProfile\(\);[\s\S]*?navigate\('dashboard'\);/,
    "if (result.success) { showSuccess('Payment successful!'); loadUserProfile(); generateReceipt(details.id || result.payment_id, plan, parseFloat(price) * 100, 'USD', 'PayPal'); navigate('dashboard');"
);

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Frontend: index.html updated');

// ============================================
// 5. RATE LIMITING
// ============================================
var utilsPath = path.join(__dirname, 'lib', 'utils.js');
var utils = fs.readFileSync(utilsPath, 'utf8');

var rateLimitCode = `
var rateLimitMap = {};
function checkRateLimit(ip, endpoint, max, windowMs) {
    var key = ip + ':' + endpoint;
    var now = Date.now();
    if (!rateLimitMap[key] || now > rateLimitMap[key].resetAt) {
        rateLimitMap[key] = { count: 1, resetAt: now + windowMs };
        return true;
    }
    rateLimitMap[key].count++;
    return rateLimitMap[key].count <= max;
}
`;

utils = utils.replace('var crypto = require', rateLimitCode + 'var crypto = require');
utils = utils.replace(
    'module.exports = { verifyRazorpaySignature: verifyRazorpaySignature };',
    'module.exports = { verifyRazorpaySignature: verifyRazorpaySignature, checkRateLimit: checkRateLimit };'
);

fs.writeFileSync(utilsPath, utils, 'utf8');
console.log('Backend: lib/utils.js updated with rate limiting');

// Apply rate limiting to API routes
var routes = ['create-order.js', 'verify-payment.js'];
routes.forEach(function(route) {
    var routePath = path.join(__dirname, 'api', route);
    if (fs.existsSync(routePath)) {
        var content = fs.readFileSync(routePath, 'utf8');
        content = content.replace('module.exports = async function(req, res) {',
            'var { checkRateLimit } = require("../lib/utils");\nmodule.exports = async function(req, res) {');
        content = content.replace('if (req.method !== \'POST\') {',
            'var ip = req.headers[\'x-forwarded-for\'] || \'unknown\';\n    if (!checkRateLimit(ip, \'' + route.replace('.js','') + '\', 10, 60000)) {\n        return res.status(429).json({ success: false, error: \'Too many requests. Please wait.\' });\n    }\n    if (req.method !== \'POST\') {');
        fs.writeFileSync(routePath, content, 'utf8');
        console.log('Rate limiting applied to api/' + route);
    }
});

console.log('\n✅ ALL 4 FEATURES COMPLETE!');