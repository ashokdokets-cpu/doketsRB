// Password-Protected Resume Share
// Encrypts resume with password before sharing

const secureShare = {
  encrypt: function(data, password) {
    // Simple XOR-based encryption
    var encrypted = JSON.stringify(data);
    var result = '';
    var passIndex = 0;
    for (var i = 0; i < encrypted.length; i++) {
      var charCode = encrypted.charCodeAt(i) ^ password.charCodeAt(passIndex);
      result += String.fromCharCode(charCode);
      passIndex = (passIndex + 1) % password.length;
    }
    // Convert to UTF-8 safe base64
return btoa(unescape(encodeURIComponent(result)));
  },

  decrypt: function(encrypted, password) {
    try {
      var decoded = decodeURIComponent(escape(atob(encrypted)));
      var result = '';
      var passIndex = 0;
      for (var i = 0; i < decoded.length; i++) {
        var charCode = decoded.charCodeAt(i) ^ password.charCodeAt(passIndex);
        result += String.fromCharCode(charCode);
        passIndex = (passIndex + 1) % password.length;
      }
      return JSON.parse(result);
    } catch(e) {
      return null;
    }
  },

  generateLink: function(data, password) {
    var encrypted = this.encrypt(data, password);
    var baseUrl = window.location.origin + window.location.pathname;
    return baseUrl + '?share=' + encodeURIComponent(encrypted);
  }
};

function showSecureShare() {
  if (!App.resumeData || !App.resumeData.personal || !App.resumeData.personal.fullName) {
    showError('Add some content before sharing.');
    return;
  }

  var existing = document.getElementById('secure-share-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'secure-share-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:24px;max-width:450px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="font-size:1.3rem;font-weight:700;">🔒 Secure Share</h2>
        <button onclick="document.getElementById('secure-share-modal').remove()" 
                style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button>
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:0.85rem;font-weight:600;">Set a password:</label>
        <input id="share-password" type="password" placeholder="Min 4 characters" 
               style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-top:4px;">
      </div>

      <div style="margin-bottom:16px;">
        <label style="font-size:0.85rem;font-weight:600;">Confirm password:</label>
        <input id="share-password-confirm" type="password" placeholder="Re-enter password"
               style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-top:4px;">
      </div>

      <button onclick="generateSecureLink()" 
              style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
        🔗 Generate Secure Link
      </button>

      <div id="secure-link-result" style="margin-top:12px;display:none;">
        <div style="font-size:0.8rem;font-weight:600;color:#6b7280;margin-bottom:4px;">Share this link:</div>
        <div style="display:flex;gap:8px;">
          <input id="secure-link-url" type="text" readonly 
                 style="flex:1;padding:8px;border:1px solid #e5e7eb;border-radius:6px;font-size:0.8rem;background:#f9fafb;">
          <button onclick="copySecureLink()" 
                  style="padding:8px 14px;background:#10b981;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-size:0.85rem;">
            Copy
          </button>
        </div>
        <div style="font-size:0.75rem;color:#6b7280;margin-top:8px;">
          Recipient will need the password to view this resume.
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

function generateSecureLink() {
  var pass = document.getElementById('share-password').value;
  var confirm = document.getElementById('share-password-confirm').value;

  if (pass.length < 4) {
    showError('Password must be at least 4 characters.');
    return;
  }
  if (pass !== confirm) {
    showError('Passwords do not match.');
    return;
  }

  var link = secureShare.generateLink(App.resumeData, pass);
  document.getElementById('secure-link-url').value = link;
  document.getElementById('secure-link-result').style.display = 'block';
}

function copySecureLink() {
  var input = document.getElementById('secure-link-url');
  input.select();
  document.execCommand('copy');
  showSuccess('Link copied! Share it with the password.');
}

// Check for shared resume on page load
(function() {
  var params = new URLSearchParams(window.location.search);
  var shared = params.get('share');
  
  if (shared) {
    var password = prompt('This resume is password-protected. Enter password to view:');
    if (password) {
      var data = secureShare.decrypt(shared, password);
      if (data) {
        App.resumeData = data;
        saveToStorage();
        refreshView();
        showSuccess('Shared resume loaded!');
      } else {
        showError('Wrong password or corrupted link.');
      }
    }
  }
})();