// Auto-Detect Theme
// Detects OS preference and applies theme automatically
// Does NOT replace manual toggle

(function() {
  function detectAndApplyTheme() {
    const saved = localStorage.getItem('darkMode');
    
    if (saved === '1') {
      document.body.classList.add('dark');
    } else if (saved === '0') {
      document.body.classList.remove('dark');
    } else {
      // No preference saved — use OS setting
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
        localStorage.setItem('darkMode', '1');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('darkMode', '0');
      }
    }
    
    updateDarkToggleIcon();
  }

  function updateDarkToggleIcon() {
    var t = document.getElementById('dark-toggle');
    if (t) {
      t.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
    }
  }

  // Listen for OS theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem('darkMode')) {
        if (e.matches) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
        updateDarkToggleIcon();
      }
    });
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detectAndApplyTheme);
  } else {
    detectAndApplyTheme();
  }

  // Update toggle icon when manual toggle happens
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.target.id === 'dark-toggle') {
        updateDarkToggleIcon();
      }
    });
  });

  setTimeout(function() {
    var toggle = document.getElementById('dark-toggle');
    if (toggle) observer.observe(toggle, { characterData: true, subtree: true });
  }, 500);
})();