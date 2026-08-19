// AI Template Recommender
// Analyzes resume content and recommends best template
// Does NOT replace existing template picker

const templateRecommender = {
  templates: {
    modern: {
      label: 'Modern',
      bestFor: ['tech', 'startup', 'creative', 'early-career'],
      features: ['clean lines', 'skill-focused', 'contemporary'],
      weights: { skills: 0.4, experience: 0.2, education: 0.2, summary: 0.2 }
    },
    classic: {
      label: 'Classic',
      bestFor: ['finance', 'law', 'academic', 'traditional'],
      features: ['traditional layout', 'formal', 'chronological'],
      weights: { skills: 0.2, experience: 0.4, education: 0.3, summary: 0.1 }
    },
    creative: {
      label: 'Creative',
      bestFor: ['design', 'marketing', 'media', 'arts'],
      features: ['bold design', 'portfolio-friendly', 'visual'],
      weights: { skills: 0.3, experience: 0.2, education: 0.2, summary: 0.3 }
    },
    executive: {
      label: 'Executive',
      bestFor: ['management', 'c-suite', 'director', 'senior'],
      features: ['leadership-focused', 'achievement-driven', 'board-ready'],
      weights: { skills: 0.1, experience: 0.6, education: 0.2, summary: 0.1 }
    },
    professional: {
      label: 'Professional',
      bestFor: ['corporate', 'enterprise', 'government', 'healthcare'],
      features: ['polished', 'comprehensive', 'balanced'],
      weights: { skills: 0.3, experience: 0.35, education: 0.2, summary: 0.15 }
    },
    minimalist: {
      label: 'Minimalist',
      bestFor: ['freelance', 'consulting', 'remote', 'startup'],
      features: ['minimalist', 'fast-read', 'scannable'],
      weights: { skills: 0.25, experience: 0.25, education: 0.25, summary: 0.25 }
    },
    academic: {
      label: 'Academic',
      bestFor: ['education', 'research', 'phd', 'teaching'],
      features: ['publication-focused', 'detailed', 'traditional'],
      weights: { skills: 0.2, experience: 0.25, education: 0.4, summary: 0.15 }
    },
    europass: {
      label: 'Europass',
      bestFor: ['europe', 'eu-jobs', 'international', 'standardized'],
      features: ['standardized', 'recognized', 'structured'],
      weights: { skills: 0.3, experience: 0.3, education: 0.25, summary: 0.15 }
    }
  },

  industryKeywords: {
    tech: ['software', 'developer', 'engineer', 'python', 'javascript', 'react', 'aws', 'cloud', 'api', 'devops', 'sprint', 'agile', 'startup', 'saas'],
    finance: ['financial', 'banking', 'investment', 'accounting', 'audit', 'compliance', 'tax', 'portfolio', 'risk', 'wealth', 'treasury'],
    healthcare: ['patient', 'clinical', 'medical', 'hospital', 'nursing', 'hipaa', 'diagnostic', 'pharma', 'therapy', 'ehr'],
    law: ['attorney', 'legal', 'litigation', 'contract', 'compliance', 'regulatory', 'counsel', 'ip', 'patent', 'gdpr'],
    marketing: ['marketing', 'brand', 'social media', 'seo', 'sem', 'campaign', 'content', 'digital', 'advertising', 'creative'],
    design: ['design', 'ux', 'ui', 'graphic', 'figma', 'adobe', 'illustration', 'prototype', 'wireframe', 'visual'],
    management: ['director', 'vp', 'head of', 'chief', 'president', 'led', 'managed', 'strategy', 'executive', 'c-suite', 'leadership'],
    education: ['professor', 'teacher', 'instructor', 'curriculum', 'academic', 'research', 'phd', 'university', 'faculty'],
    consulting: ['consultant', 'advisor', 'client', 'stakeholder', 'deliverable', 'engagement', 'practice', 'advisory']
  },

  analyze(resumeData) {
    if (!resumeData) return { recommended: 'modern', reason: 'Default recommendation.' };

    const text = JSON.stringify(resumeData).toLowerCase();
    const scores = {};
    
    // Detect industry from resume content
    let detectedIndustry = 'tech';
    let maxKeywords = 0;
    
    Object.entries(this.industryKeywords).forEach(([industry, keywords]) => {
      const count = keywords.filter(k => text.includes(k.toLowerCase())).length;
      if (count > maxKeywords) {
        maxKeywords = count;
        detectedIndustry = industry;
      }
    });

    // Count resume sections
    const hasSkills = (resumeData.skills || []).length;
    const hasExperience = (resumeData.experience || []).length;
    const hasEducation = (resumeData.education || []).length;
    const summaryLength = (resumeData.summary || '').length;
    const totalYears = this.estimateYears(resumeData);

    // Score each template
    Object.entries(this.templates).forEach(([key, template]) => {
      let score = 0;
      
      // Industry match (40%)
      if (template.bestFor.includes(detectedIndustry)) {
        score += 40;
      } else if (template.bestFor.some(ind => detectedIndustry.includes(ind))) {
        score += 20;
      }

      // Experience level (30%)
      if (totalYears >= 10 && key === 'executive') score += 30;
      else if (totalYears >= 7 && ['professional', 'classic', 'elegant'].includes(key)) score += 30;
      else if (totalYears >= 3 && ['modern', 'creative'].includes(key)) score += 25;
      else if (totalYears < 3 && ['compact', 'minimal', 'modern'].includes(key)) score += 30;
      else score += 15;

      // Section balance (30%)
      const skillScore = Math.min(hasSkills / 10, 1) * 30 * template.weights.skills;
      const expScore = Math.min(hasExperience / 5, 1) * 30 * template.weights.experience;
      const eduScore = Math.min(hasEducation / 3, 1) * 30 * template.weights.education;
      const summaryScore = Math.min(summaryLength / 500, 1) * 30 * template.weights.summary;
      score += skillScore + expScore + eduScore + summaryScore;

      scores[key] = Math.round(score);
    });

    // Find best template
    let best = 'modern';
    let bestScore = 0;
    Object.entries(scores).forEach(([key, score]) => {
      if (score > bestScore) {
        bestScore = score;
        best = key;
      }
    });

    // Generate reason
    const template = this.templates[best];
    const reasons = [
      `Best for ${template.bestFor.slice(0,2).join(' & ')} roles`,
      `Optimized for ${template.features[0]}, ${template.features[1]}`,
      `Matches your ${detectedIndustry} industry background`
    ];

    return {
      recommended: best,
      label: template.label,
      score: bestScore,
      reason: reasons[0],
      industry: detectedIndustry,
      allScores: scores,
      runnerUp: Object.entries(scores)
        .filter(([k]) => k !== best)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'classic'
    };
  },

  estimateYears(resumeData) {
    let years = 0;
    (resumeData.experience || []).forEach(exp => {
      const startMatch = (exp.startDate || exp.duration || '').match(/(\d{4})/);
      const endMatch = (exp.endDate || exp.duration || '').match(/(\d{4})/);
      if (startMatch) {
        const start = parseInt(startMatch[1]);
        const end = endMatch ? parseInt(endMatch[1]) : new Date().getFullYear();
        years += Math.max(0, end - start);
      }
    });
    return years || 1;
  }
};

// Function to show recommendation on templates page
function showTemplateRecommendation() {
if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  if (!App.resumeData) return;
  
  const result = templateRecommender.analyze(App.resumeData);
  
  // Remove existing recommendation banner
  const existing = document.getElementById('template-rec-banner');
  if (existing) existing.remove();
  
  // Find template grid to insert before
  const grid = document.querySelector('.grid.sm\\:grid-cols-2');
  if (!grid) {
    // Not on templates page — show as a modal instead
    showTemplateRecommendationModal(result);
    return;
  }
  
  const banner = document.createElement('div');
  banner.id = 'template-rec-banner';
  banner.style.cssText = 'margin-bottom:16px;';
  banner.innerHTML = `
    <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white;border-radius:12px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="font-size:2rem;">🤖</span>
        <div>
          <div style="font-weight:700;font-size:1rem;">AI Recommendation: <span style="text-decoration:underline;">${result.label}</span> Template</div>
          <div style="font-size:0.8rem;opacity:0.9;">${result.reason} (${result.score}% match)</div>
        </div>
      </div>
      <button onclick="applyRecommendedTemplate('${result.recommended}')" 
              style="padding:8px 16px;background:white;color:#6366f1;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.85rem;">
        Apply ${result.label} →
      </button>
    </div>
  `;
  
  grid.parentNode.insertBefore(banner, grid);
}

function showTemplateRecommendationModal(result) {
  var existing = document.getElementById('template-rec-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'template-rec-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };


  var top3HTML = '';
  var sorted = Object.entries(result.allScores).sort(function(a,b){ return b[1]-a[1]; }).slice(0,3);
  sorted.forEach(function(entry, idx){
    var key = entry[0];
    var name = key.charAt(0).toUpperCase() + key.slice(1);
    var score = entry[1];
    var isBest = idx === 0;
    var barColor = isBest ? '#6366f1' : score >= 70 ? '#8b5cf6' : '#a78bfa';
    top3HTML += '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;' + (isBest ? 'background:#eef2ff;border-radius:8px;' : '') + 'margin-bottom:4px;"><div style="flex:1;min-width:0;"><span style="font-weight:' + (isBest ? '700' : '500') + ';font-size:0.85rem;">' + (isBest ? '⭐ ' : '') + name + '</span><div style="display:flex;align-items:center;gap:8px;margin-top:4px;"><div style="flex:1;background:#e5e7eb;border-radius:4px;height:6px;max-width:100px;"><div style="background:' + barColor + ';height:100%;width:' + score + '%;border-radius:4px;"></div></div><span style="font-size:0.75rem;font-weight:600;color:#6b7280;">' + score + '%</span></div></div><button onclick="applyRecommendedTemplate(\'' + key + '\');document.getElementById(\'template-rec-modal\').remove();" style="padding:4px 12px;background:' + barColor + ';color:white;border:none;border-radius:6px;font-size:0.75rem;cursor:pointer;font-weight:600;flex-shrink:0;">Apply</button></div>';
  });

  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:480px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">Template Recommendation</h2><button onclick="document.getElementById(\'template-rec-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><div style="text-align:center;margin-bottom:12px;"><div style="font-size:2rem;">🤖</div><div style="font-weight:700;font-size:1rem;color:#6b7280;">Top Template Matches</div><div style="font-size:0.8rem;color:#9ca3af;margin-top:2px;">Click Apply on any template</div></div><div style="background:#f9fafb;border-radius:10px;padding:12px;margin-bottom:12px;">' + top3HTML + '</div><button onclick="navigate(\'templates\');document.getElementById(\'template-rec-modal\').remove();" style="width:100%;padding:10px;background:#e5e7eb;color:#374151;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Browse All Templates</button></div>';
  document.body.appendChild(modal);
}
function applyRecommendedTemplate(templateName) {
  updateState({ selectedTemplate: templateName });
  navigate('builder');
  showSuccess('Applied ' + templateName + ' template!');
}

// Auto-show recommendation when templates page loads
(function() {
  if (typeof Views !== 'undefined' && typeof Views.templates === 'function') {
    var originalTemplates = Views.templates;
    Views.templates = function() {
      var html = originalTemplates();
      setTimeout(showTemplateRecommendation, 200);
      return html;
    };
  }
})();