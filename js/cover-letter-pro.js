// Dokets Cover Letter Pro — Standalone Cover Letter Generator
// Premium cover letter builder with AI and multiple templates

const CoverLetterPro = {
  templates: {
    standard: { name: 'Standard Professional', color: '#2563eb' },
    modern: { name: 'Modern & Bold', color: '#4f46e5' },
    academic: { name: 'Academic / Research', color: '#1e40af' },
    creative: { name: 'Creative / Startup', color: '#e11d48' },
    executive: { name: 'Executive / C-Suite', color: '#d97706' }
  },

  generate: function(resumeData, jobData, template) {
    var rd = resumeData || {};
    var jd = jobData || {};
    var years = this.calcYears(rd);
    var skills = (rd.skills || []).slice(0, 5).join(', ');
    var title = jd.title || 'the position';
    var company = jd.company || 'your organization';
    var name = rd.personal?.fullName || '[Your Name]';
    var email = rd.personal?.email || '';
    var phone = rd.personal?.phone || '';
    var achievement = this.getAchievement(rd);

    var templates = {
      standard: 'Dear Hiring Manager,\n\nI am writing to express my strong interest in the ' + title + ' position at ' + company + '. With ' + years + '+ years of experience in ' + (rd.experience?.[0]?.title || 'my field') + ', I have developed expertise in ' + skills + '.\n\n' + (achievement ? 'One of my key achievements includes ' + achievement + '.\n\n' : '') + 'I am excited about the opportunity to contribute to ' + company + ' and would welcome the chance to discuss my qualifications further.\n\nSincerely,\n' + name + '\n' + email + ' | ' + phone,
      
      modern: 'Hi ' + company + ' Team,\n\nYour search for a ' + title + ' ends here. I bring ' + years + '+ years of driving results in ' + (rd.experience?.[0]?.title || 'my field') + '.\n\nHere\'s what I bring:\n• ' + skills.replace(/, /g, '\n• ') + '\n\n' + (achievement ? 'My proudest achievement? ' + achievement + '\n\n' : '') + 'Let\'s schedule a call. I\'ll show you exactly how I can move the needle at ' + company + '.\n\nBest,\n' + name,
      
      academic: 'Dear Search Committee,\n\nI am writing to apply for the ' + title + ' position at ' + company + '. My background includes ' + years + '+ years of experience in ' + (rd.experience?.[0]?.title || 'my field') + ', with a focus on ' + skills + '.\n\n' + (achievement ? 'My research and professional contributions include ' + achievement + '.\n\n' : '') + 'I welcome the opportunity to discuss how my experience aligns with the goals of ' + company + '.\n\nRespectfully,\n' + name + '\n' + email,
      
      executive: 'Dear Hiring Committee,\n\nI am writing to express my interest in the ' + title + ' role at ' + company + '. As a seasoned executive with ' + years + '+ years of leadership experience, I have successfully ' + (achievement || 'driven organizational growth and innovation') + '.\n\nMy expertise spans ' + skills + '. I am drawn to ' + company + '\'s vision and would be honored to contribute to its continued success.\n\nI look forward to discussing how my leadership can support ' + company + '\'s strategic objectives.\n\nSincerely,\n' + name,
      
      creative: 'Hey ' + company + '!\n\nI\'m ' + name + ', and I\'ve been following ' + company + ' for a while now. When I saw the ' + title + ' opening, I knew I had to reach out.\n\nOver the past ' + years + '+ years, I\'ve honed my skills in ' + skills + '. ' + (achievement ? 'One thing I\'m proud of? ' + achievement + '.\n\n' : '\n') + 'I\'d love to grab a virtual coffee and chat about how I can bring my energy and ideas to ' + company + '.\n\nCheers,\n' + name + '\n' + email
    };

    return templates[template] || templates.standard;
  },

  calcYears: function(rd) {
    var total = 0;
    (rd.experience || []).forEach(function(exp) {
      var dates = (exp.dates || '').match(/(\d{4})/g);
      if (dates && dates.length >= 2) total += parseInt(dates[1]) - parseInt(dates[0]);
    });
    return total || (rd.experience || []).length * 3;
  },

  getAchievement: function(rd) {
    var best = '';
    (rd.experience || []).forEach(function(exp) {
      (exp.bullets || '').split('\n').forEach(function(b) {
        var clean = b.replace(/^[•\-\*\s]+/, '').trim();
        if (clean.length > best.length && /\d+%|\$\d+|increased|reduced|achieved|delivered|launched/i.test(clean)) {
          best = clean;
        }
      });
    });
    return best;
  }
};

function showCoverLetterPro() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  
  var existing = document.getElementById('cover-pro-modal');
  if (existing) existing.remove();
  
  var modal = document.createElement('div');
  modal.id = 'cover-pro-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  var templateOptions = Object.entries(CoverLetterPro.templates).map(function(e) {
    return '<option value="'+e[0]+'">'+e[1].name+'</option>';
  }).join('');
  
  var jt = App.jobTarget || {};
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:650px;width:90%;max-height:85vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">📝 Cover Letter Pro</h2><button onclick="document.getElementById(\'cover-pro-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;"><div><label style="font-size:0.8rem;font-weight:600;">Job Title:</label><input id="clp-title" value="'+ (jt.title || '') +'" placeholder="e.g., Senior Developer" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:2px;"></div><div><label style="font-size:0.8rem;font-weight:600;">Company:</label><input id="clp-company" value="'+ (jt.company || '') +'" placeholder="e.g., Google" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:2px;"></div></div><div style="margin-bottom:12px;"><label style="font-size:0.8rem;font-weight:600;">Template Style:</label><select id="clp-template" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:2px;">'+templateOptions+'</select></div><button onclick="generateCoverLetterPro()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-bottom:12px;">Generate Cover Letter</button><textarea id="clp-output" readonly style="width:100%;height:250px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;font-family:Georgia,serif;line-height:1.6;background:#f9fafb;display:none;"></textarea><button onclick="copyCoverLetterPro()" id="clp-copy-btn" style="width:100%;padding:10px;background:#10b981;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;display:none;">Copy to Clipboard</button></div>';
  document.body.appendChild(modal);
}

function generateCoverLetterPro() {
  var jd = {
    title: document.getElementById('clp-title').value,
    company: document.getElementById('clp-company').value
  };
  var template = document.getElementById('clp-template').value;
  var letter = CoverLetterPro.generate(App.resumeData, jd, template);
  
  document.getElementById('clp-output').value = letter;
  document.getElementById('clp-output').style.display = 'block';
  document.getElementById('clp-copy-btn').style.display = 'block';
}

function copyCoverLetterPro() {
  var text = document.getElementById('clp-output');
  text.select();
  document.execCommand('copy');
  showSuccess('Cover letter copied!');
}