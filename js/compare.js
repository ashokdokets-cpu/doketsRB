// Why Dokets Page — Benefits, not feature checklist
if (typeof Views !== 'undefined') {
  Views['compare'] = function() {
    return `
    <div class="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <h1 class="text-3xl font-heading font-extrabold mb-2 text-center">Why Dokets Resume Builder?</h1>
      <p class="text-center text-gray-600 mb-8">Built differently. Engineered for results. Free to start.</p>
      
      <div class="grid sm:grid-cols-2 gap-6 mb-12">
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">🤖</div>
          <h3 class="font-bold text-lg mb-2">Multi-AI Engine</h3>
          <p class="text-sm text-gray-600">While others rely on a single AI that fails when overloaded, Dokets uses multiple AI engines with automatic fallback. Your resume is always being optimized.</p>
        </div>
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">🌍</div>
          <h3 class="font-bold text-lg mb-2">100+ Languages</h3>
          <p class="text-sm text-gray-600">Most resume builders are English-only. Dokets supports 100+ languages, making it accessible to job seekers worldwide.</p>
        </div>
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">💳</div>
          <h3 class="font-bold text-lg mb-2">7 Currencies, 2 Gateways</h3>
          <p class="text-sm text-gray-600">Pay in your local currency via Razorpay or PayPal. INR, USD, EUR, GBP, CAD, AUD, SGD — all supported.</p>
        </div>
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">📱</div>
          <h3 class="font-bold text-lg mb-2">Works Offline</h3>
          <p class="text-sm text-gray-600">Dokets is a PWA — install it on any device and build resumes even without internet. No other major resume builder offers this.</p>
        </div>
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">🏢</div>
          <h3 class="font-bold text-lg mb-2">Enterprise-Ready</h3>
          <p class="text-sm text-gray-600">API access, SSO integration, white-label branding, and batch processing. Built for organizations, not just individuals.</p>
        </div>
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">🛡️</div>
          <h3 class="font-bold text-lg mb-2">Privacy First</h3>
          <p class="text-sm text-gray-600">Password-protected sharing, encrypted storage, and no data selling. Your resume is yours — always.</p>
        </div>
      </div>
      
      <div class="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h2 class="text-2xl font-bold mb-4">52 Features. 100+ Languages. Free to Start.</h2>
        <p class="text-lg opacity-90 mb-6">Most resume builders have 15-25 features. Dokets has 52 — including tools no one else offers.</p>
        <a href="/#builder" onclick="navigate('builder')" class="inline-block px-8 py-4 bg-white text-brand-600 rounded-xl font-bold text-lg shadow-md hover:bg-gray-50 transition">Start Building Free →</a>
      </div>
    </div>`;
  };
}