var fs = require('fs');
var path = require('path');
var htmlPath = path.join(__dirname, 'index.html');
var html = fs.readFileSync(htmlPath, 'utf8');

// INSERT saveToCloud + loadFromCloud before saveToStorage
var cloudFn = `async function saveToCloud() {
    if (!currentUser || !sbClient) return;
    try { await sbClient.from('resumes').upsert({ user_id: currentUser.id, resume_data: App.resumeData, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }); } catch(e) {}
}
async function loadFromCloud() {
    if (!currentUser || !sbClient) return false;
    try { var r = await sbClient.from('resumes').select('*').eq('user_id', currentUser.id).order('updated_at', { ascending: false }).limit(1).single(); if (r.data && r.data.resume_data) { App.resumeData = r.data.resume_data; saveToStorage(); return true; } } catch(e) {}
    return false;
}
`;
html = html.replace('function saveToStorage() {', cloudFn + 'function saveToStorage() {');
html = html.replace("localStorage.setItem('resumeai_pro_data', JSON.stringify(data));", "localStorage.setItem('resumeai_pro_data', JSON.stringify(data)); setTimeout(function(){saveToCloud();}, 500);");
html = html.replace("currentUser = data.user;\n            await loadUserProfile();", "currentUser = data.user;\n            await loadUserProfile();\n            await loadFromCloud();");

// INSERT generateReceipt before initiateRazorpayPayment
var receiptFn = `function generateReceipt(paymentId, plan, amount, currency, method) {
    var w = window.open('', 'Receipt', 'width=650,height=700');
    w.document.write('<h2>ResumeAI Pro - Receipt</h2><p>Receipt: ' + paymentId + '</p><p>Plan: ' + plan.toUpperCase() + '</p><p>Amount: ' + (amount/100).toFixed(2) + ' ' + currency + '</p><p>Method: ' + (method||'Online') + '</p><p style=\"color:green;font-weight:bold\">Status: PAID</p><script>setTimeout(function(){print();},500)<' + '/script>');
    w.document.close();
}
`;
html = html.replace('function initiateRazorpayPayment(plan) {', receiptFn + 'function initiateRazorpayPayment(plan) {');
html = html.replace("alert('Payment verified!'); loadUserProfile(); navigate('dashboard');", "showSuccess('Payment successful!'); loadUserProfile(); generateReceipt(response.razorpay_payment_id, plan, data.amount, data.currency, 'Razorpay'); navigate('dashboard');");

fs.writeFileSync(htmlPath, html, 'utf8');
console.log('✅ Cloud save + Receipt added to index.html');