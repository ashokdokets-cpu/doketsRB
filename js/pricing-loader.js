// Pricing Loader - Direct Supabase fetch (no API needed)
(function() {
  var flagMap = {
    AED: '🇦🇪', JPY: '🇯🇵', CNY: '🇨🇳', HKD: '🇭🇰',
    NZD: '🇳🇿', CHF: '🇨🇭', SEK: '🇸🇪', BRL: '🇧🇷'
  };

  var SUPABASE_URL = 'https://arszgttojohsmzjiemgh.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFyc3pndHRvam9oc216amllbWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MTYwNTksImV4cCI6MjA5MzI5MjA1OX0.0Y6kM8cg0fERxlM0xTZu6AFzenfVY-USoNm6mJeg-dM';

  function loadCurrencies() {
    fetch(SUPABASE_URL + '/rest/v1/currencies?select=*&is_active=eq.true&order=display_order.asc', {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY
      }
    })
    .then(function(response) { return response.json(); })
    .then(function(currencies) {
      if (currencies && currencies.length > 0) {
        window.extraCurrencies = currencies;
        injectButtons(currencies);
        console.log('✅ ' + currencies.length + ' currencies loaded from Supabase');
      }
    })
    .catch(function(e) {
      console.log('Supabase error:', e.message);
    });
  }

  function injectButtons(currencies) {
    var buttons = document.querySelectorAll('button[onclick*="App.currency"]');
    if (buttons.length === 0) return;
    var parent = buttons[0].parentElement;
    if (!parent) return;
    parent.querySelectorAll('[data-extra-currency]').forEach(function(el) { el.remove(); });
    var existing = {};
    buttons.forEach(function(btn) {
      var match = btn.getAttribute('onclick').match(/App\.currency='([^']+)'/);
      if (match) existing[match[1]] = true;
    });
    currencies.forEach(function(curr) {
      if (!existing[curr.code]) {
        var btn = document.createElement('button');
        btn.setAttribute('data-extra-currency', 'true');
        btn.setAttribute('onclick', "App.currency='" + curr.code + "';navigate('pricing')");
        btn.className = 'px-4 py-2 rounded-lg text-sm font-bold transition bg-gray-100 text-gray-700 hover:bg-gray-200';
        btn.innerHTML = (flagMap[curr.code] || '') + ' ' + curr.symbol + ' ' + curr.code;
        btn.style.margin = '2px';
        parent.appendChild(btn);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { setTimeout(loadCurrencies, 2000); });
  } else {
    setTimeout(loadCurrencies, 2000);
  }
})();