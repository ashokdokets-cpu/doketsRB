// STAR Method Coach
// Helps rewrite experience bullets using Situation-Task-Action-Result format

const starCoach = {
  patterns: {
    weak: [
      /\b(was responsible for|helped with|worked on|assisted|participated in)\b/gi,
      /\b(did|made|handled|managed to)\b/gi,
      /\b(no results|no metrics|various|multiple|several)\b/gi
    ],
    strong: [
      'Led', 'Drove', 'Spearheaded', 'Orchestrated', 'Engineered',
      'Accelerated', 'Transformed', 'Optimized', 'Launched', 'Delivered'
    ],
    metrics: [
      '%', 'percent', 'revenue', 'savings', 'growth', 'reduction',
      'increase', 'decrease', 'hours', 'dollars', 'users', 'customers',
      'efficiency', 'engagement', 'retention', 'conversion'
    ]
  },

  analyze(bulletText) {
    if (!bulletText || bulletText.length < 10) {
      return { score: 0, issues: ['Too short'], suggestion: 'Add more detail to this bullet.' };
    }

    let score = 100;
    const issues = [];
    const parts = { situation: '', task: '', action: '', result: '' };

    // Check for weak phrases
    this.patterns.weak.forEach(pattern => {
      const match = bulletText.match(pattern);
      if (match) {
        score -= 15 * match.length;
        issues.push('Contains weak phrase: "' + match[0] + '"');
      }
    });

    // Check for metrics (Result)
    const hasMetrics = this.patterns.metrics.some(m => bulletText.toLowerCase().includes(m));
    if (!hasMetrics) {
      score -= 30;
      issues.push('Missing measurable result (add numbers, percentages, or metrics)');
    } else {
      parts.result = '✅ Has measurable result';
    }

    // Check for action verbs (Action)
    const startsWithAction = this.patterns.strong.some(v => 
      bulletText.toLowerCase().startsWith(v.toLowerCase())
    );
    if (!startsWithAction) {
      score -= 20;
      issues.push('Start with a strong action verb');
      parts.action = '⚠️ Needs action verb (e.g., ' + this.patterns.strong.slice(0,3).join(', ') + '...)';
    } else {
      parts.action = '✅ Starts with strong action verb';
    }

    // Check length (too short = missing context, too long = unfocused)
    if (bulletText.length < 40) {
      score -= 15;
      issues.push('Too short - add context (Situation/Task)');
    } else if (bulletText.length > 200) {
      score -= 10;
      issues.push('Too long - make it concise');
    } else {
      parts.situation = '✅ Good context length';
    }

    // Check for specific details vs vague
    if (/\b(various|multiple|several|things|stuff)\b/gi.test(bulletText)) {
      score -= 10;
      issues.push('Replace vague words (various, several) with specifics');
    }

    score = Math.max(0, Math.min(100, score));
    
    return {
      score,
      issues,
      parts,
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Work',
      suggestion: this.generateSuggestion(bulletText, issues)
    };
  },

  generateSuggestion(original, issues) {
    if (issues.length === 0) return 'Great STAR bullet!';

    let suggestion = 'Rewrite using STAR format:\n';
    suggestion += '• Situation: What was the context/problem?\n';
    suggestion += '• Task: What was your responsibility?\n';
    suggestion += '• Action: What specific steps did YOU take?\n';
    suggestion += '• Result: What measurable outcome? (use numbers)\n\n';
    suggestion += 'Example: "Led migration of legacy database to AWS, reducing query time by 60% and saving $50K annually."';
    
    return suggestion;
  },

  coach(original) {
    const analysis = this.analyze(original);
    
    // Find weak phrases and suggest replacements
    let improved = original;
    const replacements = [
      { from: /\bwas responsible for\b/gi, to: 'Led' },
      { from: /\bhelped with\b/gi, to: 'Supported' },
      { from: /\bworked on\b/gi, to: 'Delivered' },
      { from: /\bassisted with\b/gi, to: 'Contributed to' },
      { from: /\bparticipated in\b/gi, to: 'Engaged in' },
      { from: /\bmanaged to\b/gi, to: 'Achieved' }
    ];

    replacements.forEach(r => {
      improved = improved.replace(r.from, r.to);
    });

    return {
      original,
      improved: improved !== original ? improved : null,
      analysis
    };
  }
};

// UI: STAR Coach button on experience bullets
function showStarCoach(bulletIndex, experienceIndex) {
  if (!canAccess('ai_targeting')) {
    showError('Pro feature. Please upgrade.');
    return;
  }

  var rd = App.resumeData;
  if (!rd.experience || rd.experience.length === 0) {
    showError('Add experience with bullet points first.');
    return;
  }

  // Collect all bullets from all experiences
  var allBullets = [];
  rd.experience.forEach(function(exp, expIdx) {
    var bullets = (exp.bullets || '').split('\n').filter(function(b) { return b.trim(); });
    bullets.forEach(function(b, bulIdx) {
      var clean = b.replace(/^[•\-\*\s]+/, '').trim();
      if (clean.length > 20 && !/Manager|Director|Lead|Head|VP|President|Chief/i.test(clean.split(' ').slice(0,3).join(' '))) {
        allBullets.push({
          text: clean,
          expIndex: expIdx,
          bulIndex: bulIdx,
          label: '📌 ' + clean.substring(0, 80) + (clean.length > 80 ? '...' : '')
        });
      }
    });
  });

  if (allBullets.length === 0) {
    showError('No bullet points found. Add some in the Experience section.');
    return;
  }

  // Show bullet picker
  var existing = document.getElementById('star-coach-modal');
  if (existing) existing.remove();

  var optionsHTML = allBullets.map(function(b, i) {
    return '<option value="' + i + '">' + b.label + '</option>';
  }).join('');

  var modal = document.createElement('div');
  modal.id = 'star-coach-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  window._starBullets = allBullets;

    modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">⭐ STAR Coach</h2><button onclick="document.getElementById(\'star-coach-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button></div><p style="font-size:0.85rem;color:#6b7280;margin-bottom:12px;">Select a bullet point to analyze:</p><select id="star-bullet-picker" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;font-size:0.85rem;margin-bottom:12px;">' + optionsHTML + '</select><button onclick="analyzeSelectedBullet(window._starBullets)" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Analyze Selected Bullet</button></div>';
  document.body.appendChild(modal);
}

function analyzeSelectedBullet(allBullets) {
  var idx = parseInt(document.getElementById('star-bullet-picker').value);
  var selected = allBullets[idx];
  document.getElementById('star-coach-modal').remove();
  analyzeStarBullet(selected.text, selected.expIndex, selected.bulIndex);
}

function analyzeStarBullet(bulletText, experienceIndex, bulletIndex) {
  var result = starCoach.coach(bulletText);
  var a = result.analysis;

  var existing = document.getElementById('star-coach-modal');
  if (existing) existing.remove();

  var scoreColor = a.score >= 80 ? '#10b981' : a.score >= 60 ? '#f59e0b' : a.score >= 40 ? '#f97316' : '#ef4444';

  var modal = document.createElement('div');
  modal.id = 'star-coach-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:550px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.5rem;font-weight:700;">⭐ STAR Coach</h2><button onclick="document.getElementById(\'star-coach-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;padding:4px 8px;">✕</button></div><div style="text-align:center;margin-bottom:16px;padding:16px;background:#f9fafb;border-radius:12px;"><div style="font-size:3rem;font-weight:800;color:' + scoreColor + ';">' + a.score + '%</div><div style="font-size:0.9rem;color:#6b7280;">' + a.rating + '</div></div><div style="margin-bottom:12px;"><div style="font-weight:600;font-size:0.85rem;color:#6b7280;margin-bottom:4px;">Original Bullet:</div><div style="padding:10px;background:#fef2f2;border-radius:8px;font-size:0.85rem;border-left:3px solid #ef4444;">' + result.original + '</div></div>' + (a.issues.length > 0 ? '<div style="margin-bottom:12px;"><div style="font-weight:600;font-size:0.85rem;color:#6b7280;margin-bottom:4px;">Issues Found:</div>' + a.issues.map(function(issue) { return '<div style="padding:6px 10px;background:#fffbeb;border-radius:6px;font-size:0.8rem;margin-bottom:4px;color:#92400e;">⚠️ ' + issue + '</div>'; }).join('') + '</div>' : '') + (result.improved ? '<div style="margin-bottom:12px;"><div style="font-weight:600;font-size:0.85rem;color:#6b7280;margin-bottom:4px;">Suggested Improvement:</div><div style="padding:10px;background:#ecfdf5;border-radius:8px;font-size:0.85rem;border-left:3px solid #10b981;">' + result.improved + '</div><button onclick="applyStarSuggestion(\'' + result.improved.replace(/'/g, "\\'") + '\', ' + bulletIndex + ', ' + experienceIndex + ')" style="width:100%;padding:8px;background:#10b981;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:8px;">Apply Suggestion</button></div>' : '') + '<div style="margin-top:12px;"><div style="font-weight:600;font-size:0.85rem;color:#6b7280;margin-bottom:4px;">STAR Format Guide:</div><div style="font-size:0.78rem;color:#4b5563;background:#eff6ff;padding:12px;border-radius:8px;"><pre style="white-space:pre-wrap;font-family:inherit;">' + a.suggestion + '</pre></div></div></div>';
  document.body.appendChild(modal);
}

function applyStarSuggestion(improved, bulletIndex, experienceIndex) {
  const rd = { ...App.resumeData };
  const bullets = rd.experience[experienceIndex].bullets.split('\n');
  bullets[bulletIndex] = '• ' + improved;
  rd.experience[experienceIndex].bullets = bullets.join('\n');
  updateState({ resumeData: rd });
  document.getElementById('star-coach-modal').remove();
  showSuccess('Bullet updated!');
}

// Add STAR Coach buttons to experience bullets in builder
function addStarCoachButtons() {
  document.querySelectorAll('.experience-bullet, [data-bullet]').forEach((el, i) => {
    if (!el.querySelector('.star-coach-btn')) {
      const btn = document.createElement('button');
      btn.className = 'star-coach-btn';
      btn.textContent = '⭐';
      btn.title = 'STAR Coach';
      btn.style.cssText = 'background:none;border:none;cursor:pointer;font-size:0.9rem;padding:2px 4px;opacity:0.6;';
      btn.onclick = function(e) {
        e.stopPropagation();
        const expIdx = parseInt(el.closest('[data-exp-index]')?.dataset?.expIndex || '0');
        showStarCoach(i, expIdx);
      };
      el.appendChild(btn);
    }
  });
}

// Watch for builder view to add buttons
setInterval(addStarCoachButtons, 1000);