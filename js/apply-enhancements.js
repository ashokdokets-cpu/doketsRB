// Application Enhancements - Safe Job Search Tools
// Adds: Better Quick Apply, Screening Question Bank, Application Checklist, Batch Job Search

var ApplyEnhancements = {
  // ============================================
  // ENHANCEMENT 1: BETTER QUICK APPLY (Clipboard Copy)
  // ============================================
  quickApply: {
    show: function(jobTitle, company) {
      // Detect user location
      var userLoc = (window.App && App.resumeData && App.resumeData.personal && App.resumeData.personal.location) || '';
      userLoc = userLoc.toLowerCase();
      var isIndia = /india|mumbai|delhi|bangalore|bengaluru|hyderabad|chennai|pune|kolkata/i.test(userLoc);
      var isUK = /uk|london|manchester|birmingham|edinburgh/i.test(userLoc);
      var isAU = /australia|sydney|melbourne|brisbane|perth/i.test(userLoc);
      var isSG = /singapore/i.test(userLoc);
      var isBR = /brazil|brasil|sao paulo|rio/i.test(userLoc);
      const modal = document.createElement('div');
      modal.id = 'quick-apply-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      
      let html = '<div style="background:white;border-radius:16px;padding:24px;max-width:550px;width:90%;max-height:85vh;overflow-y:auto;">';
      html += '<h2 style="font-weight:700;margin-bottom:16px;">⚡ Quick Apply - ' + (jobTitle || '') + '</h2>';
      html += '<p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Your resume data is copied to clipboard. Paste it into the application form.</p>';
      
      // Copy resume data to clipboard
      const resumeText = this.buildResumeText();
      navigator.clipboard.writeText(resumeText);
      
      // Show resume preview
      html += '<div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:16px;max-height:200px;overflow-y:auto;font-size:0.8rem;white-space:pre-wrap;">' + resumeText + '</div>';
      
      // Job board buttons (location-based)
      html += '<button onclick="ApplyEnhancements.quickApply.openBoard(\'linkedin\',\'' + (jobTitle||'') + '\',\'' + (company||'') + '\')" style="padding:12px;background:#0077b5;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">LinkedIn</button>';
      if (isIndia) { html += '<button onclick="ApplyEnhancements.quickApply.openBoard(\'naukri\',\'' + (jobTitle||'') + '\',\'' + (company||'') + '\')" style="padding:12px;background:#ff7555;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Naukri</button>'; }
      else if (isUK) { html += '<button onclick="ApplyEnhancements.quickApply.openBoard(\'reed\',\'' + (jobTitle||'') + '\',\'' + (company||'') + '\')" style="padding:12px;background:#0066cc;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Reed</button>'; }
      else if (isAU) { html += '<button onclick="ApplyEnhancements.quickApply.openBoard(\'seek\',\'' + (jobTitle||'') + '\',\'' + (company||'') + '\')" style="padding:12px;background:#e60278;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Seek</button>'; }
      else if (isSG) { html += '<button onclick="ApplyEnhancements.quickApply.openBoard(\'mycareersfuture\',\'' + (jobTitle||'') + '\',\'' + (company||'') + '\')" style="padding:12px;background:#0066cc;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">MyCareersFuture</button>'; }
      else if (isBR) { html += '<button onclick="ApplyEnhancements.quickApply.openBoard(\'catho\',\'' + (jobTitle||'') + '\',\'' + (company||'') + '\')" style="padding:12px;background:#ff6600;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Catho</button>'; }
      else { html += '<button onclick="ApplyEnhancements.quickApply.openBoard(\'indeed\',\'' + (jobTitle||'') + '\',\'' + (company||'') + '\')" style="padding:12px;background:#2164f3;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Indeed</button>'; }
      html += '<button onclick="ApplyEnhancements.quickApply.openBoard(\'monster\',\'' + (jobTitle||'') + '\',\'' + (company||'') + '\')" style="padding:12px;background:#6f3ff5;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Monster</button>';
      html += '</div>';
      
      html += '<button onclick="document.getElementById(\'quick-apply-modal\').remove()" style="width:100%;padding:10px;background:#f3f4f6;border:none;border-radius:8px;cursor:pointer;margin-top:12px;">Close</button>';
      html += '</div>';
      
      modal.innerHTML = html;
      document.body.appendChild(modal);
    },
    
    buildResumeText: function() {
      const rd = (window.App && App.resumeData) ? App.resumeData : {};
      const p = rd.personal || {};
      let text = (p.fullName || '') + '\n';
      text += (p.email || '') + ' | ' + (p.phone || '') + '\n';
      text += (p.location || '') + '\n\n';
      text += (rd.summary || '') + '\n\n';
      
      if (rd.experience && rd.experience.length > 0) {
        text += 'EXPERIENCE\n';
        rd.experience.forEach(function(exp) {
          text += (exp.title || '') + ' at ' + (exp.company || '') + '\n';
          if (exp.bullets) text += exp.bullets + '\n';
          text += '\n';
        });
      }
      
      if (rd.skills && rd.skills.length > 0) {
        text += 'SKILLS: ' + rd.skills.join(', ') + '\n';
      }
      
      return text;
    },
    
    openBoard: function(platform, title, company) {
      if (typeof quickApply === 'function') {
        quickApply(platform, title, company);
      }
      document.getElementById('quick-apply-modal').remove();
    }
  },

  // ============================================
  // ENHANCEMENT 2: SCREENING QUESTION BANK
  // ============================================
  questionBank: {
    questions: [
      { q: 'Tell me about yourself', a: 'I am a [role] with [X] years of experience in [industry]. In my current role at [company], I have [key achievement]. I am passionate about [field] and am looking to leverage my skills in [skill1] and [skill2] to contribute to [target company]' },
      { q: 'Why do you want to work here?', a: 'I admire [company] because of [specific reason]. Your work in [industry/area] aligns with my passion for [field]. I believe my experience in [skill1] would allow me to contribute immediately to [specific team/project]' },
      { q: 'Describe a time you led a team', a: 'At [company], I led a team of [X] people to [achieve goal]. I organized [process], delegated [tasks], and ensured [outcome]. As a result, we [measurable result within timeframe]' },
      { q: 'What is your greatest strength?', a: 'My greatest strength is [strength]. For example, at [company], I used this to [specific achievement with metrics]. This strength has consistently helped me [positive outcome]' },
      { q: 'What is your greatest weakness?', a: 'I tend to [weakness]. However, I have been actively working on this by [improvement action]. As a result, I have seen [positive change]. I believe this self-awareness makes me more effective' },
      { q: 'Where do you see yourself in 5 years?', a: 'In 5 years, I see myself growing within [company/field] as a [target role]. I want to deepen my expertise in [skill area], take on leadership responsibilities, and contribute to [larger goal]. I am excited about the growth trajectory at [company]' },
      { q: 'Why are you leaving your current job?', a: 'I am grateful for my time at [current company] where I learned [skills]. However, I am looking for new challenges in [area] and believe [target company] offers the perfect environment to grow and make a bigger impact' },
      { q: 'Tell me about a challenge you faced', a: 'At [company], I faced [challenge]. I analyzed the situation, developed a plan to [action], and collaborated with [team] to implement it. This resulted in [measurable outcome]. This experience taught me [lesson]' },
      { q: 'What are your salary expectations?', a: 'Based on my experience and market research for this role, I am looking for a range of [range]. However, I am flexible and open to discussing the full compensation package including benefits' },
      { q: 'Do you have any questions for us?', a: 'Yes, I have a few questions: 1) What does success look like in this role in the first 90 days? 2) How does the team collaborate on projects? 3) What are the biggest challenges the team is currently facing?' }
    ],
    
    show: function() {
      const modal = document.createElement('div');
      if (!canAccess('ai_targeting')) { upgradePrompt('AI Question Bank'); return; }
      modal.id = 'question-bank-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      
      let html = '<div style="background:white;border-radius:16px;padding:24px;max-width:600px;width:90%;max-height:85vh;overflow-y:auto;">';
      html += '<h2 style="font-weight:700;margin-bottom:16px;">📋 Screening Question Bank</h2>';
      html += '<p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Common interview questions with answer templates. Click Copy to copy the answer.</p>';
      
      this.questions.forEach(function(item, i) {
        html += '<div style="border:1px solid #e5e7eb;border-radius:8px;padding:12px;margin-bottom:8px;">';
        html += '<div style="font-weight:600;font-size:0.9rem;margin-bottom:6px;">' + (i+1) + '. ' + item.q + '</div>';
        html += '<div style="font-size:0.8rem;color:#6b7280;margin-bottom:8px;">' + item.a.substring(0, 100) + '...</div>';
        html += '<button onclick="ApplyEnhancements.questionBank.generateAI(' + i + ')" style="padding:6px 12px;background:#10b981;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;margin-right:4px;">🤖 AI</button><button onclick="ApplyEnhancements.questionBank.copy(' + i + ')" style="padding:6px 12px;background:#6366f1;color:white;border:none;border-radius:6px;cursor:pointer;font-size:0.75rem;">📋 Copy Answer</button>';
        html += '</div>';
      });
      
      html += '<button onclick="document.getElementById(\'question-bank-modal\').remove()" style="width:100%;padding:10px;background:#f3f4f6;border:none;border-radius:8px;cursor:pointer;margin-top:12px;">Close</button>';
      html += '</div>';
      
      modal.innerHTML = html;
      document.body.appendChild(modal);
    },
    
    copy: function(index) {
      const answer = this.questions[index].a;
      navigator.clipboard.writeText(answer);
      showSuccess('Answer copied to clipboard!');
    },
    
    generateAI: function(index) {
      const question = this.questions[index].q;
      const resumeData = (window.App && App.resumeData) ? App.resumeData : {};
      
      showLoader();
      
      fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'interview_answer',
          question: question,
          resumeData: resumeData
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        hideLoader();
        if (d.success && d.data && d.data.answer) {
          ApplyEnhancements.questionBank.questions[index].a = d.data.answer;
          var answerEl = document.getElementById('ai-answer-' + index);
          if (answerEl) {
            answerEl.textContent = d.data.answer;
            answerEl.style.display = 'block';
          }
          showSuccess('AI answer generated from your resume!');
        } else {
          showSuccess('Using template (AI unavailable)');
        }
      })
      .catch(function() {
        hideLoader();
        showSuccess('Using template (AI unavailable)');
      });
    }
  },

  // ============================================
  // ENHANCEMENT 3: APPLICATION CHECKLIST
  // ============================================
  checklist: {
    items: [
      'Resume tailored for this specific job',
      'Cover letter customized with company name',
      'LinkedIn profile updated and matches resume',
      'Portfolio or work samples ready (if applicable)',
      'References contacted and prepared',
      'Salary range researched for this role and location',
      'Company research completed (products, culture, news)',
      'Interview outfit prepared (if in-person)',
      'Questions prepared for the interviewer',
      'Application deadline noted in calendar'
    ],
    
    show: function(jobTitle) {
      const modal = document.createElement('div');
      modal.id = 'checklist-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      
      let html = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;max-height:85vh;overflow-y:auto;">';
      html += '<h2 style="font-weight:700;margin-bottom:16px;">✅ Application Checklist</h2>';
      html += '<p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Complete these steps before submitting your application.</p>';
      
      this.items.forEach(function(item, i) {
        html += '<label style="display:flex;align-items:start;gap:8px;padding:8px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:6px;cursor:pointer;">';
        html += '<input type="checkbox" id="check-' + i + '" style="margin-top:3px;">';
        html += '<span style="font-size:0.85rem;">' + item + '</span>';
        html += '</label>';
      });
      
      html += '<button onclick="document.getElementById(\'checklist-modal\').remove()" style="width:100%;padding:10px;background:#f3f4f6;border:none;border-radius:8px;cursor:pointer;margin-top:12px;">Close</button>';
      html += '</div>';
      
      modal.innerHTML = html;
      document.body.appendChild(modal);
    }
  },

  // ============================================
  // ENHANCEMENT 4: BATCH JOB SEARCH
  // ============================================
  batchSearch: {
    show: function() {
      const modal = document.createElement('div');
      modal.id = 'batch-search-modal';
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      
      let html = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;">';
      html += '<h2 style="font-weight:700;margin-bottom:16px;">🔍 Batch Job Search</h2>';
      html += '<p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Search multiple job boards simultaneously. Results open in new tabs.</p>';
      
      html += '<input id="batch-job-title" placeholder="Job title (e.g., Frontend Developer)" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;">';
      html += '<input id="batch-job-location" placeholder="Location (e.g., Remote, New York)" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:16px;">';
      
      html += '<button onclick="ApplyEnhancements.batchSearch.search()" style="width:100%;padding:12px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Search All Boards</button>';
      html += '</div>';
      
      modal.innerHTML = html;
      document.body.appendChild(modal);
    },
    
    search: function() {
      const title = document.getElementById('batch-job-title').value || '';
      const location = document.getElementById('batch-job-location').value || '';
      const query = encodeURIComponent(title + ' ' + location);
      
      // Detect user region
      var userLoc = (window.App && App.resumeData && App.resumeData.personal && App.resumeData.personal.location) || location || '';
      userLoc = userLoc.toLowerCase();
      var isIndia = /india|mumbai|delhi|bangalore|bengaluru|hyderabad|chennai|pune|kolkata/i.test(userLoc);
      var isUK = /uk|london|manchester|birmingham|edinburgh/i.test(userLoc);
      var isAU = /australia|sydney|melbourne|brisbane|perth/i.test(userLoc);
      var isSG = /singapore/i.test(userLoc);
      var isBR = /brazil|brasil|sao paulo|rio/i.test(userLoc);
      // Open all job boards in new tabs
      window.open('https://www.linkedin.com/jobs/search/?keywords=' + query, '_blank');
      setTimeout(function() { if (isAU) { window.open('https://www.seek.com.au/' + encodeURIComponent(title) + '-jobs', '_blank'); }
      else if (isSG) { window.open('https://www.mycareersfuture.gov.sg/search?search=' + query, '_blank'); }
      else if (isBR) { window.open('https://www.catho.com.br/vagas/?q=' + query, '_blank'); }
      else if (isUK) { window.open('https://www.reed.co.uk/jobs/' + encodeURIComponent(title) + '-jobs', '_blank'); }
      else { window.open('https://www.indeed.com/jobs?q=' + query, '_blank'); } }, 500);
      setTimeout(function() { window.open('https://www.naukri.com/' + encodeURIComponent(title) + '-jobs', '_blank'); }, 1000);
      setTimeout(function() { window.open('https://www.monster.com/jobs/search?q=' + query, '_blank'); }, 1500);
      
      document.getElementById('batch-search-modal').remove();
      showSuccess('Opened LinkedIn, Indeed, Naukri, Monster!');
    }
  }
};

window.ApplyEnhancements = ApplyEnhancements;