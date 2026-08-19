// Enhanced Resume Scoring
// Adds detailed scoring with section-by-section breakdown
// Extends existing getATSScore() and getProATSScore() - does not replace them

const enhancedScorer = {
  analyze: function(resumeData) {
    if (!resumeData) return null;
    var rd = resumeData;
    
    var scores = {
      sections: {},
      overall: 0,
      grade: '',
      tips: []
    };

    // 1. Personal Info (10 pts)
    var personalScore = 0;
    if (rd.personal) {
      if (rd.personal.fullName) personalScore += 3;
      if (rd.personal.email) personalScore += 2;
      if (rd.personal.phone) personalScore += 2;
      if (rd.personal.location) personalScore += 1;
      if (rd.personal.linkedin) personalScore += 2;
    }
    scores.sections.personal = { score: personalScore, max: 10, label: 'Personal Info' };
    if (personalScore < 8) scores.tips.push('Add LinkedIn profile and location to your personal info.');

    // 2. Summary (15 pts)
    var summaryScore = 0;
    var summary = rd.summary || '';
    if (summary.length > 50) summaryScore += 5;
    if (summary.length > 100) summaryScore += 3;
    if (summary.length > 200) summaryScore += 2;
    if (/\d+ years|experience|expertise|specialize/i.test(summary)) summaryScore += 3;
    if (/\b(led|managed|delivered|achieved|increased|reduced)\b/i.test(summary)) summaryScore += 2;
    scores.sections.summary = { score: summaryScore, max: 15, label: 'Summary' };
    if (summaryScore < 10) scores.tips.push('Strengthen your summary with years of experience and key achievements.');

    // 3. Experience (30 pts)
    var expScore = 0;
    var exps = rd.experience || [];
    expScore += Math.min(exps.length * 5, 10);
    exps.forEach(function(exp) {
      var bullets = (exp.bullets || '').split('\n').filter(function(b) { return b.trim(); });
      expScore += Math.min(bullets.length * 2, 6);
      bullets.forEach(function(b) {
        if (/\d+%|\$\d+|\d+ (users|customers|clients|hours)/i.test(b)) expScore += 2;
        if (/\b(led|managed|delivered|achieved|increased|reduced|launched|built)\b/i.test(b)) expScore += 1;
      });
    });
    expScore = Math.min(expScore, 30);
    scores.sections.experience = { score: expScore, max: 30, label: 'Experience' };
    if (expScore < 20) scores.tips.push('Add measurable achievements (%, $, numbers) to your experience bullets.');

    // 4. Skills (15 pts)
    var skillScore = 0;
    var skills = rd.skills || [];
    skillScore += Math.min(skills.length, 15);
    scores.sections.skills = { score: skillScore, max: 15, label: 'Skills' };
    if (skillScore < 10) scores.tips.push('Add more relevant skills (aim for 10-15 keywords from job descriptions).');

    // 5. Education (10 pts)
    var eduScore = 0;
    var edus = rd.education || [];
    eduScore += Math.min(edus.length * 5, 10);
    scores.sections.education = { score: eduScore, max: 10, label: 'Education' };
    if (eduScore === 0) scores.tips.push('Add your education section even if you have work experience.');

    // 6. ATS Keywords (20 pts)
    var atsScore = 0;
    var allText = JSON.stringify(rd).toLowerCase();
    var atsKeywords = ['managed','led','developed','implemented','achieved','increased','reduced','created','launched','analyzed','coordinated','designed','improved','resolved','trained','supervised','budget','revenue','strategy','team','project','process','client','stakeholder'];
    var foundKeywords = atsKeywords.filter(function(k) { return allText.includes(k); });
    atsScore = Math.min(foundKeywords.length, 20);
    scores.sections.ats = { score: atsScore, max: 20, label: 'ATS Keywords' };
    if (atsScore < 12) scores.tips.push('Add more action verbs and industry keywords for ATS optimization.');

    // Calculate overall
    var total = 0;
    var maxTotal = 0;
    Object.keys(scores.sections).forEach(function(key) {
      total += scores.sections[key].score;
      maxTotal += scores.sections[key].max;
    });
    scores.overall = Math.round((total / maxTotal) * 100);

    // Assign grade
    if (scores.overall >= 90) scores.grade = 'A+ Outstanding';
    else if (scores.overall >= 80) scores.grade = 'A Excellent';
    else if (scores.overall >= 70) scores.grade = 'B+ Very Good';
    else if (scores.overall >= 60) scores.grade = 'B Good';
    else if (scores.overall >= 50) scores.grade = 'C Average';
    else scores.grade = 'D Needs Improvement';

    return scores;
  }
};

function showEnhancedScore() {
  if (!App.resumeData || !App.resumeData.personal || !App.resumeData.personal.fullName) {
    showError('Add some content first to see your score.');
    return;
  }

  var result = enhancedScorer.analyze(App.resumeData);
  if (!result) { showError('Could not analyze resume.'); return; }

  var existing = document.getElementById('scoring-modal');
  if (existing) existing.remove();

  var gradeColor = result.overall >= 80 ? '#10b981' : result.overall >= 60 ? '#f59e0b' : '#ef4444';

  var sectionHTML = '';
  Object.keys(result.sections).forEach(function(key) {
    var s = result.sections[key];
    var pct = Math.round((s.score / s.max) * 100);
    var barColor = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
    sectionHTML += '<div style="margin-bottom:10px;"><div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:2px;"><span>' + s.label + '</span><span style="font-weight:600;">' + s.score + '/' + s.max + '</span></div><div style="background:#e5e7eb;border-radius:4px;height:6px;"><div style="background:' + barColor + ';height:100%;width:' + pct + '%;border-radius:4px;"></div></div></div>';
  });

  var tipsHTML = result.tips.length > 0 ? result.tips.map(function(t) { return '<div style="padding:8px 12px;background:#fffbeb;border-radius:6px;font-size:0.8rem;margin-bottom:4px;color:#92400e;">💡 ' + t + '</div>'; }).join('') : '<div style="color:#10b981;font-size:0.85rem;">✅ Your resume is well-optimized!</div>';

  var modal = document.createElement('div');
  modal.id = 'scoring-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:480px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">📊 Resume Score</h2><button onclick="document.getElementById(\'scoring-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button></div><div style="text-align:center;margin-bottom:20px;padding:20px;background:#f9fafb;border-radius:12px;"><div style="font-size:3.5rem;font-weight:800;color:' + gradeColor + ';">' + result.overall + '%</div><div style="font-size:1.1rem;font-weight:600;color:' + gradeColor + ';margin-top:4px;">' + result.grade + '</div></div><div style="margin-bottom:16px;">' + sectionHTML + '</div><div style="margin-top:16px;"><h3 style="font-weight:600;font-size:0.9rem;margin-bottom:8px;">Improvement Tips</h3>' + tipsHTML + '</div></div>';
  document.body.appendChild(modal);
}