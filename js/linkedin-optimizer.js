// LinkedIn Profile Optimizer
// AI-powered suggestions to improve LinkedIn profile

const LinkedInOptimizer = {
  sections: ['headline', 'about', 'experience', 'skills', 'recommendations'],
  
  analyze: function(resumeData) {
    var tips = [];
    var rd = resumeData || {};
    
    // Headline check
    if (!rd.personal?.fullName) {
      tips.push({ section: 'Headline', priority: 'high', tip: 'Add your full name and current role. Example: "John Doe | Senior Software Engineer at TechCorp"' });
    }
    
    // About section
    if (!rd.summary || rd.summary.length < 100) {
      tips.push({ section: 'About', priority: 'high', tip: 'Write a compelling About section (3-5 sentences). Include your years of experience, top skills, and what you are looking for.' });
    }
    
    // Experience
    if ((rd.experience || []).length === 0) {
      tips.push({ section: 'Experience', priority: 'high', tip: 'Add your work experience with bullet points describing achievements using the STAR method.' });
    } else {
      var hasMetrics = false;
      rd.experience.forEach(function(exp) {
        if ((exp.bullets || '').match(/\d+%|\$\d+/)) hasMetrics = true;
      });
      if (!hasMetrics) {
        tips.push({ section: 'Experience', priority: 'medium', tip: 'Add metrics to your experience bullets (numbers, %, $). Example: "Increased sales by 40% in 6 months."' });
      }
    }
    
    // Skills
    if ((rd.skills || []).length < 5) {
      tips.push({ section: 'Skills', priority: 'high', tip: 'Add at least 5 skills. LinkedIn uses these for recruiter searches.' });
    } else if ((rd.skills || []).length < 10) {
      tips.push({ section: 'Skills', priority: 'medium', tip: 'Aim for 10-15 skills. Include technical skills, soft skills, and tools.' });
    }
    
    // Profile completeness
    if (!rd.personal?.location) {
      tips.push({ section: 'Profile', priority: 'medium', tip: 'Add your location — recruiters filter by location.' });
    }
    if (!rd.personal?.email) {
      tips.push({ section: 'Profile', priority: 'medium', tip: 'Add your email address for recruiters to contact you.' });
    }
    
    // Recommendations
    tips.push({ section: 'Recommendations', priority: 'low', tip: 'Ask colleagues or managers for LinkedIn recommendations. Aim for 3-5.' });
    
    return tips;
  }
};

function showLinkedInOptimizer() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  if (!App.resumeData?.personal?.fullName) { showError('Add resume content first.'); return; }
  
  var tips = LinkedInOptimizer.analyze(App.resumeData);
  
  var existing = document.getElementById('linkedin-opt-modal');
  if (existing) existing.remove();
  
  var modal = document.createElement('div');
  modal.id = 'linkedin-opt-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  var tipsHTML = tips.map(function(t) {
    var color = t.priority === 'high' ? '#ef4444' : t.priority === 'medium' ? '#f59e0b' : '#6b7280';
    return '<div style="padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:8px;border-left:4px solid '+color+';"><div style="font-weight:600;font-size:0.85rem;">'+t.section+'</div><div style="font-size:0.8rem;color:#4b5563;margin-top:4px;">'+t.tip+'</div></div>';
  }).join('');
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:550px;width:90%;max-height:80vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">🔗 LinkedIn Profile Optimizer</h2><button onclick="document.getElementById(\'linkedin-opt-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><p style="font-size:0.85rem;color:#6b7280;margin-bottom:12px;">AI-powered suggestions to make your LinkedIn profile stand out to recruiters.</p><div id="linkedin-opt-tips">'+tipsHTML+'</div><p style="font-size:0.75rem;color:#9ca3af;margin-top:12px;text-align:center;">Apply these tips to your LinkedIn profile for better visibility.</p></div>';
  document.body.appendChild(modal);
}