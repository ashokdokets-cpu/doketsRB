// Promo Code System for Dokets Resume Builder
// Supports discount codes with automatic validation

var PromoSystem = {
  codes: {
    'PH10OFF': { discount: 100, months: 3, type: 'free', description: '3 Months Free — Product Hunt Community' },
    'LAUNCH50': { discount: 50, months: 1, type: 'percent', description: '50% Off First Month' },
    'STUDENT30': { discount: 30, months: 12, type: 'percent', description: '30% Off Annual — Student Discount' },
    'FREEMONTH': { discount: 100, months: 1, type: 'free', description: 'First Month Free' }
  },

    apply: async function(code) {
    var promo = this.codes[code.toUpperCase().trim()];
    if (!promo) return { success: false, error: 'Invalid promo code.' };
    
    // Check if already applied in this browser
    var applied = JSON.parse(localStorage.getItem('applied_promos') || '[]');
    if (applied.includes(code.toUpperCase())) {
      return { success: false, error: 'You have already used this promo code.' };
    }
    
    // Check if user already used this promo on another account (Supabase)
    if (currentUser && sbClient) {
      try {
        var { data: existing } = await sbClient.from('promo_usage')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('promo_code', code.toUpperCase())
          .single();
        if (existing) {
          return { success: false, error: 'You have already used this promo code on this account.' };
        }
        
        // Check if this promo code was used with a different email/device
        // Track by browser fingerprint
        var fingerprint = this.getFingerprint();
        var { data: fpCheck } = await sbClient.from('promo_usage')
          .select('*')
          .eq('browser_fingerprint', fingerprint)
          .eq('promo_code', code.toUpperCase())
          .single();
        if (fpCheck) {
          return { success: false, error: 'This promo code has already been used on this device.' };
        }
      } catch(e) {}
    }
    
    // Save promo locally
    localStorage.setItem('active_promo', JSON.stringify(promo));
    applied.push(code.toUpperCase());
    localStorage.setItem('applied_promos', JSON.stringify(applied));
    
    // Log usage to Supabase (prevents multi-account abuse)
    if (currentUser && sbClient) {
      try {
        await sbClient.from('promo_usage').insert({
          user_id: currentUser.id,
          promo_code: code.toUpperCase(),
          email: currentUser.email,
          browser_fingerprint: this.getFingerprint(),
          ip_address: 'tracked',
          applied_at: new Date().toISOString()
        });
      } catch(e) {}
    }
    
    return { success: true, promo: promo };
  },

  getFingerprint: function() {
    var fp = '';
    fp += navigator.userAgent || '';
    fp += navigator.language || '';
    fp += screen.colorDepth || '';
    fp += screen.width + 'x' + screen.height;
    fp += new Date().getTimezoneOffset();
    // Simple hash
    var hash = 0;
    for (var i = 0; i < fp.length; i++) {
      hash = ((hash << 5) - hash) + fp.charCodeAt(i);
      hash |= 0;
    }
    return 'fp_' + Math.abs(hash);
  },

  getActive: function() {
    return JSON.parse(localStorage.getItem('active_promo') || 'null');
  },

  getDiscountAmount: function(originalPrice) {
    var promo = this.getActive();
    if (!promo) return 0;
    
    if (promo.type === 'free') {
      return originalPrice; // 100% off
    }
    return Math.round(originalPrice * promo.discount / 100);
  },

  getDiscountedPrice: function(originalPrice) {
    var discount = this.getDiscountAmount(originalPrice);
    return originalPrice - discount;
  },

  clear: function() {
    localStorage.removeItem('active_promo');
  }
};

function showPromoCodeModal() {
  var existing = document.getElementById('promo-modal');
  if (existing) existing.remove();
  
  var activePromo = PromoSystem.getActive();
  
  var modal = document.createElement('div');
  modal.id = 'promo-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  if (activePromo) {
    modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:400px;width:90%;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.2rem;font-weight:700;">🎉 Promo Applied!</h2><button onclick="document.getElementById(\'promo-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><div style="background:#f0fdf4;padding:16px;border-radius:10px;margin-bottom:12px;text-align:center;"><p style="font-size:1rem;font-weight:700;color:#166534;">'+activePromo.description+'</p></div><button onclick="PromoSystem.clear();showPromoCodeModal();" style="width:100%;padding:8px;background:#fef2f2;color:#dc2626;border:none;border-radius:8px;cursor:pointer;font-size:0.85rem;">Remove Promo Code</button></div>';
  } else {
    modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:400px;width:90%;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.2rem;font-weight:700;">🎟️ Promo Code</h2><button onclick="document.getElementById(\'promo-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><input id="promo-code-input" placeholder="Enter promo code (e.g., PH10OFF)" style="width:100%;padding:12px;border:2px solid #e5e7eb;border-radius:8px;font-size:1rem;text-align:center;margin-bottom:12px;"><button onclick="applyPromoFromModal()" style="width:100%;padding:12px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-size:1rem;">Apply Code</button><div id="promo-result" style="margin-top:8px;text-align:center;"></div></div>';
  }
  
  document.body.appendChild(modal);
}

function applyPromoFromModal() {
  var code = document.getElementById('promo-code-input').value;
  var result = PromoSystem.apply(code);
  var resultEl = document.getElementById('promo-result');
  
  if (result.success) {
    resultEl.innerHTML = '<span style="color:#10b981;font-weight:600;">✅ ' + result.promo.description + '</span>';
    setTimeout(function() { document.getElementById('promo-modal').remove(); }, 1500);
  } else {
    resultEl.innerHTML = '<span style="color:#ef4444;">❌ ' + result.error + '</span>';
  }
}

// Add promo badge to pricing page
function updatePricingWithPromo() {
  var promo = PromoSystem.getActive();
  if (!promo) return;
  
  var priceElements = document.querySelectorAll('.text-3xl.font-extrabold');
  priceElements.forEach(function(el) {
    var originalText = el.textContent;
    var match = originalText.match(/[\d,.]+/);
    if (match) {
      var price = parseFloat(match[0].replace(',',''));
      var discounted = PromoSystem.getDiscountedPrice(price);
      if (discounted < price) {
        el.innerHTML = '<span style="text-decoration:line-through;color:#9ca3af;font-size:0.7em;">'+originalText+'</span> <span style="color:#10b981;">'+promo.description+'</span>';
      }
    }
  });
}

// Add promo link to footer
function addPromoFooter() {
  var footer = document.querySelector('footer .flex-wrap');
  if (footer) {
    var link = document.createElement('a');
    link.href = '#';
    link.onclick = function(e) { e.preventDefault(); showPromoCodeModal(); };
    link.className = 'hover:text-white transition-colors text-gray-300';
    link.textContent = 'Promo Code';
    footer.appendChild(link);
  }
}

setTimeout(addPromoFooter, 1000);
setTimeout(updatePricingWithPromo, 2000);