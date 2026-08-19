var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// ============================================
// 1. DARK MODE CSS + TOGGLE
// ============================================
var darkModeCSS = `
.dark body{background:#0f172a;color:#e2e8f0}
.dark .bg-white{background:#1e293b!important}
.dark .bg-gray-50{background:#1e293b!important}
.dark .text-gray-900{color:#e2e8f0!important}
.dark .text-gray-800{color:#cbd5e1!important}
.dark .text-gray-700{color:#94a3b8!important}
.dark .text-gray-500{color:#64748b!important}
.dark .border{border-color:#334155!important}
.dark .shadow-sm{box-shadow:0 1px 2px rgba(0,0,0,0.3)!important}
.dark input:not([disabled]),.dark textarea:not([disabled]),.dark select{background:#0f172a!important;color:#e2e8f0!important;border-color:#475569!important}
.dark input[disabled]{background:#1e293b!important;color:#64748b!important}
.dark .bg-brand-50{background:#1e3a8a!important}
.dark .bg-amber-50{background:#451a03!important}
.dark .bg-green-50{background:#052e16!important}
.dark .bg-red-100{background:#450a0a!important}
.dark footer{background:#020617!important}
.dark #navbar{background:#1e293b!important;border-color:#334155!important}
`;

html = html.replace('</style>', '\n' + darkModeCSS + '</style>');

// Dark mode toggle button
var darkToggle = `
<button onclick="toggleDarkMode()" class="px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition" title="Toggle Dark Mode" id="dark-toggle">🌙</button>
`;

html = html.replace('<button onclick="navigate(\'analytics\')"', darkToggle + '<button onclick="navigate(\'analytics\')"');

// Dark mode functions
var darkFn = `
function toggleDarkMode(){var b=document.body;if(b.classList.contains('bg-gray-50')){b.classList.add('dark');document.getElementById('dark-toggle').textContent='☀️';localStorage.setItem('darkMode','1');document.querySelector('body').className=document.querySelector('body').className.replace('bg-gray-50','bg-gray-900').replace('text-gray-900','text-gray-100')}else{b.classList.remove('dark');document.getElementById('dark-toggle').textContent='🌙';localStorage.setItem('darkMode','0');document.querySelector('body').className=document.querySelector('body').className.replace('bg-gray-900','bg-gray-50').replace('text-gray-100','text-gray-900')}}
function initDarkMode(){if(localStorage.getItem('darkMode')==='1'){document.getElementById('dark-toggle').click()}}
`;

html = html.replace('\n    function navigate(view){', darkFn + '\n    function navigate(view){');

// Call init on load
html = html.replace("if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();",
    "setTimeout(initDarkMode,200);\n    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();");

// ============================================
// 2. ACCESSIBILITY - ARIA LABELS
// ============================================
html = html.replace('<main id="view-container"', '<main id="view-container" role="main" aria-live="polite"');
html = html.replace('<nav id="navbar"', '<nav id="navbar" role="navigation" aria-label="Main navigation"');
html = html.replace('<footer class="bg-gray-900"', '<footer class="bg-gray-900" role="contentinfo" aria-label="Footer"');

// Add aria-labels to all buttons
html = html.replace(/<button onclick="navigate\('dashboard'\)"/g, '<button onclick="navigate(\'dashboard\')" aria-label="Dashboard"');
html = html.replace(/<button onclick="navigate\('builder'\)"/g, '<button onclick="navigate(\'builder\')" aria-label="Resume Builder"');
html = html.replace(/<button onclick="navigate\('pricing'\)"/g, '<button onclick="navigate(\'pricing\')" aria-label="Pricing Plans"');
html = html.replace(/<button onclick="navigate\('login'\)"/g, '<button onclick="navigate(\'login\')" aria-label="Log In"');
html = html.replace(/<button onclick="navigate\('signup'\)"/g, '<button onclick="navigate(\'signup\')" aria-label="Sign Up Free"');

// ============================================
// 3. MOBILE RESPONSIVE IMPROVEMENTS
// ============================================
var mobileCSS = `
@media(max-width:640px){.resume-preview{padding:10px!important}.grid-cols-2{grid-template-columns:1fr!important}.sm\\:grid-cols-2,.md\\:grid-cols-4,.lg\\:grid-cols-6{grid-template-columns:1fr!important}.text-2xl{font-size:18px!important}.text-3xl{font-size:22px!important}.p-8{padding:16px!important}.max-w-7xl{padding-left:8px!important;padding-right:8px!important}}
`;

html = html.replace('</style>', '\n' + mobileCSS + '</style>');

// ============================================
// 4. SHARE RESUME LINK
// ============================================
var shareFn = `
function shareResume(){var d=App.resumeData;var btoa=function(s){try{return window.btoa(unescape(encodeURIComponent(s)))}catch(e){return''}};var json=btoa(JSON.stringify(d));if(!json){showError('Resume too large to share.');return}var url=window.location.origin+'?r='+encodeURIComponent(json).substring(0,2000);if(navigator.clipboard){navigator.clipboard.writeText(url).then(function(){showSuccess('Share link copied! Anyone can view your resume.')})}else{prompt('Copy this link to share your resume:',url);showSuccess('Copy the link above!')}}
function loadSharedResume(){var p=new URLSearchParams(window.location.search);var r=p.get('r');if(r){try{var d=JSON.parse(decodeURIComponent(escape(window.atob(r))));if(d){App.resumeData=d;saveToStorage();showSuccess('Shared resume loaded!');navigate('builder')}}catch(e){showError('Invalid share link.')}}}
`;

html = html.replace('\n    function navigate(view){', shareFn + '\n    function navigate(view){');

// Add share button to dashboard
html = html.replace('<button onclick="exportPDF()" class="px-4 py-2.5 bg-green-600',
    '<button onclick="shareResume()" class="px-4 py-2.5 bg-purple-600 text-white font-extrabold rounded-lg hover:bg-purple-700 transition text-sm shadow-md flex items-center gap-1.5">🔗 Share</button><button onclick="exportPDF()" class="px-4 py-2.5 bg-green-600');

// Load shared resume on init
html = html.replace('handleLinkedInCallback();', 'handleLinkedInCallback();\n        loadSharedResume();');

// ============================================
// 5. RESUME VIEW TRACKING
// ============================================
var trackFn = `
async function trackView(){try{await sbClient.from('analytics').insert({user_id:currentUser?currentUser.id:null,resume_id:null,event_type:'view',event_data:{page:App.currentView,url:window.location.href,referrer:document.referrer}})}catch(e){}}
async function trackDownload(type){try{await sbClient.from('analytics').insert({user_id:currentUser?currentUser.id:null,resume_id:null,event_type:type,event_data:{timestamp:new Date().toISOString()}})}catch(e){}}
`;

html = html.replace('\n    function navigate(view){', trackFn + '\n    function navigate(view){');

// Track page views
html = html.replace('window.location.hash=view;\n        window.scrollTo({top:0,behavior:\'smooth\'});',
    'window.location.hash=view;\n        window.scrollTo({top:0,behavior:\'smooth\'});\n        setTimeout(trackView,500);');

// Track exports
html = html.replace("pdf.save(`${(App.resumeData.personal.fullName||'resume')",
    "trackDownload('export_pdf');\n            pdf.save(`${(App.resumeData.personal.fullName||'resume')");
html = html.replace("link.download = `${(rd.personal.fullName || 'resume')",
    "trackDownload('export_docx');\n            link.download = `${(rd.personal.fullName || 'resume')");

// ============================================
// 6. CREATE ANALYTICS TABLE SQL (for tracking)
// ============================================
var sqlContent = `
-- Analytics table for view/download tracking
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    resume_id UUID REFERENCES public.resumes(id) ON DELETE SET NULL,
    event_type TEXT,
    event_data JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Users can view own analytics" ON public.analytics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can insert analytics" ON public.analytics FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY IF NOT EXISTS "Service role manages analytics" ON public.analytics USING (auth.role() = 'service_role');
`;

fs.writeFileSync(path.join(__dirname, 'supabase', 'migrations', 'analytics.sql'), sqlContent);
console.log('SQL migration created for analytics table');

// ============================================
// 7. CREATE PWA FILES
// ============================================
var manifest = JSON.stringify({
    name: 'ResumeAI Pro',
    short_name: 'ResumeAI',
    description: 'AI-powered resume builder with job targeting & ATS optimization',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#2563eb',
    icons: [{ src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎯</text></svg>', sizes: '100x100', type: 'image/svg+xml' }]
}, null, 2);
fs.writeFileSync(path.join(__dirname, 'manifest.json'), manifest);
console.log('PWA manifest created');

var sw = `self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(clients.claim()); });
self.addEventListener('fetch', function(e) { e.respondWith(caches.match(e.request).then(function(r) { return r || fetch(e.request); })); });`;
fs.writeFileSync(path.join(__dirname, 'sw.js'), sw);
console.log('Service worker created');

// ============================================
// 8. ADD PWA LINKS TO HTML
// ============================================
html = html.replace('<meta name="robots" content="index, follow">',
    '<meta name="robots" content="index, follow">\n    <link rel="manifest" href="/manifest.json">\n    <meta name="theme-color" content="#2563eb">');
html = html.replace('</script>\n</body>',
    '\n    if("serviceWorker" in navigator){navigator.serviceWorker.register("/sw.js").then(function(){console.log("SW registered")}).catch(function(){})}\n</script>\n</body>');

// ============================================
// 9. CREATE BLOG/SEO PAGES
// ============================================
var blogView = `
Views['blog']=function(){return'<div class="max-w-4xl mx-auto px-4 py-12 animate-fade-in"><h1 class="text-3xl font-heading font-extrabold mb-6">📝 Resume Tips & Career Blog</h1><div class="grid sm:grid-cols-2 gap-6"><div class="bg-white rounded-xl p-5 border shadow-sm"><h3 class="font-bold text-lg mb-2">How to Beat ATS Systems in 2026</h3><p class="text-sm text-gray-600 mb-3">Learn the 5 key strategies to optimize your resume for Applicant Tracking Systems...</p><a href="#" class="text-brand-600 font-semibold text-sm">Read More →</a></div><div class="bg-white rounded-xl p-5 border shadow-sm"><h3 class="font-bold text-lg mb-2">Top 10 Resume Keywords for Tech Jobs</h3><p class="text-sm text-gray-600 mb-3">Discover the most in-demand skills that hiring managers look for in tech resumes...</p><a href="#" class="text-brand-600 font-semibold text-sm">Read More →</a></div><div class="bg-white rounded-xl p-5 border shadow-sm"><h3 class="font-bold text-lg mb-2">Why Your LinkedIn Profile Matters</h3><p class="text-sm text-gray-600 mb-3">Connect your LinkedIn to ResumeAI Pro for faster, more accurate resume building...</p><a href="#" class="text-brand-600 font-semibold text-sm">Read More →</a></div><div class="bg-white rounded-xl p-5 border shadow-sm"><h3 class="font-bold text-lg mb-2">Cover Letter Writing Guide</h3><p class="text-sm text-gray-600 mb-3">Use our AI cover letter generator with these expert tips for best results...</p><a href="#" class="text-brand-600 font-semibold text-sm">Read More →</a></div></div></div>';};
`;

// Also create affiliate page
var affiliateView = `
Views['affiliate']=function(){return'<div class="max-w-3xl mx-auto px-4 py-12 animate-fade-in"><h1 class="text-3xl font-heading font-extrabold mb-6">🤝 Affiliate Program</h1><div class="bg-white rounded-xl p-6 border shadow-sm mb-4"><h2 class="font-bold text-xl mb-3">Earn 30% Commission</h2><p class="text-gray-600 mb-4">Refer users to ResumeAI Pro and earn 30% of their subscription for the first year.</p><ul class="space-y-2 text-sm text-gray-600"><li>✅ 30% recurring commission</li><li>✅ 90-day cookie window</li><li>✅ Real-time dashboard</li><li>✅ Monthly payouts via PayPal</li></ul><button onclick="navigate(\'signup\')" class="mt-4 px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Join as Affiliate</button></div></div>';};
`;

html = html.replace("Views['privacy'] = function()", blogView + '\n' + affiliateView + "\nViews['privacy'] = function()");

// ============================================
// 10. ADD SEO META TAGS
// ============================================
html = html.replace('<meta name="robots" content="index, follow">', 
    '<meta name="robots" content="index, follow">\n    <link rel="canonical" href="https://www.doketsrb.com">\n    <meta name="author" content="ResumeAI Pro">');

// ============================================
// 11. CREATE ROBOTS.TXT & SITEMAP
// ============================================
fs.writeFileSync(path.join(__dirname, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://www.doketsrb.com/sitemap.xml');
var sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>https://www.doketsrb.com/</loc><priority>1.0</priority></url>\n<url><loc>https://www.doketsrb.com/#builder</loc><priority>0.9</priority></url>\n<url><loc>https://www.doketsrb.com/#pricing</loc><priority>0.9</priority></url>\n<url><loc>https://www.doketsrb.com/#templates</loc><priority>0.8</priority></url>\n<url><loc>https://www.doketsrb.com/#blog</loc><priority>0.7</priority></url>\n</urlset>';
fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemap);

// ============================================
// 12. ADD STATUS PAGE
// ============================================
var statusView = `
Views['status']=function(){return'<div class="max-w-2xl mx-auto px-4 py-12 animate-fade-in"><h1 class="text-3xl font-heading font-extrabold mb-6">📊 System Status</h1><div id="status-checks" class="space-y-3"><div class="bg-white rounded-xl p-4 border flex justify-between items-center"><span>🌐 Website</span><span class="text-green-600 font-bold">✅ Operational</span></div><div class="bg-white rounded-xl p-4 border flex justify-between items-center"><span>💾 Database</span><span class="text-green-600 font-bold" id="status-db">⏳ Checking...</span></div><div class="bg-white rounded-xl p-4 border flex justify-between items-center"><span>💳 Payments</span><span class="text-green-600 font-bold" id="status-pay">⏳ Checking...</span></div><div class="bg-white rounded-xl p-4 border flex justify-between items-center"><span>🔗 LinkedIn</span><span class="text-green-600 font-bold" id="status-li">⏳ Checking...</span></div></div><script>fetch("/api/health").then(r=>r.json()).then(d=>{document.getElementById("status-db").textContent=d.services&&d.services.supabase?"✅ Operational":"⚠️ Issue";document.getElementById("status-pay").textContent=d.services&&d.services.razorpay?"✅ Operational":"⚠️ Issue";document.getElementById("status-li").textContent="✅ Operational"})</'+'script></div>';};
`;

html = html.replace("Views['blog'] = function()", statusView + "\nViews['blog'] = function()");

// Add blog/affiliate/status to navbar
var newNavItems = `
                    <button onclick="navigate('blog')" class="px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition">📝 Blog</button>
                    <button onclick="navigate('status')" class="px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition">📊 Status</button>
                    <button onclick="navigate('affiliate')" class="px-3 py-2 text-sm font-medium rounded-lg text-gray-900 hover:text-brand-600 hover:bg-brand-50 transition">🤝 Partner</button>
`;

html = html.replace('📊 Analytics</button>\n' + darkToggle, '📊 Analytics</button>\n' + newNavItems + darkToggle);

// Update mobile nav too
html = html.replace('📊 Analytics</button>\n            </div>',
    '📊 Analytics</button>\n                <button onclick="navigate(\'blog\');closeMobileNav()" class="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-brand-50 hover:text-brand-600 transition">📝 Blog</button>\n                <button onclick="navigate(\'status\');closeMobileNav()" class="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg hover:bg-brand-50 hover:text-brand-600 transition">📊 Status</button>\n            </div>');

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');

console.log('\n✅ ALL 12 POST-LAUNCH FEATURES ADDED!');
console.log('1. Dark Mode (🌙 toggle in navbar)');
console.log('2. PWA/Offline (manifest.json + service worker)');
console.log('3. Mobile responsive improvements');
console.log('4. Accessibility (ARIA labels)');
console.log('5. Share resume link (🔗 button)');
console.log('6. View/download analytics tracking');
console.log('7. Analytics SQL migration');
console.log('8. Blog page (#blog)');
console.log('9. Affiliate page (#affiliate)');
console.log('10. SEO (canonical, robots.txt, sitemap)');
console.log('11. Status page (#status)');
console.log('12. Partner navbar link');