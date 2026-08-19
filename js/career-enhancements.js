// Career Enhancements - Safe AI Features
// Adds: AI Match Score, Resume Translation, Interview Scoring, Enhanced Batch Search
// Does NOT modify existing files - works alongside them

var CareerEnhancements = {
  // ============================================
  // PRIORITY 1: AI MATCH SCORE (JD Fit %)
  // ============================================
  matchScore: {
    show: function() {
      if (!canAccess('ai_targeting')) { upgradePrompt('AI Match Score'); return; }
      var jd = (window.App && App.jobTarget && App.jobTarget.description) ? App.jobTarget.description : '';
      var resume = (window.App && App.resumeData) ? App.resumeData : {};
      
      if (!jd) {
        var jdModal = document.createElement('div');
        jdModal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10001;display:flex;align-items:center;justify-content:center;';
        jdModal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;"><h2 style="font-weight:700;margin-bottom:16px;">Paste Job Description</h2><textarea id="jd-input" placeholder="Paste the job description here..." style="width:100%;height:150px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px;"></textarea><button onclick="CareerEnhancements.matchScore.calculateWithJD()" style="width:100%;padding:12px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Score Match</button></div>';
        document.body.appendChild(jdModal);
        return;
      }
      
      showLoader();
      
      // Use existing AI API for matching
      fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'match_score',
          jobDescription: jd,
          resumeData: resume
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        hideLoader();
        if (d.success && d.data && d.data.score) {
          CareerEnhancements.matchScore.display(d.data);
        } else {
          // Fallback to local calculation
          CareerEnhancements.matchScore.localCalc(jd, resume);
        }
      })
      .catch(function() {
        hideLoader();
        CareerEnhancements.matchScore.localCalc(jd, resume);
      });
    },
    
    localCalc: function(jd, resume) {
      // Simple keyword matching as fallback
      var jdText = jd.toLowerCase();
      var skills = (resume.skills || []).join(' ').toLowerCase();
      var summary = (resume.summary || '').toLowerCase();
      var allText = skills + ' ' + summary;
      
      // Extract keywords from JD
      var words = jdText.split(/\W+/).filter(function(w) { return w.length > 3; });
      var keywords = {};
      words.forEach(function(w) {
        if (!keywords[w] && allText.includes(w)) keywords[w] = true;
      });
      
      var matched = Object.keys(keywords).length;
      var total = words.length || 1;
      var score = Math.round((matched / total) * 100);
      
      this.display({
        score: score,
        matched: Object.keys(keywords),
        missing: words.filter(function(w) { return !keywords[w]; }).slice(0, 10),
        summary: 'Local calculation (AI unavailable)'
      });
    },
    
    calculateWithJD: function() {
      var jd = document.getElementById('jd-input').value;
      if (!jd || jd.length < 20) { showError('Please paste a valid job description.'); return; }
      document.querySelector('#jd-input').parentElement.parentElement.remove();
      var resume = (window.App && App.resumeData) ? App.resumeData : {};
      showLoader();
      fetch('/api/ai-analyze', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'match_score', jobDescription: jd, resumeData: resume }) })
      .then(function(r) { return r.json(); })
      .then(function(d) { hideLoader(); if (d.success && d.data && d.data.score) { CareerEnhancements.matchScore.display(d.data); } else { CareerEnhancements.matchScore.localCalc(jd, resume); } })
      .catch(function() { hideLoader(); CareerEnhancements.matchScore.localCalc(jd, resume); });
    },
    
    display: function(data) {
      var modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      
      var html = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;max-height:85vh;overflow-y:auto;">';
      html += '<h2 style="font-weight:700;margin-bottom:8px;">AI Match Score</h2>';
      html += '<div style="text-align:center;margin:20px 0;">';
      html += '<div style="font-size:48px;font-weight:800;color:' + (data.score >= 70 ? '#10b981' : data.score >= 40 ? '#f59e0b' : '#ef4444') + ';">' + data.score + '%</div>';
      html += '<p style="color:#6b7280;">Job Fit Score</p>';
      html += '</div>';
      
      if (data.matched && data.matched.length > 0) {
        html += '<h3 style="font-size:14px;font-weight:600;color:#10b981;margin-bottom:8px;">✓ Matched Keywords</h3>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">';
        data.matched.slice(0, 15).forEach(function(k) {
          html += '<span style="background:#f0fdf4;color:#10b981;padding:3px 10px;border-radius:12px;font-size:11px;">' + k + '</span>';
        });
        html += '</div>';
      }
      
      if (data.missing && data.missing.length > 0) {
        html += '<h3 style="font-size:14px;font-weight:600;color:#ef4444;margin-bottom:8px;">✗ Missing Keywords</h3>';
        html += '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
        data.missing.slice(0, 15).forEach(function(k) {
          html += '<span style="background:#fef2f2;color:#ef4444;padding:3px 10px;border-radius:12px;font-size:11px;">' + k + '</span>';
        });
        html += '</div>';
      }
      
      html += '<button onclick="this.parentElement.parentElement.remove()" style="width:100%;padding:10px;background:#f3f4f6;border:none;border-radius:8px;cursor:pointer;margin-top:20px;">Close</button>';
      html += '</div>';
      
      modal.innerHTML = html;
      document.body.appendChild(modal);
    }
  },

  // ============================================
  // PRIORITY 2: RESUME CONTENT TRANSLATION
  // ============================================
  translator: {
    show: function() {
      if (!canAccess('ai_targeting')) { upgradePrompt('Premium Feature'); return; }
      var modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      
      var languages = ['Spanish', 'French', 'German', 'Hindi', 'Arabic', 'Chinese', 'Japanese', 'Korean', 'Portuguese', 'Russian'];
      var html = '<div style="background:white;border-radius:16px;padding:24px;max-width:400px;width:90%;">';
      html += '<h2 style="font-weight:700;margin-bottom:16px;">🌍 Translate Resume Content</h2>';
      html += '<p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Translate your resume sections to another language.</p>';
      html += '<select id="resume-translate-lang" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:16px;">';
      languages.forEach(function(l) {
        html += '<option value="' + l.toLowerCase() + '">' + l + '</option>';
      });
      html += '</select>';
      html += '<button onclick="CareerEnhancements.translator.translate()" style="width:100%;padding:12px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Translate Resume</button>';
      html += '</div>';
      
      modal.innerHTML = html;
      document.body.appendChild(modal);
    },
    
    translate: function() {
      var lang = document.getElementById('resume-translate-lang').value;
      var rd = (window.App && App.resumeData) ? App.resumeData : {};
      
      showLoader();
      
      fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'translate_resume',
          targetLanguage: lang,
          resumeData: rd
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        hideLoader();
        if (d.success && d.data) {
          if (window.App) {
            App.resumeData = d.data;
            saveToStorage();
            if (typeof refreshView === 'function') refreshView();
          }
          showSuccess('Resume translated to ' + lang + '!');
        } else {
          // Fallback: Open Google Translate
          var url = 'https://translate.google.com/translate?hl=' + lang + '&sl=en&tl=' + lang + '&u=' + encodeURIComponent(window.location.href);
          window.open(url, '_blank');
          showSuccess('Opened Google Translate (AI translation unavailable)');
        }
        document.querySelector('#resume-translate-lang').parentElement.parentElement.remove();
      })
      .catch(function() {
        hideLoader();
        var url = 'https://translate.google.com/translate?hl=' + lang + '&sl=en&tl=' + lang + '&u=' + encodeURIComponent(window.location.href);
        window.open(url, '_blank');
      });
    }
  },

  // ============================================
  // PRIORITY 3: INTERVIEW AI SCORING
  // ============================================
  interviewScore: {
    show: function() {
      if (!canAccess('ai_targeting')) { upgradePrompt('Premium Feature'); return; }
      var modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      
      var html = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;max-height:85vh;overflow-y:auto;">';
      html += '<h2 style="font-weight:700;margin-bottom:16px;">🎯 Interview Answer Scoring</h2>';
      html += '<p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Paste your interview answer. AI scores clarity, structure, and STAR method.</p>';
      html += '<textarea id="interview-answer" placeholder="Paste your answer here..." style="width:100%;height:150px;padding:12px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:12px;"></textarea>';
      html += '<button onclick="CareerEnhancements.interviewScore.score()" style="width:100%;padding:12px;background:#10b981;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Score My Answer</button>';
      html += '<div id="interview-score-result" style="margin-top:16px;"></div>';
      html += '</div>';
      
      modal.innerHTML = html;
      document.body.appendChild(modal);
    },
    
    score: function() {
      var answer = document.getElementById('interview-answer').value;
      if (!answer || answer.length < 10) {
        showError('Please paste your answer first.');
        return;
      }
      
      showLoader();
      
      fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'score_interview_answer',
          answer: answer
        })
      })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        hideLoader();
        var resultEl = document.getElementById('interview-score-result');
        if (d.success && d.data) {
          resultEl.innerHTML = '<div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:16px;">' +
            '<div style="font-size:32px;font-weight:800;color:#10b981;">' + (d.data.score || 'N/A') + '/100</div>' +
            '<p style="font-size:0.85rem;color:#374151;">' + (d.data.feedback || '') + '</p></div>';
        } else {
          // Local scoring
          var wordCount = answer.split(' ').length;
          var hasNumbers = /\d+/.test(answer);
          var hasActionVerbs = /led|managed|created|developed|achieved|implemented|improved/i.test(answer);
          var score = 40;
          if (wordCount > 50) score += 20;
          if (hasNumbers) score += 20;
          if (hasActionVerbs) score += 20;
          if (wordCount > 100) score = Math.min(score, 100);
          
          resultEl.innerHTML = '<div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:16px;">' +
            '<div style="font-size:32px;font-weight:800;color:#d97706;">' + score + '/100</div>' +
            '<p style="font-size:0.85rem;">Local scoring (AI unavailable). Tips: Use action verbs, add numbers, use STAR method.</p></div>';
        }
      })
      .catch(function() {
        hideLoader();
        showSuccess('AI scoring unavailable. Try again later.');
      });
    }
  },

  // ============================================
  // PRIORITY 4: ENHANCED BATCH JOB SEARCH
  // ============================================
  batchSearch: {
    show: function() {
      var modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
      
      var html = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;">';
      html += '<h2 style="font-weight:700;margin-bottom:16px;">🔍 Enhanced Job Search</h2>';
      html += '<input id="batch-title" placeholder="Job title" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;">';
      html += '<input id="batch-location" placeholder="Location (optional)" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:16px;">';
      html += '<button onclick="CareerEnhancements.batchSearch.search()" style="width:100%;padding:12px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Search 6 Job Boards</button>';
      html += '</div>';
      
      modal.innerHTML = html;
      document.body.appendChild(modal);
    },
    
    search: function() {
      var title = document.getElementById('batch-title').value || '';
      var location = document.getElementById('batch-location').value || '';
      var query = encodeURIComponent(title + ' ' + location);
      
      var boards = [
        { name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/search/?keywords=' + query },
        { name: 'Indeed', url: 'https://www.indeed.com/jobs?q=' + query },
        { name: 'Glassdoor', url: 'https://www.glassdoor.com/Job/jobs.htm?sc.keyword=' + query },
        { name: 'Monster', url: 'https://www.monster.com/jobs/search?q=' + query },
        { name: 'ZipRecruiter', url: 'https://www.ziprecruiter.com/jobs-search?search=' + query },
        { name: 'Naukri', url: 'https://www.naukri.com/' + encodeURIComponent(title) + '-jobs' }
      ];
      
      // Open with delay to avoid popup blocking
      boards.forEach(function(board, index) {
        setTimeout(function() {
          window.open(board.url, '_blank');
        }, index * 500);
      });
      
      document.querySelector('#batch-title').parentElement.parentElement.remove();
      showSuccess('Opened 6 job boards!');
    }
  }
};

// Export to global
var CareerEnhancements = CareerEnhancements;
window.CareerEnhancements = CareerEnhancements;