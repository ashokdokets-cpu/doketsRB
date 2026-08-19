// AI Cover Letter Generator
// Creates personalized cover letters from resume + job description

const coverLetterAI = {
  templates: {
    standard: 'I am writing to express my strong interest in the {title} position at {company}. With {years} years of experience in {field}, I have developed expertise in {skills}. {achievement} I am excited about the opportunity to contribute to {company} and would welcome the chance to discuss my qualifications further.',
    enthusiastic: 'I was thrilled to see the {title} opening at {company}! As a passionate {field} professional with {years} years of experience, I have dedicated my career to {skills}. {achievement} I admire {company}\'s reputation and would love to bring my energy and expertise to your team.',
    concise: 'Please accept this letter as application for the {title} role at {company}. My {years} years in {field} have equipped me with strong {skills} skills. {achievement} I look forward to discussing how I can contribute to {company}\'s success.'
  },

  generate: function(rd, jd) {
    var title = jd.title || 'the position';
    var company = jd.company || 'your organization';
    var field = this.detectField(rd);
    var years = this.calcYears(rd);
    var skills = (rd.skills || []).slice(0, 4).join(', ');
    var achievement = this.getBestAchievement(rd);
    var template = this.templates.standard;
    
    // Pick template based on company type
    if (company.match(/startup|tech|innovative/i)) template = this.templates.enthusiastic;
    else if (company.match(/corporate|enterprise|bank/i)) template = this.templates.concise;

    return template
      .replace('{title}', title)
      .replace('{company}', company)
      .replace('{years}', years || 'several')
      .replace('{field}', field)
      .replace('{skills}', skills || 'leadership and communication')
      .replace('{achievement}', achievement ? 'My key achievement includes ' + achievement + '. ' : '');
  },

  detectField: function(rd) {
    var text = JSON.stringify(rd).toLowerCase();
    if (text.match(/recruit|hr|human resource|talent/i)) return 'Human Resources';
    if (text.match(/software|developer|engineer|program/i)) return 'Software Engineering';
    if (text.match(/sales|business development|account/i)) return 'Business Development';
    if (text.match(/market|brand|seo|content/i)) return 'Marketing';
    if (text.match(/finance|accounting|audit/i)) return 'Finance';
    return rd.experience?.[0]?.title || 'this field';
  },

  calcYears: function(rd) {
    var total = 0;
    (rd.experience || []).forEach(function(exp) {
      var dates = (exp.dates || '').match(/(\d{4})/g);
      if (dates && dates.length >= 2) total += parseInt(dates[1]) - parseInt(dates[0]);
    });
    return total || Math.max(1, (rd.experience || []).length * 3);
  },

  getBestAchievement: function(rd) {
    var best = '';
    (rd.experience || []).forEach(function(exp) {
      (exp.bullets || '').split('\n').forEach(function(b) {
        var clean = b.replace(/^[•\-\*\s]+/, '').trim();
        if (/\d+%|\$\d+|increased|reduced|achieved|delivered|launched/i.test(clean) && clean.length > best.length) {
          best = clean;
        }
      });
    });
    return best;
  }
};

function showAICoverLetter() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  if (!App.resumeData.personal.fullName) { showError('Add resume content first.'); return; }

  var existing = document.getElementById('ai-cover-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'ai-cover-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:600px;width:90%;max-height:85vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">AI Cover Letter</h2><button onclick="document.getElementById(\'ai-cover-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Job Title:</label><input id="acl-title" placeholder="e.g., Senior Developer" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Company:</label><input id="acl-company" placeholder="e.g., Google" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Style:</label><select id="acl-style" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"><option value="standard">Standard Professional</option><option value="enthusiastic">Enthusiastic (Startups)</option><option value="concise">Concise (Corporate)</option></select></div><button onclick="generateAICoverLetter()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-bottom:12px;">Generate Cover Letter</button><div id="acl-output" style="display:none;"><textarea id="acl-text" readonly style="width:100%;height:200px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;font-family:Georgia,serif;line-height:1.6;background:#f9fafb;"></textarea><button onclick="copyAICoverLetter()" style="width:100%;padding:8px;background:#10b981;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;margin-top:8px;">Copy to Clipboard</button></div></div>';
  document.body.appendChild(modal);
}

function generateAICoverLetter() {
  var jd = {
    title: document.getElementById('acl-title').value,
    company: document.getElementById('acl-company').value
  };
  var letter = coverLetterAI.generate(App.resumeData, jd);
  letter = 'Dear Hiring Manager,\n\n' + letter + '\n\nSincerely,\n' + (App.resumeData.personal.fullName || '[Your Name]');
  
  document.getElementById('acl-text').value = letter;
  document.getElementById('acl-output').style.display = 'block';
}

function copyAICoverLetter() {
  var text = document.getElementById('acl-text');
  text.select();
  document.execCommand('copy');
  showSuccess('Cover letter copied!');
}