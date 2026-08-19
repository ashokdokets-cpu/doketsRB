// Enhanced AI Cover Letter Generator
// Extends existing generateCoverLetter() with templates and job-specific customization
// Does NOT replace generateCoverLetter()

const coverLetterEngine = {
  templates: {
    standard: {
      name: 'Standard Professional',
      intro: 'I am writing to express my strong interest in the {title} position at {company}. With {years}+ years of experience in {field}, I am confident in my ability to contribute to your team.',
      body: 'Throughout my career, I have developed expertise in {skills}. At {recentCompany}, I successfully {achievement}. I am particularly drawn to {company} because of {reason}.',
      closing: 'I would welcome the opportunity to discuss how my background aligns with {company}\'s goals. Thank you for your consideration.'
    },
    bold: {
      name: 'Bold & Direct',
      intro: 'Your search for a {title} ends here. I bring {years}+ years of driving results in {field}, and I\'m ready to deliver at {company}.',
      body: 'Here\'s what I bring: {skills}. My proudest achievement? {achievement}. I thrive in environments that value {reason}, which is exactly what drew me to {company}.',
      closing: 'Let\'s schedule a call. I\'ll show you exactly how I can move the needle at {company}.'
    },
    storytelling: {
      name: 'Storytelling',
      intro: 'The moment I discovered my passion for {field} was when {achievement}. Since then, I\'ve dedicated my career to mastering {skills}.',
      body: 'At {recentCompany}, I learned that {reason}. This insight drives everything I do. I see an opportunity at {company} to apply these lessons and create meaningful impact.',
      closing: 'I\'d love to share more stories and learn about {company}\'s vision. Thank you for reading.'
    }
  },

  generate: function(resumeData, jobData, templateKey) {
    var rd = resumeData;
    var jd = jobData || {};
    var tpl = this.templates[templateKey] || this.templates.standard;
    
    var recentExp = rd.experience && rd.experience[0] ? rd.experience[0] : null;
    var skills = (rd.skills || []).slice(0, 5).join(', ');
    var years = this.calculateYears(rd);
    var achievement = this.extractBestBullet(rd);
    
    var data = {
      title: jd.title || 'the position',
      company: jd.company || 'your organization',
      years: years || '5',
      field: recentExp ? recentExp.title : rd.personal.headline || 'this field',
      skills: skills || 'leadership, strategy, and execution',
      recentCompany: recentExp ? recentExp.company : 'my previous role',
      achievement: achievement || 'delivered measurable results',
      reason: jd.reason || 'your reputation for excellence'
    };

    var letter = '';
    letter += this.fillTemplate(tpl.intro, data) + '\n\n';
    letter += this.fillTemplate(tpl.body, data) + '\n\n';
    letter += this.fillTemplate(tpl.closing, data);
    letter += '\n\nSincerely,\n' + (rd.personal.fullName || '[Your Name]');

    return letter;
  },

  fillTemplate: function(template, data) {
    return template.replace(/\{(\w+)\}/g, function(match, key) {
      return data[key] || match;
    });
  },

  calculateYears: function(rd) {
    var total = 0;
    (rd.experience || []).forEach(function(exp) {
      var start = parseInt((exp.startDate || '').match(/\d{4}/));
      var end = parseInt((exp.endDate || '').match(/\d{4}/));
      if (start) total += (end || new Date().getFullYear()) - start;
    });
    return Math.max(1, total);
  },

  extractBestBullet: function(rd) {
    var best = '';
    (rd.experience || []).forEach(function(exp) {
      (exp.bullets || '').split('\n').forEach(function(b) {
        var clean = b.replace(/^[•\-\*\s]+/, '').trim();
        if (clean.length > 30 && /\d+%|\$\d+|increased|reduced|launched|achieved|delivered/i.test(clean)) {
          if (clean.length > best.length) best = clean;
        }
      });
    });
    return best;
  }
};

function showEnhancedCoverLetter() {
if (!App.resumeData || !App.resumeData.personal || !App.resumeData.personal.fullName) {
    showError('Add resume content first.');
    return;
  }
// Pro users get AI-powered cover letter
  if (typeof canAccess === 'function' && canAccess('ai_targeting') && typeof showAICoverLetter === 'function') {
    showAICoverLetter();
    return;
  }


  var existing = document.getElementById('cover-letter-modal');
  if (existing) existing.remove();

  var templatesHTML = '';
  Object.keys(coverLetterEngine.templates).forEach(function(key) {
    var t = coverLetterEngine.templates[key];
    templatesHTML += '<option value="' + key + '">' + t.name + '</option>';
  });

  var modal = document.createElement('div');
  modal.id = 'cover-letter-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:600px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">📝 AI Cover Letter</h2><button onclick="document.getElementById(\'cover-letter-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Job Title:</label><input id="cl-job-title" placeholder="e.g., Senior Developer" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Company:</label><input id="cl-company" placeholder="e.g., Google" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Why this company?</label><input id="cl-reason" placeholder="e.g., innovative culture" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Style:</label><select id="cl-template" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;">' + templatesHTML + '</select></div><button onclick="generateEnhancedCoverLetter()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">✨ Generate Cover Letter</button><div id="cover-letter-output" style="margin-top:16px;display:none;"><textarea id="cover-letter-text" readonly style="width:100%;height:200px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;font-family:Georgia,serif;line-height:1.6;background:#f9fafb;"></textarea><div style="display:flex;gap:8px;margin-top:8px;"><button onclick="copyCoverLetterEnhanced()" style="flex:1;padding:8px;background:#10b981;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Copy</button><button onclick="regenerateCoverLetter()" style="flex:1;padding:8px;background:#6366f1;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;">Regenerate</button></div></div></div>';
  document.body.appendChild(modal);
}

function generateEnhancedCoverLetter() {
  var jobData = {
    title: document.getElementById('cl-job-title').value,
    company: document.getElementById('cl-company').value,
    reason: document.getElementById('cl-reason').value
  };
  var template = document.getElementById('cl-template').value;
  var letter = coverLetterEngine.generate(App.resumeData, jobData, template);
  
  document.getElementById('cover-letter-text').value = letter;
  document.getElementById('cover-letter-output').style.display = 'block';
}

function copyCoverLetterEnhanced() {
  var text = document.getElementById('cover-letter-text');
  text.select();
  document.execCommand('copy');
  showSuccess('Cover letter copied!');
}

function regenerateCoverLetter() {
  generateEnhancedCoverLetter();
  showSuccess('Cover letter regenerated!');
}