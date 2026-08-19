// Extended Currencies - Adds 8 more currencies with persistent injection
(function() {
  var newCurrencies = {
    AED: { symbol: 'د.إ', free: '0', pro: '54.99', annual: '359', annualMonthly: '29.92', lifetime: '1,799', enterprise: '1,099', jobhunt: '10.99' },
    JPY: { symbol: '¥', free: '0', pro: '2,200', annual: '14,500', annualMonthly: '1,208', lifetime: '73,000', enterprise: '44,000', jobhunt: '440' },
    CNY: { symbol: '¥', free: '0', pro: '99', annual: '650', annualMonthly: '54.17', lifetime: '3,290', enterprise: '1,990', jobhunt: '19.90' },
    HKD: { symbol: 'HK$', free: '0', pro: '117', annual: '770', annualMonthly: '64.17', lifetime: '3,890', enterprise: '2,330', jobhunt: '23' },
    NZD: { symbol: 'NZ$', free: '0', pro: '24.99', annual: '159', annualMonthly: '13.25', lifetime: '799', enterprise: '479', jobhunt: '4.99' },
    CHF: { symbol: 'Fr', free: '0', pro: '13.99', annual: '89', annualMonthly: '7.42', lifetime: '449', enterprise: '269', jobhunt: '2.99' },
    SEK: { symbol: 'kr', free: '0', pro: '149', annual: '990', annualMonthly: '82.50', lifetime: '4,990', enterprise: '2,990', jobhunt: '29.90' },
    BRL: { symbol: 'R$', free: '0', pro: '74.99', annual: '499', annualMonthly: '41.58', lifetime: '2,499', enterprise: '1,499', jobhunt: '14.99' }
  };

  var flags = { AED: '🇦🇪', JPY: '🇯🇵', CNY: '🇨🇳', HKD: '🇭🇰', NZD: '🇳🇿', CHF: '🇨🇭', SEK: '🇸🇪', BRL: '🇧🇷' };

  function injectButtons() {
    var buttons = document.querySelectorAll('button[onclick*="App.currency"]');
    if (buttons.length === 0) return;
    
    var parent = buttons[0].parentElement;
    if (!parent) return;
    
    // Remove old injected buttons
    parent.querySelectorAll('[data-extended-currency]').forEach(function(el) { el.remove(); });
    
    // Add new currency buttons
    for (var key in newCurrencies) {
      var btn = document.createElement('button');
      btn.setAttribute('data-extended-currency', 'true');
      btn.onclick = function(currencyKey) {
        return function() {
          App.currency = currencyKey;
          if (typeof navigate === 'function') navigate('pricing');
          setTimeout(injectButtons, 500);
        };
      }(key);
      btn.className = 'px-4 py-2 rounded-lg text-sm font-bold transition ' + (App.currency === key ? 'bg-brand-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200');
      btn.innerHTML = flags[key] + ' ' + newCurrencies[key].symbol + ' ' + key;
      btn.style.margin = '0';
      parent.appendChild(btn);
    }
  }

  // Watch for DOM changes and re-inject
  var observer = new MutationObserver(function() {
    setTimeout(injectButtons, 300);
  });

  function startObserver() {
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(injectButtons, 1500);
      startObserver();
    });
  } else {
    setTimeout(injectButtons, 1500);
    startObserver();
  }
})();