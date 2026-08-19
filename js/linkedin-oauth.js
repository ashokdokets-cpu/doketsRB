// LinkedIn OAuth Import with Full Auto-Fill

function triggerLinkedInOAuth() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  
  var clientId = '86jm4ws8xy27h8'; // Your LinkedIn Client ID
  var redirectUri = 'https://www.doketsrb.com/linkedin-callback';
  var state = Math.random().toString(36).substring(7);
  localStorage.setItem('linkedin_oauth_state', state);
  
  var authUrl = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=' + clientId + '&redirect_uri=' + encodeURIComponent(redirectUri) + '&scope=openid%20profile%20email&state=' + state;
  window.location.href = authUrl;
}

async function handleLinkedInCallback() {
  var params = new URLSearchParams(window.location.search);
  var code = params.get('code');
  var state = params.get('state');
  var savedState = localStorage.getItem('linkedin_oauth_state');
  
  if (!code || state !== savedState) return;
  
  localStorage.removeItem('linkedin_oauth_state');
  showLoader();
  
  try {
    var response = await fetch('/api/linkedin-exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    });
    var data = await response.json();
    
    if (data.success && data.profile) {
      // Auto-fill personal info
      var fullName = data.profile.name || '';
      var email = data.profile.email || '';
      
      if (fullName && !App.resumeData.personal.fullName) {
        App.resumeData.personal.fullName = fullName;
      }
      if (email && !App.resumeData.personal.email) {
        App.resumeData.personal.email = email;
      }
      
      saveToStorage();
      refreshView();
      hideLoader();
      showSuccess('LinkedIn profile imported! Add your experience and skills in Builder.');
      navigate('builder');
      
      // Clean URL
      window.history.replaceState({}, document.title, '/');
    } else {
      hideLoader();
      showError('LinkedIn import failed. Please try again.');
    }
  } catch(e) {
    hideLoader();
    showError('LinkedIn import error.');
  }
}

// Auto-trigger on LinkedIn callback - runs after everything loads
if (window.location.search.includes('code=')) {
    window.addEventListener('load', function() {
        setTimeout(async function() {
            if (typeof handleLinkedInCallback === 'function' && typeof SMART_IMPORT !== 'undefined') {
                await handleLinkedInCallback();
                // Force save to localStorage so loadFromStorage doesn't wipe it
                if (typeof saveToStorage === 'function') {
                    saveToStorage();
                }
                // Show success
                if (typeof showSuccess === 'function') {
                    showSuccess('LinkedIn profile imported!');
                }
                // Clean URL
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            }
        }, 4000);
    });
}