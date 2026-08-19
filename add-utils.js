var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// 1. Add loader/toast CSS before </style>
var css = `
.loader-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center}
.loader-spinner{width:48px;height:48px;border:4px solid #f3f3f3;border-top:4px solid #2563eb;border-radius:50%;animation:spin 1s linear infinite}
@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
.toast{position:fixed;top:20px;right:20px;z-index:10000;padding:14px 20px;border-radius:12px;color:white;font-weight:600;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,0.3);animation:slideIn 0.3s ease-out;max-width:380px}
.toast.success{background:#10b981}.toast.error{background:#ef4444}
@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
`;
html = html.replace('</style>', css + '\n</style>');

// 2. Add utility functions before function navigate(view)
var utils = `
function showLoader(){var e=document.getElementById('global-loader');if(!e){e=document.createElement('div');e.id='global-loader';e.className='loader-overlay';e.innerHTML='<div class="loader-spinner"></div>';document.body.appendChild(e)}}
function hideLoader(){var e=document.getElementById('global-loader');if(e)e.remove()}
function showSuccess(m){var t=document.createElement('div');t.className='toast success';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},4000)}
function showError(m){var t=document.createElement('div');t.className='toast error';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove()},5000)}
async function saveToCloud(){if(!currentUser||!sbClient)return;try{await sbClient.from('resumes').upsert({user_id:currentUser.id,title:(App.resumeData.personal.fullName||'Untitled')+' Resume',resume_data:App.resumeData,template:App.selectedTemplate,updated_at:new Date().toISOString()},{onConflict:'user_id'})}catch(e){}}
async function loadFromCloud(){if(!currentUser||!sbClient)return false;try{var r=await sbClient.from('resumes').select('*').eq('user_id',currentUser.id).order('updated_at',{ascending:false}).limit(1).single();if(r.data&&r.data.resume_data){App.resumeData=r.data.resume_data;saveToStorage();return true}}catch(e){}return false}
function generateReceipt(a,b,c,d,e){var w=window.open('','Receipt','width=650,height=700');w.document.write('<div style="max-width:500px;margin:20px auto;padding:20px;border:2px solid #2563eb;border-radius:10px;font-family:Arial"><h1 style="color:#2563eb">ResumeAI Pro</h1><h2>Payment Receipt</h2><p><b>Receipt:</b> '+a+'</p><p><b>Date:</b> '+new Date().toLocaleDateString()+'</p><p><b>Plan:</b> '+b.toUpperCase()+'</p><p><b>Amount:</b> '+(c/100).toFixed(2)+' '+d+'</p><p><b>Method:</b> '+(e||'Online')+'</p><p style="color:green;font-weight:bold">Status: PAID</p><script>setTimeout(function(){print()},500)<\\/script></div>');w.document.close()}
`;
html = html.replace('\n    function navigate(view){', utils + '\n    function navigate(view){');

// 3. Add saveToCloud call to saveToStorage
html = html.replace("localStorage.setItem('resumeai_pro_data', JSON.stringify(data));",
    "localStorage.setItem('resumeai_pro_data', JSON.stringify(data)); setTimeout(function(){saveToCloud()}, 500);");

// 4. Load from cloud after login
html = html.replace("currentUser = data.user;\n        await loadUserProfile();",
    "currentUser = data.user;\n        await loadUserProfile();\n        await loadFromCloud();");

// 5. Add receipt to Razorpay success
html = html.replace('alert(`âœ… Payment Verified!', 'showSuccess("Payment successful!"); generateReceipt(paymentId, plan, selectedPlan.amount, currency, "Razorpay"); alert(`âœ… Payment Verified!');

// 6. Add receipt to PayPal success
html = html.replace("alert('âœ… Paid via PayPal!')", "showSuccess('Payment successful!'); generateReceipt(paymentId, plan, Math.round(parseFloat(price)*100), 'USD', 'PayPal'); alert('âœ… Paid via PayPal!')");

// 7. Add email verification check after login
html = html.replace("alert('âœ… Welcome back!');",
    "showSuccess('Welcome back!'); checkEmailVerification(); alert('âœ… Welcome back!');");

// 8. Add email verification functions
var emailFn = `
var emailFn = `
async function checkEmailVerification(){if(typeof GUEST_MODE!=="undefined"&&GUEST_MODE)return;if(!currentUser||!sbClient)return;try{var r=await sbClient.auth.getUser();if(r.data.user&&!r.data.user.email_confirmed_at){var b=document.getElementById("email-verify-banner");if(b)b.style.display="block"}}catch(e){}}
`;
html = html.replace('async function handleSignup() {', emailFn + '\nasync function handleSignup() {');

// 9. Add email banner HTML
var banner = `
<div id="email-verify-banner" style="display:none;background:#fef3c7;border-bottom:2px solid #f59e0b;padding:12px 20px;text-align:center;position:fixed;top:64px;left:0;right:0;z-index:49;">
    <span style="font-weight:600;color:#92400e;">âš ï¸ Please verify your email address.</span>
    <button onclick="resendVerificationEmail()" style="margin-left:12px;background:#f59e0b;color:white;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;">Resend Email</button>
    <button onclick="this.parentElement.style.display='none'" style="margin-left:8px;background:transparent;border:none;color:#92400e;cursor:pointer;font-size:16px;">Ã—</button>
</div>
`;
html = html.replace('<div id="app" role="application"', banner + '\n    <div id="app" role="application"');

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('âœ… Features 1-4 added: Loader, Toasts, Cloud Save, Email Verify, Receipt');
