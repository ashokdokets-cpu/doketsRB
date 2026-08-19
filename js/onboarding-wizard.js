// User Onboarding Wizard - First-time user guide
// SAFE: Separate file, doesn't modify existing code

var OnboardingWizard = {
  steps: [
    { title: 'Welcome to Dokets!', icon: '👋', desc: 'Build ATS-optimized resumes in minutes with AI assistance.' },
    { title: 'Choose Your Field', icon: '💼', desc: 'Select your career field to get personalized recommendations.' },
    { title: 'Import Your Resume', icon: '📄', desc: 'Upload existing resume or import from LinkedIn.' },
    { title: 'Pick a Template', icon: '🎨', desc: 'Choose from professional ATS-friendly templates.' },
    { title: 'Run ATS Check', icon: '🎯', desc: 'See your ATS score and get improvement tips.' }
  ],
  
  currentStep: 0,
  
  show: function() {
    // Check if already shown
    if (localStorage.getItem('dokets_onboarding_done')) return;
    
    var overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:99999;display:flex;align-items:center;justify-content:center;';
    overlay.innerHTML = '<div id="onboarding-modal" style="background:white;border-radius:16px;padding:32px;max-width:450px;width:90%;text-align:center;"></div>';
    document.body.appendChild(overlay);
    this.render();
  },
  
  render: function() {
    var step = this.steps[this.currentStep];
    var modal = document.getElementById('onboarding-modal');
    if (!modal) return;
    
    var progress = Math.round(((this.currentStep + 1) / this.steps.length) * 100);
    
    modal.innerHTML = 
      '<div style="margin-bottom:16px;"><span style="font-size:48px;">' + step.icon + '</span></div>' +
      '<h2 style="font-size:1.5rem;font-weight:700;margin-bottom:8px;">' + step.title + '</h2>' +
      '<p style="color:#6b7280;margin-bottom:24px;">' + step.desc + '</p>' +
      '<div style="background:#f3f4f6;border-radius:20px;height:6px;margin-bottom:24px;"><div style="background:#6366f1;border-radius:20px;height:6px;width:' + progress + '%;"></div></div>' +
      '<div style="display:flex;gap:8px;justify-content:center;">' +
        (this.currentStep > 0 ? '<button onclick="OnboardingWizard.prev()" style="padding:10px 20px;background:#f3f4f6;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Back</button>' : '') +
        (this.currentStep < this.steps.length - 1 ? 
          '<button onclick="OnboardingWizard.next()" style="padding:10px 20px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Next</button>' : 
          '<button onclick="OnboardingWizard.finish()" style="padding:10px 20px;background:#10b981;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Get Started</button>') +
        '<button onclick="OnboardingWizard.skip()" style="padding:10px 16px;background:transparent;border:none;cursor:pointer;font-size:12px;color:#9ca3af;">Skip</button>' +
      '</div>';
  },
  
  next: function() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.render();
    }
  },
  
  prev: function() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.render();
    }
  },
  
  finish: function() {
    localStorage.setItem('dokets_onboarding_done', 'true');
    document.getElementById('onboarding-overlay').remove();
    if (typeof navigate === 'function') navigate('builder');
    showSuccess('Welcome to Dokets!');
  },
  
  skip: function() {
    localStorage.setItem('dokets_onboarding_done', 'true');
    document.getElementById('onboarding-overlay').remove();
  }
};

// Auto-show for first-time users
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      if (!localStorage.getItem('dokets_onboarding_done') && !currentUser) {
        OnboardingWizard.show();
      }
    }, 2000);
  });
} else {
  setTimeout(function() {
    if (!localStorage.getItem('dokets_onboarding_done') && !currentUser) {
      OnboardingWizard.show();
    }
  }, 2000);
}

window.OnboardingWizard = OnboardingWizard;