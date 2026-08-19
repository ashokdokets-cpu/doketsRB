// Skill Gap Analyzer Enhancement
// Does NOT modify any existing code - runs alongside it

class SkillGapAnalyzerEnhanced {
  constructor() {
    this.skillCategories = {
      technical: ['python','java','javascript','typescript','react','angular','vue','node','sql','mongodb','postgresql','aws','azure','docker','kubernetes','terraform','git','rest api','graphql','c++','c#','.net','php','django','flask','swift','kotlin','flutter','css','html','redis','ci/cd','devops','ruby'],
      tools: ['excel','tableau','power bi','figma','adobe','salesforce','hubspot','google analytics','jira','confluence','erp','scm','hris','lms','ehr'],
      soft: ['leadership','communication','project management','stakeholder management','strategic','analytical','problem-solving','team management','negotiation','mentoring','customer service','teamwork','public speaking'],
      domain: ['agile','scrum','lean','six sigma','hipaa','gdpr','recruitment','onboarding','financial analysis','risk management','seo','sem','social media','content marketing','patient care','clinical','logistics','procurement']
    };
    
    this.skillImportance = {
      technical: 0.9, tools: 0.8, domain: 0.7, soft: 0.6
    };
  }

  analyze(jobDescription, resumeSkills) {
    if (!jobDescription || jobDescription.length < 30) {
      return { error: 'Paste a job description first.' };
    }
    
    const jd = jobDescription.toLowerCase();
    const skills = resumeSkills.map(s => s.toLowerCase().trim());
    
    // Find industry
    const industry = this.detectIndustry(jd);
    
    // Categorize required skills from JD
    const required = this.extractRequiredSkills(jd);
    
    // Match against resume
    const matched = [];
    const partial = [];
    const missing = [];
    
    required.forEach(reqSkill => {
      const exact = skills.some(s => s === reqSkill.name || 
        reqSkill.aliases.some(a => s.includes(a) || a.includes(s)));
      
      if (exact) {
        matched.push(reqSkill);
      } else {
        const similar = skills.some(s => 
          this.calculateSimilarity(s, reqSkill.name) > 0.6
        );
        if (similar) {
          partial.push(reqSkill);
        } else {
          missing.push(reqSkill);
        }
      }
    });
    
    // Calculate scores
    const total = required.length || 1;
    const matchScore = Math.round((matched.length / total) * 100);
    const adjustedScore = Math.round(
      (matched.length + partial.length * 0.5) / total * 100
    );
    
    // Category breakdown
    const categoryAnalysis = this.analyzeCategories(matched, missing, required);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(missing, partial, categoryAnalysis);
    
    return {
      industry,
      matchScore,
      adjustedScore,
      totalRequired: total,
      matched: matched.map(s => s.name),
      partial: partial.map(s => s.name),
      missing: missing.map(s => s.name),
      categoryAnalysis,
      recommendations
    };
  }

  detectIndustry(jd) {
    const industries = {
      tech: ['javascript','python','react','aws','api','cloud','software','devops','agile','sprint'],
      healthcare: ['patient','clinical','hipaa','medical','diagnostic','nursing','hospital','pharma'],
      finance: ['financial','accounting','audit','compliance','tax','banking','investment','portfolio'],
      hr: ['recruitment','onboarding','payroll','benefits','talent','hris','employee relations'],
      marketing: ['seo','sem','campaign','social media','content','brand','digital marketing'],
      operations: ['logistics','supply chain','procurement','inventory','warehouse','distribution']
    };
    
    let best = 'tech';
    let bestCount = 0;
    
    Object.entries(industries).forEach(([industry, keywords]) => {
      const count = keywords.filter(k => jd.includes(k)).length;
      if (count > bestCount) { best = industry; bestCount = count; }
    });
    
    return best;
  }

  extractRequiredSkills(jd) {
    const skills = [];
    const seen = new Set();
    
    // Check all categories
    Object.entries(this.skillCategories).forEach(([category, skillList]) => {
      skillList.forEach(skill => {
        if (seen.has(skill)) return;
        const regex = new RegExp('\\b' + skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
        if (regex.test(jd)) {
          seen.add(skill);
          skills.push({
            name: skill,
            category: category,
            importance: this.skillImportance[category] || 0.5,
            aliases: this.getAliases(skill)
          });
        }
      });
    });
    
    // Sort by importance (most important first)
    return skills.sort((a, b) => b.importance - a.importance);
  }

  getAliases(skill) {
    const aliasMap = {
      'javascript': ['js','ecmascript'],
      'python': ['py','django','flask'],
      'react': ['reactjs','react.js'],
      'aws': ['amazon web services'],
      'docker': ['container','containerization'],
      'kubernetes': ['k8s','container orchestration'],
      'agile': ['scrum','kanban'],
      'git': ['github','gitlab','version control']
    };
    return aliasMap[skill] || [];
  }

  calculateSimilarity(str1, str2) {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;
    
    for (let i = 0; i <= len1; i++) matrix[i] = [i];
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i-1] === str2[j-1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i-1][j] + 1,
          matrix[i][j-1] + 1,
          matrix[i-1][j-1] + cost
        );
      }
    }
    
    const maxLen = Math.max(len1, len2);
    return 1 - (matrix[len1][len2] / maxLen);
  }

  analyzeCategories(matched, missing, required) {
    const categories = {};
    
    required.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = { total: 0, matched: 0, missing: [], percentage: 0 };
      }
      categories[skill.category].total++;
    });
    
    matched.forEach(skill => {
      if (categories[skill.category]) categories[skill.category].matched++;
    });
    
    missing.forEach(skill => {
      if (categories[skill.category]) categories[skill.category].missing.push(skill.name);
    });
    
    Object.keys(categories).forEach(cat => {
      const c = categories[cat];
      c.percentage = c.total > 0 ? Math.round((c.matched / c.total) * 100) : 0;
    });
    
    return categories;
  }

  generateRecommendations(missing, partial, categoryAnalysis) {
    const recs = [];
    
    // Critical missing skills (high importance)
    const critical = missing.filter(s => s.importance >= 0.9);
    if (critical.length > 0) {
      recs.push({
        type: 'critical',
        title: '🔴 Critical Skills to Add',
        skills: critical.slice(0, 5).map(s => s.name),
        message: 'These high-demand skills appear in the job description.',
        action: 'Add them to your resume or take a course to learn them.'
      });
    }
    
    // Category weak spots (below 50%)
    Object.entries(categoryAnalysis).forEach(([cat, data]) => {
      if (data.percentage < 50 && data.total >= 2) {
        recs.push({
          type: 'category',
          title: `🟡 Improve ${cat.charAt(0).toUpperCase() + cat.slice(1)} Skills`,
          skills: data.missing.slice(0, 4),
          message: `Only ${data.percentage}% match in ${cat} skills.`,
          action: 'Highlight relevant experience or add certifications.'
        });
      }
    });
    
    // Partial matches
    if (partial.length > 0) {
      recs.push({
        type: 'partial',
        title: '🔵 Related Skills Found',
        skills: partial.map(s => s.name),
        message: 'You have similar skills that could be rephrased.',
        action: 'Update wording to match the job description exactly.'
      });
    }
    
    return recs;
  }
}

// Instantiate analyzer
const skillGapAnalyzer = new SkillGapAnalyzerEnhanced();

// NEW function - does NOT replace the old analyzeSkillGap()
function analyzeSkillGapEnhanced() {
  if (!canAccess('ai_targeting')) {
    showError('Pro feature. Please upgrade.');
    return;
  }
  
  const jd = App.jobTarget.description;
  if (!jd || jd.length < 30) {
    showError('Paste a job description in Dashboard first.');
    return;
  }
  
  const result = skillGapAnalyzer.analyze(jd, App.resumeData.skills);
  
  if (result.error) {
    showError(result.error);
    return;
  }
  
  renderSkillGapUI(result);
}

// UI Rendering
function renderSkillGapUI(result) {
  // Remove existing modal if any
  const existing = document.getElementById('skill-gap-modal');
  if (existing) existing.remove();
  
  const scoreColor = result.matchScore >= 70 ? '#10b981' : 
                     result.matchScore >= 40 ? '#f59e0b' : '#ef4444';
  
  const modal = document.createElement('div');
  modal.id = 'skill-gap-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:24px;max-width:600px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="font-size:1.5rem;font-weight:700;">📊 Skill Gap Analysis</h2>
        <button onclick="document.getElementById('skill-gap-modal').remove()" 
                style="background:none;border:none;font-size:1.5rem;cursor:pointer;padding:4px 8px;">✕</button>
      </div>
      
      <!-- Match Score -->
      <div style="text-align:center;margin-bottom:20px;padding:16px;background:#f9fafb;border-radius:12px;">
        <div style="font-size:3rem;font-weight:800;color:${scoreColor};">${result.matchScore}%</div>
        <div style="font-size:0.875rem;color:#6b7280;">Match Score (${result.matched.length}/${result.totalRequired} skills)</div>
        <div style="background:#e5e7eb;border-radius:10px;height:8px;margin-top:8px;overflow:hidden;">
          <div style="background:${scoreColor};height:100%;width:${result.matchScore}%;border-radius:10px;transition:width 0.5s;"></div>
        </div>
        <div style="margin-top:4px;font-size:0.75rem;color:#9ca3af;">Industry: ${result.industry.toUpperCase()}</div>
      </div>
      
      <!-- Category Breakdown -->
      ${Object.keys(result.categoryAnalysis).length > 0 ? `
      <div style="margin-bottom:16px;">
        <h3 style="font-weight:600;margin-bottom:8px;">📂 Skill Categories</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${Object.entries(result.categoryAnalysis).map(([cat, data]) => `
            <div style="padding:10px;background:#f9fafb;border-radius:8px;">
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;">
                <span style="font-weight:500;text-transform:capitalize;">${cat}</span>
                <span style="color:${data.percentage >= 70 ? '#10b981' : data.percentage >= 40 ? '#f59e0b' : '#ef4444'};font-weight:600;">${data.percentage}%</span>
              </div>
              <div style="background:#e5e7eb;border-radius:4px;height:4px;margin-top:4px;">
                <div style="background:#6366f1;height:100%;width:${data.percentage}%;border-radius:4px;"></div>
              </div>
              <div style="font-size:0.7rem;color:#9ca3af;margin-top:2px;">${data.matched}/${data.total} matched</div>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      <!-- Skills Detail -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="padding:12px;background:#ecfdf5;border-radius:8px;">
          <div style="font-weight:600;color:#059669;font-size:0.85rem;">✅ Matched</div>
          <div style="font-size:1.5rem;font-weight:700;color:#059669;">${result.matched.length}</div>
          <div style="font-size:0.7rem;color:#6b7280;max-height:80px;overflow-y:auto;">${result.matched.slice(0,8).join(', ') || 'None'}</div>
        </div>
        <div style="padding:12px;background:#fef3c7;border-radius:8px;">
          <div style="font-weight:600;color:#d97706;font-size:0.85rem;">⚠️ Related</div>
          <div style="font-size:1.5rem;font-weight:700;color:#d97706;">${result.partial.length}</div>
          <div style="font-size:0.7rem;color:#6b7280;max-height:80px;overflow-y:auto;">${result.partial.slice(0,5).join(', ') || 'None'}</div>
        </div>
        <div style="padding:12px;background:#fef2f2;border-radius:8px;">
          <div style="font-weight:600;color:#dc2626;font-size:0.85rem;">❌ Missing</div>
          <div style="font-size:1.5rem;font-weight:700;color:#dc2626;">${result.missing.length}</div>
          <div style="font-size:0.7rem;color:#6b7280;max-height:80px;overflow-y:auto;">${result.missing.slice(0,5).join(', ') || 'None'}</div>
        </div>
      </div>
      
      <!-- Recommendations -->
      ${result.recommendations.length > 0 ? `
      <div>
        <h3 style="font-weight:600;margin-bottom:8px;">💡 Recommendations</h3>
        ${result.recommendations.map(rec => `
          <div style="padding:12px;background:#eff6ff;border-radius:8px;margin-bottom:8px;border-left:4px solid #6366f1;">
            <div style="font-weight:600;font-size:0.85rem;">${rec.title}</div>
            <div style="font-size:0.8rem;color:#4b5563;margin-top:4px;">${rec.message}</div>
            <div style="font-size:0.75rem;color:#6366f1;margin-top:4px;">${rec.action}</div>
            ${rec.skills ? `<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:4px;">${rec.skills.map(s => `<span style="padding:2px 8px;background:#e0e7ff;color:#4338ca;border-radius:10px;font-size:0.7rem;">${s}</span>`).join('')}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      <!-- Add Missing Skills Button -->
      ${result.missing.length > 0 ? `
      <button onclick="addMissingSkills(${JSON.stringify(result.missing).replace(/"/g,'&quot;')});document.getElementById('skill-gap-modal').remove();" 
              style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:12px;">
        ➕ Add ${result.missing.length} Missing Skills to Resume
      </button>
      ` : ''}
      
      <div style="text-align:center;margin-top:12px;font-size:0.7rem;color:#9ca3af;">
        Old analyzer still works — click "Skill Gap" button
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Helper to add missing skills
function addMissingSkills(missingSkills) {
  const rd = { ...App.resumeData };
  let added = 0;
  missingSkills.forEach(skill => {
    if (!rd.skills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      rd.skills.push(skill);
      added++;
    }
  });
  updateState({ resumeData: rd });
  showSuccess(`Added ${added} skills to your resume!`);
}