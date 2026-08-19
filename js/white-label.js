// White-Label Theming Engine
// Applies custom branding from URL params or config

const WhiteLabel = {
  config: {
    logo: '',
    primaryColor: '#2563eb',
    secondaryColor: '#4f46e5',
    companyName: 'ResumeAI Pro',
    favicon: '',
    customCSS: '',
    hidePricing: false,
    customDomain: ''
  },

  // Load config from URL params (for demo/preview)
  loadFromURL: function() {
    var params = new URLSearchParams(window.location.search);
    if (params.get('brand')) {
      try {
        var config = JSON.parse(decodeURIComponent(params.get('brand')));
        Object.assign(this.config, config);
      } catch(e) {}
    }
    if (params.get('logo')) this.config.logo = params.get('logo');
    if (params.get('primary')) this.config.primaryColor = '#' + params.get('primary');
    if (params.get('company')) this.config.companyName = params.get('company');
  },

  // Load from localStorage (persistent config)
  loadFromStorage: function() {
    try {
      var saved = JSON.parse(localStorage.getItem('whitelabel_config'));
      if (saved) Object.assign(this.config, saved);
    } catch(e) {}
  },

  // Apply branding to the page
  apply: function() {
    var c = this.config;
    
    // Update page title
    document.title = c.companyName + ' — AI Resume Builder';
    
    // Update logo text
    var logoEl = document.querySelector('#navbar .font-extrabold.text-lg');
    if (logoEl && c.companyName) {
      logoEl.innerHTML = '<span class="text-blue-600">' + c.companyName + '</span>';
    }
    
    // Update navbar brand
    var brandEl = document.querySelector('#navbar .bg-gradient-to-br');
    if (brandEl && c.logo) {
      brandEl.innerHTML = '<img src="' + c.logo + '" style="height:24px;width:auto;">';
    }
    
    // Update favicon
    if (c.favicon) {
      var link = document.querySelector('link[rel="icon"]');
      if (link) link.href = c.favicon;
    }
    
    // Inject custom CSS
    if (c.customCSS) {
      var style = document.createElement('style');
      style.id = 'whitelabel-css';
      style.textContent = c.customCSS.replace('{primary}', c.primaryColor).replace('{secondary}', c.secondaryColor);
      document.head.appendChild(style);
    }
    
    // Apply primary color to CSS variables via inline styles
    var root = document.documentElement;
    root.style.setProperty('--brand-primary', c.primaryColor);
    root.style.setProperty('--brand-secondary', c.secondaryColor);
    
    // Update theme color meta
    var themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = c.primaryColor;
    
    // Hide pricing if configured
    if (c.hidePricing) {
      var pricingBtn = document.querySelector('[onclick*="pricing"]');
      if (pricingBtn) pricingBtn.style.display = 'none';
    }
    
    // Update manifest for PWA
    if (c.companyName) {
      var manifest = {
        name: c.companyName + ' — AI Resume Builder',
        short_name: c.companyName,
        theme_color: c.primaryColor
      };
      // Dynamically update manifest
      var manifestLink = document.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        manifestLink.href = 'data:application/json,' + encodeURIComponent(JSON.stringify(manifest));
      }
    }
  }
};

// Show white-label config modal (for partners)
function showWhiteLabelConfig() {
  if (!currentUser || userProfile?.plan !== 'lifetime') {
    showError('White-label is available for Lifetime plan only.');
    return;
  }
  
  var c = WhiteLabel.config;
  var existing = document.getElementById('whitelabel-modal');
  if (existing) existing.remove();
  
  var modal = document.createElement('div');
  modal.id = 'whitelabel-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;max-height:85vh;overflow-y:auto;"><h2 style="font-size:1.3rem;font-weight:700;margin-bottom:16px;">White-Label Branding</h2><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Company Name:</label><input id="wl-company" value="'+c.companyName+'" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Logo URL:</label><input id="wl-logo" value="'+c.logo+'" placeholder="https://..." style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Primary Color:</label><input id="wl-primary" type="color" value="'+c.primaryColor+'" style="width:100%;padding:4px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;height:40px;"></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Custom CSS:</label><textarea id="wl-css" placeholder=".brand-btn { background: {primary}; }" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;height:80px;font-size:11px;font-family:monospace;">'+c.customCSS+'</textarea></div><div style="display:flex;gap:8px;"><button onclick="applyWhiteLabel()" style="flex:1;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Apply Branding</button><button onclick="resetWhiteLabel()" style="padding:10px 16px;background:#fef2f2;color:#dc2626;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Reset</button></div><p class="text-xs text-gray-400 mt-3">Share: <code id="wl-share-url" style="word-break:break-all;"></code></p></div>';
  document.body.appendChild(modal);
}

function applyWhiteLabel() {
  WhiteLabel.config.companyName = document.getElementById('wl-company').value;
  WhiteLabel.config.logo = document.getElementById('wl-logo').value;
  WhiteLabel.config.primaryColor = document.getElementById('wl-primary').value;
  WhiteLabel.config.customCSS = document.getElementById('wl-css').value;
  
  WhiteLabel.apply();
  localStorage.setItem('whitelabel_config', JSON.stringify(WhiteLabel.config));
  
  // Generate share URL
  var shareConfig = btoa(JSON.stringify(WhiteLabel.config));
  var shareUrl = window.location.origin + '?brand=' + encodeURIComponent(shareConfig);
  document.getElementById('wl-share-url').textContent = shareUrl;
  
  document.getElementById('whitelabel-modal').remove();
  showSuccess('Branding applied!');
}

function resetWhiteLabel() {
  WhiteLabel.config = {
    logo: '', primaryColor: '#2563eb', secondaryColor: '#4f46e5',
    companyName: 'ResumeAI Pro', favicon: '', customCSS: '',
    hidePricing: false, customDomain: ''
  };
  localStorage.removeItem('whitelabel_config');
  location.reload();
}

// Auto-apply on page load
(function() {
  WhiteLabel.loadFromStorage();
  WhiteLabel.loadFromURL();
  if (WhiteLabel.config.companyName !== 'ResumeAI Pro' || WhiteLabel.config.logo) {
    WhiteLabel.apply();
  }
})();