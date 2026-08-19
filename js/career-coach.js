// Dokets Career Coach
// AI-powered career path suggestions and skill recommendations

const CareerCoach = {
  careerPaths: {
    tech: {
      paths: ['Software Engineer → Senior → Tech Lead → Architect → CTO', 'Developer → DevOps Engineer → SRE → Platform Architect', 'Data Analyst → Data Scientist → ML Engineer → AI Architect'],
      skills: ['Cloud Computing (AWS/Azure)', 'System Design', 'Machine Learning', 'Kubernetes', 'CI/CD', 'Python', 'Go', 'Rust'],
      certifications: ['AWS Solutions Architect', 'Google Cloud Professional', 'Kubernetes CKA', 'TOGAF']
    },
    finance: {
      paths: ['Analyst → Associate → VP → Director → MD', 'Accountant → Senior → Manager → Controller → CFO', 'Advisor → Wealth Manager → Portfolio Manager → CIO'],
      skills: ['Financial Modeling', 'Risk Management', 'CFA/CPA', 'Bloomberg Terminal', 'Python for Finance', 'M&A'],
      certifications: ['CFA', 'CPA', 'FRM', 'CMA']
    },
    marketing: {
      paths: ['Specialist → Manager → Director → VP Marketing → CMO', 'Content Writer → SEO Manager → Growth Lead → Head of Growth'],
      skills: ['SEO/SEM', 'Content Strategy', 'Data Analytics', 'Marketing Automation', 'Brand Management', 'Social Media'],
      certifications: ['Google Analytics', 'HubSpot', 'Facebook Blueprint', 'PMP']
    },
    hr: {
      paths: ['HR Generalist → HR Manager → HR Director → CHRO', 'Recruiter → Talent Acquisition Lead → Head of TA → VP People'],
      skills: ['HRIS', 'People Analytics', 'Employment Law', 'Organizational Development', 'DEI Strategy', 'Compensation'],
      certifications: ['SHRM-CP', 'PHR', 'CEBS', 'ATD']
    },
    healthcare: {
      paths: ['Staff Nurse → Charge Nurse → Nurse Manager → Director of Nursing → CNO', 'Resident → Fellow → Attending → Department Chief → CMO'],
      skills: ['Electronic Health Records', 'Clinical Research', 'Healthcare Administration', 'Patient Safety', 'Telemedicine'],
      certifications: ['NCLEX-RN', 'BLS/ACLS', 'CCRN', 'NEA-BC']
    }
  },

  analyze: function(resumeData) {
    var rd = resumeData || {};
    var text = JSON.stringify(rd).toLowerCase();
    var industry = 'tech';
    
    if (text.match(/finance|accounting|bank|invest|audit/i)) industry = 'finance';
    else if (text.match(/market|brand|seo|content|advertis/i)) industry = 'marketing';
    else if (text.match(/hr |human resource|recruit|talent/i)) industry = 'hr';
    else if (text.match(/health|medical|clinical|nurse|patient/i)) industry = 'healthcare';
    
    var data = this.careerPaths[industry] || this.careerPaths.tech;
    var currentSkills = (rd.skills || []).map(function(s){ return s.toLowerCase(); });
    var missingSkills = data.skills.filter(function(s){ 
      return !currentSkills.some(function(cs){ return s.toLowerCase().includes(cs) || cs.includes(s.toLowerCase()); });
    });
    
    var years = 0;
    (rd.experience || []).forEach(function(exp) {
      var dates = (exp.dates || '').match(/(\d{4})/g);
      if (dates && dates.length >= 2) years += parseInt(dates[1]) - parseInt(dates[0]);
    });
    years = years || (rd.experience || []).length * 3;
    
    var level = years < 3 ? 'Entry Level' : years < 7 ? 'Mid Level' : years < 12 ? 'Senior' : 'Executive';
    
    return { industry: industry, level: level, paths: data.paths, missingSkills: missingSkills.slice(0, 5), certifications: data.certifications.slice(0, 3) };
  }
};

function showCareerCoach() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  if (!App.resumeData?.personal?.fullName) { showError('Add resume content first.'); return; }
  
  var analysis = CareerCoach.analyze(App.resumeData);
  
  var existing = document.getElementById('career-modal');
  if (existing) existing.remove();
  
  var modal = document.createElement('div');
  modal.id = 'career-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:550px;width:90%;max-height:85vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">🎯 Career Coach</h2><button onclick="document.getElementById(\'career-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><div style="text-align:center;margin-bottom:16px;padding:16px;background:#f9fafb;border-radius:10px;"><div style="font-size:1.5rem;font-weight:700;color:#2563eb;">'+analysis.level+'</div><div style="font-size:0.85rem;color:#6b7280;">'+analysis.industry.charAt(0).toUpperCase()+analysis.industry.slice(1)+' Industry</div></div><div style="margin-bottom:12px;"><h3 style="font-weight:600;font-size:0.9rem;margin-bottom:6px;">📈 Career Paths:</h3>'+analysis.paths.map(function(p){ return '<div style="padding:8px;background:#f0fdf4;border-radius:6px;font-size:0.8rem;margin-bottom:4px;color:#166534;">'+p+'</div>'; }).join('')+'</div><div style="margin-bottom:12px;"><h3 style="font-weight:600;font-size:0.9rem;margin-bottom:6px;">📚 Skills to Learn:</h3>'+analysis.missingSkills.map(function(s){ return '<div style="padding:6px 10px;background:#eff6ff;border-radius:6px;font-size:0.8rem;margin-bottom:3px;color:#1e40af;">📖 '+s+'</div>'; }).join('')+'</div><div style="margin-bottom:12px;"><h3 style="font-weight:600;font-size:0.9rem;margin-bottom:6px;">🎓 Recommended Certifications:</h3>'+analysis.certifications.map(function(c){ return '<div style="padding:6px 10px;background:#fef3c7;border-radius:6px;font-size:0.8rem;margin-bottom:3px;color:#92400e;">🏅 '+c+'</div>'; }).join('')+'</div></div>';
  document.body.appendChild(modal);
}