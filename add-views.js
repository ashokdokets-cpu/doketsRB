var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// 1. ADD MY RESUMES VIEW
var myResumesView = `
Views['my-resumes'] = function() {
    if (!currentUser) return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><button onclick="navigate(\\'login\\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';
    return '<div class="max-w-6xl mx-auto px-4 py-8 animate-fade-in"><h1 class="text-2xl font-heading font-extrabold mb-4">📄 My Resumes</h1><div id="resume-list" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"><p class="text-gray-500">Loading...</p></div></div>';
};
async function loadResumeList() {
    if (!currentUser || !sbClient) return;
    var c = document.getElementById('resume-list'); if (!c) return;
    try { var r = await sbClient.from('resumes').select('*').eq('user_id', currentUser.id).order('updated_at', { ascending: false });
        if (!r.data || r.data.length === 0) { c.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500 text-lg">No saved resumes yet.</p><button onclick="navigate(\\'builder\\')" class="mt-3 px-5 py-2.5 bg-brand-600 text-white rounded-lg font-bold">Create Your First Resume</button></div>'; return; }
        c.innerHTML = r.data.map(function(d) { var s = d.composite_score || d.ats_score || 0; var cl = s >= 70 ? 'text-green-600' : s >= 40 ? 'text-amber-600' : 'text-red-600'; return '<div class="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition cursor-pointer" onclick="loadResumeById(\\'' + d.id + '\\')"><h3 class="font-bold">' + (d.title || 'Untitled') + '</h3><div class="flex items-center gap-2 mt-2"><span class="' + cl + ' font-extrabold text-xl">' + s + '%</span><span class="text-xs text-gray-500">ATS</span></div><p class="text-xs text-gray-400 mt-3">Updated: ' + new Date(d.updated_at).toLocaleDateString() + '</p></div>'; }).join('');
    } catch(e) {}
}
async function loadResumeById(id) {
    try { var r = await sbClient.from('resumes').select('*').eq('id', id).single(); if (r.data && r.data.resume_data) { App.resumeData = r.data.resume_data; if (r.data.template) App.selectedTemplate = r.data.template; saveToStorage(); showSuccess('Resume loaded!'); navigate('builder'); } else { showError('Resume not found.'); } } catch(e) { showError('Error loading.'); }
}
`;

// 2. ADD PROFILE VIEW
var profileView = `
Views['profile'] = function() {
    if (!currentUser) return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><button onclick="navigate(\\'login\\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';
    var p = userProfile ? (userProfile.plan || 'free').toUpperCase() : 'FREE';
    var pc = p === 'FREE' ? 'text-gray-500' : p === 'PRO' ? 'text-brand-600' : 'text-purple-600';
    var n = App.resumeData.personal.fullName || (userProfile && userProfile.full_name) || 'User';
    var e = currentUser.email || '';
    return '<div class="max-w-2xl mx-auto px-4 py-8 animate-fade-in"><h1 class="text-2xl font-heading font-extrabold mb-6">👤 Profile Settings</h1><div class="bg-white rounded-xl p-6 border shadow-sm mb-4"><h3 class="font-bold text-lg mb-4">Account Details</h3><div class="space-y-3"><div><label class="text-xs text-gray-500">Full Name</label><input id="profile-name" value="' + n + '" class="w-full px-3 py-2.5 border rounded-lg text-sm mt-1"></div><div><label class="text-xs text-gray-500">Email</label><input value="' + e + '" disabled class="w-full px-3 py-2.5 border rounded-lg text-sm mt-1 bg-gray-50 text-gray-500"></div><button onclick="updateProfile()" class="mt-3 px-4 py-2.5 bg-brand-600 text-white rounded-lg font-bold text-sm">Save Changes</button></div></div><div class="bg-white rounded-xl p-6 border shadow-sm mb-4"><h3 class="font-bold text-lg mb-2">Current Plan</h3><p class="text-2xl font-extrabold ' + pc + '">' + p + '</p>' + (p === 'FREE' ? '<button onclick="navigate(\\'pricing\\')" class="mt-3 px-4 py-2 bg-accent-600 text-white rounded-lg font-bold text-sm">Upgrade Now</button>' : '') + '</div><div class="bg-white rounded-xl p-6 border shadow-sm"><h3 class="font-bold text-lg mb-2 text-red-600">Danger Zone</h3><p class="text-sm text-gray-500 mb-3">Permanently delete your account.</p><button onclick="deleteAccount()" class="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm">Delete Account</button></div></div>';
};
async function updateProfile() { var n = document.getElementById('profile-name').value; if (!n) { showError('Name required'); return; } showLoader(); try { await sbClient.from('profiles').update({ full_name: n }).eq('id', currentUser.id); App.resumeData.personal.fullName = n; saveToStorage(); hideLoader(); showSuccess('Profile updated!'); } catch(e) { hideLoader(); showError('Failed.'); } }
async function deleteAccount() { if (!confirm('Delete your account permanently? This cannot be undone.')) return; showLoader(); try { await sbClient.from('profiles').delete().eq('id', currentUser.id); await sbClient.auth.signOut(); currentUser = null; userProfile = null; hideLoader(); showSuccess('Account deleted.'); navigate('dashboard'); } catch(e) { hideLoader(); showError('Failed. Contact support.'); } }
`;

// 3. ADD SUBSCRIPTION VIEW
var subscriptionView = `
Views['subscription'] = function() {
    if (!currentUser) return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><button onclick="navigate(\\'login\\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';
    var p = userProfile ? (userProfile.plan || 'free') : 'free';
    var ex = userProfile && userProfile.plan_expires_at ? new Date(userProfile.plan_expires_at).toLocaleDateString() : 'N/A';
    var h = '<div class="max-w-2xl mx-auto px-4 py-8 animate-fade-in"><h1 class="text-2xl font-heading font-extrabold mb-6">💳 Subscription</h1><div class="bg-white rounded-xl p-6 border shadow-sm mb-4"><h3 class="font-bold text-lg">Current Plan: <span class="text-brand-600">' + p.toUpperCase() + '</span></h3><p class="text-sm text-gray-500 mt-1">Expires: ' + ex + '</p></div>';
    if (p !== 'free' && p !== 'lifetime') h += '<div class="bg-white rounded-xl p-6 border shadow-sm"><button onclick="cancelSubscription()" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-sm">Cancel Auto-Renewal</button></div>';
    else if (p === 'free') h += '<div class="bg-white rounded-xl p-6 border shadow-sm"><button onclick="navigate(\\'pricing\\')" class="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold text-sm">Upgrade Now</button></div>';
    h += '</div>'; return h;
};
async function cancelSubscription() { if (!confirm('Cancel auto-renewal?')) return; showLoader(); try { await sbClient.from('profiles').update({ plan: 'free' }).eq('id', currentUser.id); hideLoader(); showSuccess('Cancelled.'); await loadUserProfile(); navigate('subscription'); } catch(e) { hideLoader(); showError('Failed.'); } }
`;

// 4. ADD INVOICES VIEW
var invoicesView = `
Views['invoices'] = function() {
    if (!currentUser) return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><button onclick="navigate(\\'login\\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';
    return '<div class="max-w-3xl mx-auto px-4 py-8 animate-fade-in"><h1 class="text-2xl font-heading font-extrabold mb-4">🧾 Payment History</h1><div id="invoice-list"><p class="text-gray-500">Loading...</p></div></div>';
};
async function loadInvoiceList() {
    if (!currentUser || !sbClient) return;
    var c = document.getElementById('invoice-list'); if (!c) return;
    try { var r = await sbClient.from('payments').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
        if (!r.data || r.data.length === 0) { c.innerHTML = '<div class="text-center py-12"><p class="text-gray-500 text-lg">No payment history.</p></div>'; return; }
        c.innerHTML = r.data.map(function(p) { var st = p.status === 'captured' ? '✅ Paid' : p.status === 'failed' ? '❌ Failed' : '⏳ Pending'; var sc = p.status === 'captured' ? 'text-green-600' : 'text-red-600'; return '<div class="bg-white rounded-xl p-4 border flex justify-between items-center mb-2"><div><span class="font-semibold">' + (p.plan || 'N/A').toUpperCase() + '</span><span class="text-xs text-gray-500 ml-2">' + new Date(p.created_at).toLocaleDateString() + '</span></div><div><span class="font-bold">' + (p.currency === 'INR' ? '₹' : '$') + ((p.amount || 0)/100).toFixed(2) + '</span><span class="' + sc + ' text-sm ml-2">' + st + '</span></div></div>'; }).join('');
    } catch(e) {}
}
`;

// Insert views before Views['forgot-password']
var allViews = myResumesView + '\n\n' + profileView + '\n\n' + subscriptionView + '\n\n' + invoicesView + '\n\n';
html = html.replace("Views['forgot-password']", allViews + "Views['forgot-password']");

// Update navbar - add new buttons
html = html.replace("📊 Analytics</button>\n                </div>",
    "📊 Analytics</button>\n                    <button onclick=\"navigate('my-resumes')\" class=\"px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition\">📄 My Resumes</button>\n                    <button onclick=\"navigate('profile')\" class=\"px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition\">👤 Profile</button>\n                    <button onclick=\"navigate('subscription')\" class=\"px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition\">💳 Plan</button>\n                    <button onclick=\"navigate('invoices')\" class=\"px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition\">🧾 Bills</button>\n                </div>");

// Update mobile nav
html = html.replace("📊 Analytics</button>\n            </div>",
    "📊 Analytics</button>\n                <button onclick=\"navigate('my-resumes');closeMobileNav()\" class=\"block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-brand-50 hover:text-brand-600 transition\">📄 My Resumes</button>\n                <button onclick=\"navigate('profile');closeMobileNav()\" class=\"block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-brand-50 hover:text-brand-600 transition\">👤 Profile</button>\n                <button onclick=\"navigate('subscription');closeMobileNav()\" class=\"block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-brand-50 hover:text-brand-600 transition\">💳 Plan</button>\n                <button onclick=\"navigate('invoices');closeMobileNav()\" class=\"block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-brand-50 hover:text-brand-600 transition\">🧾 Bills</button>\n            </div>");

// Auto-load lists when views are shown
html = html.replace("container.innerHTML = viewFn();",
    "container.innerHTML = viewFn();\n            if (App.currentView === 'my-resumes') setTimeout(loadResumeList, 100);\n            if (App.currentView === 'invoices') setTimeout(loadInvoiceList, 100);");

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('✅ Views added: My Resumes, Profile, Subscription, Invoices');