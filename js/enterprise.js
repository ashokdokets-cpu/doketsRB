// Enterprise Landing Page
if (typeof Views !== 'undefined') {
  Views['enterprise'] = function() {
    return `
    <div class="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div class="text-center mb-12">
        <h1 class="text-3xl sm:text-4xl font-heading font-extrabold mb-4">Dokets Enterprise Suite</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">Everything your organization needs to streamline resume building, candidate screening, and career development — all in one platform.</p>
        <div class="flex flex-wrap justify-center gap-3 mt-6">
          <a href="mailto:contact@dokets.com?subject=Enterprise%20Demo%20Request" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold text-lg shadow-md">Book a Demo</a>
          <a href="/#pricing" onclick="navigate('pricing')" class="px-6 py-3 bg-white border-2 border-brand-600 text-brand-600 rounded-xl font-bold text-lg">View Pricing</a>
        </div>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">🔌</div>
          <h3 class="font-bold text-lg mb-2">API Access</h3>
          <p class="text-sm text-gray-600">Integrate resume parsing, AI tailoring, and ATS scoring into your own applications. 50K API calls/month included.</p>
          <code class="bg-gray-100 px-3 py-1 rounded text-xs mt-3 block">POST /api/v1</code>
        </div>
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">🔐</div>
          <h3 class="font-bold text-lg mb-2">SSO Integration</h3>
          <p class="text-sm text-gray-600">Single Sign-On with Google Workspace, Microsoft 365, or SAML 2.0. Your team uses their existing credentials.</p>
        </div>
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">🎨</div>
          <h3 class="font-bold text-lg mb-2">White-Label Branding</h3>
          <p class="text-sm text-gray-600">Custom logo, colors, domain, and CSS. Your candidates see your brand, not ours.</p>
        </div>
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">🔄</div>
          <h3 class="font-bold text-lg mb-2">Batch Processing</h3>
          <p class="text-sm text-gray-600">Process up to 50 resumes in a single API call. Perfect for recruitment agencies and HR teams.</p>
        </div>
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">📊</div>
          <h3 class="font-bold text-lg mb-2">Usage Analytics</h3>
          <p class="text-sm text-gray-600">Track API usage, resume volumes, and team activity from a single dashboard.</p>
        </div>
        <div class="bg-white rounded-xl p-6 border shadow-sm">
          <div class="text-3xl mb-3">👥</div>
          <h3 class="font-bold text-lg mb-2">Team Dashboard</h3>
          <p class="text-sm text-gray-600">Manage candidate resumes, track application status, and collaborate with your hiring team.</p>
        </div>
      </div>

      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
        <h2 class="text-2xl font-bold mb-4">Ready to Transform Your Hiring Process?</h2>
        <p class="text-lg opacity-90 mb-6">Join organizations already using Dokets Enterprise Suite.</p>
        <div class="flex flex-wrap justify-center gap-3">
          <a href="mailto:contact@dokets.com?subject=Enterprise%20Demo%20Request" class="px-6 py-3 bg-white text-brand-600 rounded-xl font-bold text-lg">Book a Demo</a>
          <a href="mailto:contact@dokets.com?subject=Enterprise%20Plan%20Inquiry" class="px-6 py-3 bg-white/20 text-white border border-white/40 rounded-xl font-bold text-lg">Contact Sales</a>
        </div>
      </div>

      <div class="mt-12 text-center">
        <h3 class="text-xl font-bold mb-4">Trusted by Organizations Worldwide</h3>
        <div class="grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div class="bg-white rounded-xl p-4 border text-center"><div class="text-2xl font-extrabold text-brand-600">50K+</div><div class="text-xs text-gray-500">API Calls/Month</div></div>
          <div class="bg-white rounded-xl p-4 border text-center"><div class="text-2xl font-extrabold text-green-600">99.9%</div><div class="text-xs text-gray-500">Uptime</div></div>
          <div class="bg-white rounded-xl p-4 border text-center"><div class="text-2xl font-extrabold text-purple-600">24/7</div><div class="text-xs text-gray-500">Support</div></div>
        </div>
      </div>
    </div>`;
  };
}