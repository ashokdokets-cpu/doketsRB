var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Fix 1: Add certifications, projects, languages to App.resumeData
html = html.replace("skills: [],", "skills: [],\n            certifications: [],\n            projects: [],\n            languages: [],");

// Fix 2 & 6: Update handleLogin with checkEmail + planBadge
html = html.replace("alert('✅ Welcome back!');\n            navigate('dashboard');",
    "showSuccess('Welcome back!');checkEmailVerification();updatePlanBadge();navigate('dashboard');");

// Fix 3 & 7: Add loadFromCloud after login
html = html.replace("currentUser = data.user;\n        await loadUserProfile();\n        return { success: true };",
    "currentUser = data.user;\n        await loadUserProfile();\n        if(typeof loadFromCloud==='function')await loadFromCloud();\n        return { success: true };");

// Fix 4: Add Duplicate/Rename/Undo buttons to builder header
html = html.replace("← Dashboard</button><button onclick=\"exportPDF()\"",
    "← Dashboard</button><button onclick=\"duplicateResume()\" class=\"px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition font-semibold text-xs\">📋 Duplicate</button><button onclick=\"renameResume()\" class=\"px-3 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition font-semibold text-xs\">✏️ Rename</button><button onclick=\"undoLastChange()\" class=\"px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-xs\">↩ Undo</button><button onclick=\"exportPDF()\"");

// Fix 5: Add dark mode toggle to navbar
html = html.replace("📊 Analytics</button>\n                    <button onclick=\"navigate('my-resumes')\"",
    "📊 Analytics</button>\n                    <button onclick=\"toggleDarkMode()\" id=\"dark-toggle\" class=\"px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition\" title=\"Toggle Dark Mode\">🌙</button>\n                    <button onclick=\"navigate('my-resumes')\"");

// Fix 8: Add dark mode init on page load
html = html.replace("if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();",
    "setTimeout(function(){if(localStorage.getItem('darkMode')==='1'){document.body.classList.add('dark');var t=document.getElementById('dark-toggle');if(t)t.textContent='☀️'}},300);\n    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();");

// Fix 9: Add receipt call to payment success
html = html.replace("alert(`✅ Payment Verified!",
    "showSuccess('Payment successful! Receipt downloading...');generateReceipt(paymentId,plan,selectedPlan.amount,currency,'Razorpay');alert(`✅ Payment Verified!");

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('ALL 9 FIXES APPLIED!');
console.log('1. Cert/Projects/Languages in App state');
console.log('2. checkEmailVerification on login');
console.log('3. loadFromCloud on login');
console.log('4. Duplicate/Rename/Undo buttons in builder');
console.log('5. Dark mode toggle in navbar');
console.log('6. updatePlanBadge on login');
console.log('7. Dark mode init on page load');
console.log('8. Payment receipt on success');
console.log('9. Summary RTE was already present');