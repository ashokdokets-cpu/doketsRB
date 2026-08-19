var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// ============================================
// 1. ADD SUBSCRIPTION VIEW (before Views['forgot-password'])
// ============================================
var subView = `
Views['subscription']=function(){if(!currentUser)return'<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><button onclick="navigate(\'login\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';var p=userProfile?(userProfile.plan||'free'):'free';var ex=userProfile&&userProfile.plan_expires_at?new Date(userProfile.plan_expires_at).toLocaleDateString():'N/A';var h='<div class="max-w-2xl mx-auto px-4 py-8 animate-fade-in"><h1 class="text-2xl font-heading font-extrabold mb-6">💳 Subscription</h1><div class="bg-white rounded-xl p-6 border shadow-sm mb-4"><h3 class="font-bold text-lg">Current Plan: <span class="text-brand-600">'+p.toUpperCase()+'</span></h3><p class="text-sm text-gray-500 mt-1">Expires: '+ex+'</p></div>';if(p!=='free'&&p!=='lifetime')h+='<div class="bg-white rounded-xl p-6 border shadow-sm"><button onclick="cancelSubscription()" class="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-sm mr-2">Cancel Auto-Renewal</button><button onclick="navigate(\'pricing\')" class="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold text-sm">Upgrade Plan</button></div>';else if(p==='free')h+='<div class="bg-white rounded-xl p-6 border shadow-sm"><button onclick="navigate(\'pricing\')" class="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold text-sm">Upgrade Now</button></div>';else h+='<div class="bg-white rounded-xl p-6 border shadow-sm"><p class="text-green-600 font-bold">🎉 Lifetime plan — no expiry!</p></div>';h+='</div>';return h;};
async function cancelSubscription(){if(!confirm('Cancel auto-renewal? Your plan stays active until expiry.'))return;showLoader();try{await sbClient.from('profiles').update({plan:'free',plan_expires_at:null}).eq('id',currentUser.id);hideLoader();showSuccess('Auto-renewal cancelled.');await loadUserProfile();navigate('subscription')}catch(e){hideLoader();showError('Failed.')}}
`;

html = html.replace("Views['forgot-password']", subView + "\nViews['forgot-password']");

// ============================================
// 2. ADD INVOICES VIEW
// ============================================
var invView = `
Views['invoices']=function(){if(!currentUser)return'<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><button onclick="navigate(\'login\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';return'<div class="max-w-3xl mx-auto px-4 py-8 animate-fade-in"><h1 class="text-2xl font-heading font-extrabold mb-4">🧾 Payment History</h1><div id="invoice-list"><p class="text-gray-500">Loading...</p></div></div>';};
async function loadInvoiceList(){if(!currentUser||!sbClient)return;var c=document.getElementById('invoice-list');if(!c)return;try{var r=await sbClient.from('payments').select('*').eq('user_id',currentUser.id).order('created_at',{ascending:false});if(!r.data||r.data.length===0){c.innerHTML='<div class="text-center py-12"><p class="text-gray-500 text-lg">No payment history.</p></div>';return}c.innerHTML=r.data.map(function(p){var s=p.status==='captured'?'✅ Paid':p.status==='failed'?'❌ Failed':'⏳ Pending';var sc=p.status==='captured'?'text-green-600':'text-red-600';return'<div class="bg-white rounded-xl p-4 border flex justify-between items-center mb-2"><div><span class="font-semibold">'+(p.plan||'N/A').toUpperCase()+'</span><span class="text-xs text-gray-500 ml-2">'+new Date(p.created_at).toLocaleDateString()+'</span></div><div><span class="font-bold">'+(p.currency==='INR'?'₹':'$')+((p.amount||0)/100).toFixed(2)+'</span><span class="'+sc+' text-sm ml-2">'+s+'</span></div></div>'}).join('')}catch(e){}}
`;

html = html.replace("Views['subscription']", invView + "\nViews['subscription']");

// ============================================
// 3. ADD DELETE BUTTON TO PROFILE (find updateProfile and add deleteAccount)
// ============================================
html = html.replace(
    "async function updateProfile(){var n=document.getElementById('profile-name').value;if(!n){showError('Name required');return}showLoader();try{await sbClient.from('profiles').update({full_name:n}).eq('id',currentUser.id);App.resumeData.personal.fullName=n;saveToStorage();hideLoader();showSuccess('Profile updated!')}catch(e){hideLoader();showError('Failed.')}}",
    "async function updateProfile(){var n=document.getElementById('profile-name').value;if(!n){showError('Name required');return}showLoader();try{await sbClient.from('profiles').update({full_name:n}).eq('id',currentUser.id);App.resumeData.personal.fullName=n;saveToStorage();hideLoader();showSuccess('Profile updated!')}catch(e){hideLoader();showError('Failed.')}}async function deleteAccount(){if(!confirm('PERMANENTLY delete your account and all data? This cannot be undone.'))return;if(!confirm('Type DELETE to confirm'))return;showLoader();try{await sbClient.from('profiles').delete().eq('id',currentUser.id);await sbClient.auth.signOut();currentUser=null;userProfile=null;hideLoader();showSuccess('Account deleted.');navigate('dashboard')}catch(e){hideLoader();showError('Failed. Contact support.')}}"
);

// Also add Delete button in profile view HTML
html = html.replace(
    "'</div></div>'",
    "'</div><div class=\"bg-white rounded-xl p-6 border shadow-sm mt-4\"><h3 class=\"font-bold text-lg mb-2 text-red-600\">Danger Zone</h3><p class=\"text-sm text-gray-500 mb-3\">Permanently delete your account and all data.</p><button onclick=\"deleteAccount()\" class=\"px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm\">Delete Account</button></div></div>'"
);

// ============================================
// 4. ADD LOGOUT + PLAN BADGE TO NAVBAR
// ============================================
var navAdd = `
                    <button onclick="navigate('subscription')" class="px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition">💳 Plan</button>
                    <button onclick="navigate('invoices')" class="px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition">🧾 Bills</button>
                    <button onclick="if(currentUser){logOut()}else{navigate('login')}" class="px-3 py-2 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition" id="logout-btn">🚪 Logout</button>
`;

html = html.replace('📊 Analytics</button>\n                </div>', '📊 Analytics</button>\n' + navAdd + '                </div>');

// ============================================
// 5. AUTO-LOAD INVOICES & PLAN BADGE
// ============================================
html = html.replace(
    "container.innerHTML = viewFn();\n            if(App.currentView==='my-resumes')setTimeout(loadResumeList,100);",
    "container.innerHTML = viewFn();\n            if(App.currentView==='my-resumes')setTimeout(loadResumeList,100);\n            if(App.currentView==='invoices')setTimeout(loadInvoiceList,100);\n            updatePlanBadge();"
);

// Plan badge function
var planBadgeFn = `
function updatePlanBadge(){var b=document.getElementById('plan-badge');var p=userProfile?(userProfile.plan||'free'):'free';if(!b){var n=document.querySelector('#navbar .flex.items-center.gap-2');if(n){b=document.createElement('span');b.id='plan-badge';b.style.cssText='font-size:10px;padding:2px 8px;border-radius:10px;font-weight:700;margin-left:4px';n.appendChild(b)}}if(b){if(p==='free'){b.textContent='FREE';b.style.background='#e5e7eb';b.style.color='#6b7280'}else if(p==='pro'){b.textContent='PRO';b.style.background='#dbeafe';b.style.color='#2563eb'}else if(p==='yearly'){b.textContent='ANNUAL';b.style.background='#ede9fe';b.style.color='#7c3aed'}else{b.textContent='LIFETIME';b.style.background='#fce7f3';b.style.color='#db2777'}}}
`;

html = html.replace('function navigate(view){', planBadgeFn + '\nfunction navigate(view){');

// Call on login
html = html.replace("currentUser = data.user;\n        await loadUserProfile();\n        await loadFromCloud();",
    "currentUser = data.user;\n        await loadUserProfile();\n        await loadFromCloud();\n        updatePlanBadge();");

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('✅ All 5 features added!');
console.log('1. Subscription page (#subscription)');
console.log('2. Invoice history (#invoices)');
console.log('3. Delete account button in profile');
console.log('4. Logout button in navbar');
console.log('5. Plan badge in navbar');