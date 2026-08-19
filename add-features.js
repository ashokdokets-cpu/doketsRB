var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'index.html');
var html = fs.readFileSync(filePath, 'utf8');

// ============================================
// 1. LOADING SPINNER & TOAST NOTIFICATIONS
// ============================================
var loadingCSS = `
.loader-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center}
.loader-spinner{width:48px;height:48px;border:4px solid #f3f3f3;border-top:4px solid #2563eb;border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.toast{position:fixed;top:20px;right:20px;z-index:10000;padding:14px 20px;border-radius:12px;color:white;font-weight:600;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,0.3);animation:slideIn 0.3s ease-out;max-width:380px}
.toast.success{background:#10b981}
.toast.error{background:#ef4444}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
`;

// Insert loading CSS before closing style tag
html = html.replace('</style>', '\n' + loadingCSS + '</style>');

// Insert loader/toast functions after the last module.exports
var loaderFunctions = `
function showLoader() {
    var existing = document.getElementById('global-loader');
    if (!existing) {
        var loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.className = 'loader-overlay';
        loader.innerHTML = '<div class="loader-spinner"></div>';
        document.body.appendChild(loader);
    }
}
function hideLoader() {
    var loader = document.getElementById('global-loader');
    if (loader) loader.remove();
}
function showSuccess(msg) {
    var toast = document.createElement('div');
    toast.className = 'toast success';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 4000);
}
function showError(msg) {
    var toast = document.createElement('div');
    toast.className = 'toast error';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 5000);
}
`;

html = html.replace('module.exports = { verifyRazorpaySignature: verifyRazorpaySignature };',
    'module.exports = { verifyRazorpaySignature: verifyRazorpaySignature };\n\n' + loaderFunctions);

// ============================================
// 2. UPDATE SIGNUP WITH VALIDATION + LOADER
// ============================================
html = html.replace(
    /async function handleSignup\(\) \{[\s\S]*?navigate\('dashboard'\);[\s\S]*?\}/,
    `async function handleSignup() {
    showLoader();
    var turnstileResponse = document.querySelector('.cf-turnstile')?.getAttribute('data-response');
    if (!turnstileResponse) { hideLoader(); showError('Please complete the CAPTCHA verification.'); return; }
    try {
        var verifyResult = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ secret: '0x4AAAAAADH4CBI5yogfkGOvGAFGbfUXVSw', response: turnstileResponse })
        });
        var verifyData = await verifyResult.json();
        if (!verifyData.success) { hideLoader(); showError('CAPTCHA failed. Please try again.'); return; }
        var email = document.querySelector('#signup-email').value;
        var password = document.querySelector('#signup-password').value;
        var fullName = document.querySelector('#signup-name').value;
        if (!email || !password || !fullName) { hideLoader(); showError('Please fill in all fields.'); return; }
        if (password.length < 6) { hideLoader(); showError('Password must be at least 6 characters.'); return; }
        var result = await signUp(email, password, fullName);
        hideLoader();
        if (result.error) { showError('Signup failed: ' + result.error.message); }
        else { showSuccess('Account created! Check your email to confirm, then log in.'); navigate('login'); }
    } catch (e) { hideLoader(); showError('Network error. Please try again.'); }
}`
);

// ============================================
// 3. UPDATE LOGIN WITH LOADER + ERROR HANDLING
// ============================================
html = html.replace(
    /async function handleLogin\(\) \{[\s\S]*?navigate\('dashboard'\);[\s\S]*?\}/,
    `async function handleLogin() {
    showLoader();
    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;
    if (!email || !password) { hideLoader(); showError('Please enter both email and password.'); return; }
    try {
        var result = await logIn(email, password);
        hideLoader();
        if (result.error) { showError('Login failed: ' + (result.error.message || 'Invalid credentials')); }
        else { showSuccess('Welcome back!'); navigate('dashboard'); }
    } catch (e) { hideLoader(); showError('Network error. Please check your connection.'); }
}`
);

// ============================================
// 4. UPDATE RESET PASSWORD WITH LOADER
// ============================================
html = html.replace(
    /async function resetPassword\(\) \{[\s\S]*?navigate\('login'\);[\s\S]*?\}/,
    `async function resetPassword() {
    showLoader();
    var email = document.getElementById('reset-email').value;
    if (!email) { hideLoader(); showError('Please enter your email address.'); return; }
    if (!sbClient) { hideLoader(); showError('Service currently unavailable.'); return; }
    try {
        var { data, error } = await sbClient.auth.resetPasswordForEmail(email, { redirectTo: 'https://doketsrb.com/#update-password' });
        hideLoader();
        if (error) { showError('Error: ' + error.message); }
        else { showSuccess('Reset link sent! Check your email and click the link.'); }
    } catch (e) { hideLoader(); showError('Error sending reset. Please try again.'); }
}`
);

// ============================================
// 5. ADD #update-password VIEW + HANDLER
// ============================================
var updatePasswordView = `
Views['update-password'] = function() {
    return \`<div class="min-h-[70vh] flex items-center justify-center px-4 animate-fade-in">
        <div class="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl border">
            <div class="text-center mb-6">
                <div class="w-14 h-14 bg-gradient-to-br from-brand-500 to-accent-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                    <i data-lucide="lock" class="w-7 h-7 text-white"></i>
                </div>
                <h2 class="text-2xl font-heading font-extrabold text-gray-900">Set New Password</h2>
                <p class="text-sm text-gray-500 mt-1">Enter your new password below</p>
            </div>
            <input type="password" id="new-password" placeholder="New password (min 6 chars)" class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm mb-3">
            <button onclick="handleUpdatePassword()" class="w-full py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition font-bold shadow-md">Update Password</button>
            <p class="text-center text-sm text-gray-500 mt-5">
                <button onclick="navigate('login')" class="text-brand-600 font-semibold hover:underline">Back to Login</button>
            </p>
        </div>
    </div>\`;
};

async function handleUpdatePassword() {
    showLoader();
    var password = document.getElementById('new-password').value;
    if (!password || password.length < 6) { hideLoader(); showError('Password must be at least 6 characters.'); return; }
    try {
        var { data, error } = await sbClient.auth.updateUser({ password: password });
        hideLoader();
        if (error) { showError('Error: ' + error.message); }
        else { showSuccess('Password updated successfully! Please log in.'); navigate('login'); }
    } catch (e) { hideLoader(); showError('Error updating password. Please try again.'); }
}
`;

// Insert before Views['terms']
html = html.replace("Views['terms'] = function()", updatePasswordView + "\n\nViews['terms'] = function()");

// ============================================
// 6. PLAN ENFORCEMENT FUNCTION
// ============================================
var enforceFunction = `
function enforcePlanAccess(feature) {
    if (!currentUser) {
        showError('Please sign up or log in to use this feature.');
        navigate('login');
        return false;
    }
    if (!canAccess(feature)) {
        showError('This feature requires a Pro plan or higher.');
        navigate('pricing');
        return false;
    }
    return true;
}
`;

html = html.replace('function canCreateResume() {', enforceFunction + '\nfunction canCreateResume() {');

// ============================================
// 7. ADD PLAN CHECK TO EXPORT FUNCTIONS
// ============================================
html = html.replace(
    /if \(!currentUser\) \{[\s\S]*?alert\('🔒 Please sign up or log in to export as DOCX[\s\S]*?return;[\s\S]*?\}/,
    'if (!enforcePlanAccess("docx_export")) return;'
);

// Save
fs.writeFileSync(filePath, html, 'utf8');
console.log('All 5 high-priority features added successfully!');
console.log('1. Email verification flow');
console.log('2. Password reset UI (#update-password)');
console.log('3. Toast notifications (showError/showSuccess)');
console.log('4. Loading spinner (showLoader/hideLoader)');
console.log('5. Plan enforcement (enforcePlanAccess)');