// Hash Router - Reads URL hash for deep linking from Chrome Extension
(function() {
  function processHash() {
    var hash = window.location.hash || '';
    
    if (hash.startsWith('#job-tracker')) {
      var params = {};
      var queryPart = hash.split('?')[1];
      if (queryPart) {
        queryPart.split('&').forEach(function(pair) {
          var parts = pair.split('=');
          if (parts[0] && parts[1]) {
            params[parts[0]] = decodeURIComponent(parts[1]);
          }
        });
      }
      
      // Store IMMEDIATELY (before any navigation)
      if (params.title || params.company) {
        window.doketsPendingJob = params;
        localStorage.setItem('dokets_pending_job', JSON.stringify(params));
        console.log('✅ Job stored from URL:', params.title, '-', params.company);
        
        // Also directly save to dokets_jobs
        var jobs = JSON.parse(localStorage.getItem('dokets_jobs') || '[]');
        jobs.push({
          title: params.title || 'Saved Job',
          company: params.company || '',
          status: 'Saved',
          source: 'Chrome Extension',
          dateAdded: new Date().toISOString()
        });
        localStorage.setItem('dokets_jobs', JSON.stringify(jobs));
        console.log('✅ Job added to tracker list!');
      }
      
      // Navigate to job tracker
      var checkApp = setInterval(function() {
        if (typeof navigate === 'function') {
          clearInterval(checkApp);
          navigate('job-tracker');
        }
      }, 500);
      
      // Clean hash after 1 second
      setTimeout(function() {
        history.replaceState(null, '', window.location.pathname);
      }, 1000);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(processHash, 1000);
      setTimeout(processHash, 3000);
    });
  } else {
    setTimeout(processHash, 1000);
    setTimeout(processHash, 3000);
  }
})();