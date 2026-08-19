// SSO Integration Manager

const SSOManager = {
  providers: {
    google: {
      name: 'Google Workspace',
      icon: '🔵',
      enabled: false,
      domains: [],
      clientId: ''
    },
    microsoft: {
      name: 'Microsoft 365 / Azure AD',
      icon: '🟦',
      enabled: false,
      domains: [],
      tenantId: '',
      clientId: ''
    },
    saml: {
      name: 'SAML 2.0',
      icon: '🟣',
      enabled: false,
      domains: [],
      entryPoint: '',
      certificate: ''
    }
  },

  loadConfig: function() {
    try {
      var saved = JSON.parse(localStorage.getItem('sso_config'));
      if (saved) Object.assign(this.providers, saved);
    } catch(e) {}
  },

  saveConfig: function() {
    localStorage.setItem('sso_config', JSON.stringify(this.providers));
  },

  // Auto-detect user's email domain for SSO
  detectProvider: function(email) {
    if (!email) return null;
    var domain = email.split('@')[1]?.toLowerCase();
    if (!domain) return null;
    
    if (this.providers.google.enabled && this.providers.google.domains.includes(domain)) {
      return 'google';
    }
    if (this.providers.microsoft.enabled && this.providers.microsoft.domains.includes(domain)) {
      return 'microsoft';
    }
    if (this.providers.saml.enabled && this.providers.saml.domains.includes(domain)) {
      return 'saml';
    }
    return null;
  },

  // Initiate SSO login
  initiateLogin: function(provider, email) {
    if (!email) {
      showError('Please enter your email first.');
      return;
    }
    
    switch(provider) {
      case 'google':
        // Redirect to Google OAuth
        var googleUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
          'client_id=' + this.providers.google.clientId +
          '&redirect_uri=' + encodeURIComponent(window.location.origin + '/sso-callback') +
          '&response_type=code' +
          '&scope=openid%20email%20profile' +
          '&login_hint=' + encodeURIComponent(email);
        window.location.href = googleUrl;
        break;
        
      case 'microsoft':
        var msUrl = 'https://login.microsoftonline.com/' + this.providers.microsoft.tenantId +
          '/oauth2/v2.0/authorize?' +
          'client_id=' + this.providers.microsoft.clientId +
          '&redirect_uri=' + encodeURIComponent(window.location.origin + '/sso-callback') +
          '&response_type=code' +
          '&scope=openid%20email%20profile' +
          '&login_hint=' + encodeURIComponent(email);
        window.location.href = msUrl;
        break;
        
      case 'saml':
        showError('SAML login is configured. Redirecting to your identity provider...');
        if (this.providers.saml.entryPoint) {
          setTimeout(function() {
            window.location.href = SSOManager.providers.saml.entryPoint;
          }, 1500);
        }
        break;
        
      default:
        showError('SSO not configured for this provider.');
    }
  }
};

// SSO Configuration Modal
function showSSOConfig() {
  if (!currentUser || userProfile?.plan !== 'lifetime') {
    showError('SSO configuration is available for Lifetime plan only.');
    return;
  }
  
  SSOManager.loadConfig();
  
  var existing = document.getElementById('sso-modal');
  if (existing) existing.remove();
  
  var modal = document.createElement('div');
  modal.id = 'sso-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  var providersHTML = '';
  Object.entries(SSOManager.providers).forEach(function(entry) {
    var key = entry[0];
    var p = entry[1];
    providersHTML += '<div style="background:#f9fafb;border-radius:10px;padding:16px;margin-bottom:12px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><span style="font-weight:600;">'+p.icon+' '+p.name+'</span><label style="display:flex;align-items:center;gap:6px;font-size:0.8rem;"><input type="checkbox" id="sso-'+key+'-enabled" '+ (p.enabled?'checked':'') +' onchange="SSOManager.providers.'+key+'.enabled=this.checked"> Enable</label></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;"><input id="sso-'+key+'-domains" placeholder="Domains (comma separated)" value="'+(p.domains||[]).join(',')+'" style="padding:6px;border:1px solid #e5e7eb;border-radius:4px;font-size:0.75rem;">'+
    (key === 'saml' ? '<input id="sso-'+key+'-entry" placeholder="SAML Entry Point URL" value="'+p.entryPoint+'" style="padding:6px;border:1px solid #e5e7eb;border-radius:4px;font-size:0.75rem;">' : 
    (key === 'microsoft' ? '<input id="sso-'+key+'-tenant" placeholder="Tenant ID" value="'+p.tenantId+'" style="padding:6px;border:1px solid #e5e7eb;border-radius:4px;font-size:0.75rem;">' : '')) +
    '<input id="sso-'+key+'-client" placeholder="Client ID" value="'+p.clientId+'" style="padding:6px;border:1px solid #e5e7eb;border-radius:4px;font-size:0.75rem;"></div></div>';
  });
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:550px;width:90%;max-height:85vh;overflow-y:auto;"><h2 style="font-size:1.3rem;font-weight:700;margin-bottom:8px;">SSO Configuration</h2><p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Let users from your organization sign in with their company email.</p>' + providersHTML + '<button onclick="saveSSOConfig()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:8px;">Save Configuration</button><div style="margin-top:12px;padding:10px;background:#f0fdf4;border-radius:8px;font-size:0.8rem;color:#166534;"><b>SSO Login URL:</b> <code id="sso-login-url" style="word-break:break-all;">'+window.location.origin+'?sso=YOUR_DOMAIN</code><br>Users from configured domains will see SSO option on the login page.</div></div>';
  document.body.appendChild(modal);
}

function saveSSOConfig() {
  Object.keys(SSOManager.providers).forEach(function(key) {
    SSOManager.providers[key].enabled = document.getElementById('sso-'+key+'-enabled')?.checked || false;
    SSOManager.providers[key].domains = (document.getElementById('sso-'+key+'-domains')?.value || '').split(',').map(function(d){ return d.trim(); }).filter(Boolean);
    SSOManager.providers[key].clientId = document.getElementById('sso-'+key+'-client')?.value || '';
    if (key === 'microsoft') SSOManager.providers[key].tenantId = document.getElementById('sso-'+key+'-tenant')?.value || '';
    if (key === 'saml') SSOManager.providers[key].entryPoint = document.getElementById('sso-'+key+'-entry')?.value || '';
  });
  
  SSOManager.saveConfig();
  document.getElementById('sso-modal').remove();
  showSuccess('SSO configuration saved!');
}

// Auto-detect SSO on login page
(function() {
  SSOManager.loadConfig();
  
  // Add SSO detection to login email input
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      var emailInput = document.getElementById('login-email');
      if (emailInput) {
        emailInput.addEventListener('blur', function() {
          var provider = SSOManager.detectProvider(this.value);
          var ssoBtn = document.getElementById('sso-login-btn');
          var ssoHint = document.getElementById('sso-hint');
          
          if (provider && SSOManager.providers[provider].enabled) {
            if (ssoHint) ssoHint.textContent = 'SSO available via ' + SSOManager.providers[provider].name;
            if (ssoHint) ssoHint.style.display = 'block';
            if (ssoBtn) {
              ssoBtn.textContent = 'Sign in with ' + SSOManager.providers[provider].name;
              ssoBtn.style.display = 'block';
              ssoBtn.onclick = function() { SSOManager.initiateLogin(provider, emailInput.value); };
            }
          }
        });
      }
    }, 1000);
  });
})();