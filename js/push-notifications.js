// Push Notifications - Safe PWA notifications
// Separate file - doesn't modify existing code

var PushNotifications = {
  isSupported: function() {
    return 'Notification' in window && 'serviceWorker' in navigator;
  },
  
  requestPermission: function() {
    if (!this.isSupported()) {
      console.log('Push notifications not supported');
      return;
    }
    
    Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        console.log('✅ Notification permission granted');
        PushNotifications.scheduleDaily();
      } else {
        console.log('Notification permission denied');
      }
    });
  },
  
  scheduleDaily: function() {
    // Schedule daily job match notification (9 AM)
    this.sendNotification(
      'Dokets Resume Builder',
      'Ready to optimize your resume? Check your ATS score today!'
    );
    
    // Schedule follow-up
    setInterval(function() {
      var hour = new Date().getHours();
      if (hour === 9) { // 9 AM
        PushNotifications.sendDailyAlert();
      }
    }, 3600000); // Check every hour
  },
  
  generateAITip: function() {
    var resumeData = {};
    try {
      var saved = localStorage.getItem('resumeai_pro_data');
      if (saved) resumeData = JSON.parse(saved);
    } catch(e) {}
    
    if (!resumeData || !resumeData.resumeData) return null;
    
    var rd = resumeData.resumeData;
    var prompt = 'Based on this resume, give ONE specific actionable tip to improve ATS score. Max 30 words: ' + 
                 JSON.stringify({summary: rd.summary, skills: rd.skills, experience: rd.experience});
    
    fetch('/api/ai-analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'push_tip', resumeData: rd })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.success && d.data && d.data.tip) {
        PushNotifications.sendNotification('AI Resume Tip', d.data.tip);
      } else {
        PushNotifications.sendDailyAlert();
      }
    })
    .catch(function() {
      PushNotifications.sendDailyAlert();
    });
  },
  
  sendDailyAlert: function() {
    var lastSent = localStorage.getItem('dokets_last_notification');
    var today = new Date().toDateString();
    
    if (lastSent !== today) {
      this.sendNotification(
        'Daily Resume Tip',
        'Use action verbs and quantify achievements in your bullets for better ATS scores!'
      );
      localStorage.setItem('dokets_last_notification', today);
    }
  },
  
  sendNotification: function(title, body) {
    if (!this.isSupported()) return;
    
    if (Notification.permission === 'granted') {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(function(registration) {
          registration.showNotification(title, {
            body: body,
            icon: '/icon128.png',
            badge: '/icon128.png',
            vibrate: [200, 100, 200]
          });
        });
      } else {
        // Fallback: Use regular Notification
        new Notification(title, { body: body });
      }
    }
  },
  
  showOptIn: function() {
    var overlay = document.createElement('div');
    overlay.id = 'notification-optin';
    overlay.style.cssText = 'position:fixed;bottom:20px;left:20px;background:white;border-radius:12px;padding:16px;box-shadow:0 10px 40px rgba(0,0,0,0.2);z-index:99998;max-width:300px;';
    overlay.innerHTML = 
      '<div style="font-weight:600;margin-bottom:4px;">🔔 Get Job Alerts</div>' +
      '<p style="font-size:12px;color:#6b7280;margin-bottom:8px;">Receive daily resume tips and job match alerts.</p>' +
      '<div style="display:flex;gap:6px;">' +
        '<button onclick="PushNotifications.requestPermission();document.getElementById(\'notification-optin\').remove()" style="padding:6px 12px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">Enable</button>' +
        '<button onclick="document.getElementById(\'notification-optin\').remove()" style="padding:6px 12px;background:transparent;border:none;cursor:pointer;font-size:12px;color:#9ca3af;">Later</button>' +
      '</div>';
    document.body.appendChild(overlay);
  }
};

// Auto-show opt-in after user interacts
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      if (PushNotifications.isSupported() && Notification.permission === 'default') {
        if (!localStorage.getItem('dokets_notification_asked')) {
          PushNotifications.showOptIn();
          localStorage.setItem('dokets_notification_asked', 'true');
        }
      }
    }, 10000); // Show after 10 seconds
  });
} else {
  setTimeout(function() {
    if (PushNotifications.isSupported() && Notification.permission === 'default') {
      if (!localStorage.getItem('dokets_notification_asked')) {
        PushNotifications.showOptIn();
        localStorage.setItem('dokets_notification_asked', 'true');
      }
    }
  }, 10000);
}

window.PushNotifications = PushNotifications;