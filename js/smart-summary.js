// Smart Summary Rewriter
// Reads summary content and rewrites it into professional ATS-friendly format
// Free tier: template-based | Pro tier: AI-enhanced

const SmartSummary = {
  // Extract key info from the full summary text
    analyze: function(summaryText, resumeData) {
    if (!summaryText || summaryText.length < 20) return null;
    
    var text = summaryText.toLowerCase();
    var fullText = JSON.stringify(resumeData || {}).toLowerCase();
    var rd = resumeData || {};
    
    var result = {
      title: '',
      years: 0,
      skills: [],
      achievement: '',
      industry: '',
      originalLength: summaryText.length
    };

    // 1. Detect job title - from experience section
    if (rd.experience && rd.experience.length > 0) {
      for (var ei = 0; ei < rd.experience.length; ei++) {
        var expTitle = (rd.experience[ei].title || '').trim();
        if (expTitle && 
            !/\b(Inc|LLC|Ltd|Corp|Corporation|Limited|Pvt|Private)\b\.?/i.test(expTitle) &&
            expTitle.length < 60 &&
            expTitle.split(' ').length < 8 &&
            expTitle.split(',').length < 3) {
          var cleanTitle = expTitle.replace(/,\s*(Corporate|Division|Department|Group|Team|Unit|Vertical|Region|Area).*$/i, '').trim();
          result.title = cleanTitle;
          break;
        }
      }
    }
    // If still no title, check first bullet of first experience for role
    if (!result.title && rd.experience && rd.experience[0] && rd.experience[0].bullets) {
      var bulletMatch = rd.experience[0].bullets.match(/(Business Development Manager|HR Manager|Project Manager|Team Lead|Director|Head of [A-Za-z]+)/i);
      if (bulletMatch) result.title = bulletMatch[1];
    }
    // Fallback: detect from summary text
    if (!result.title) {
      if (fullText.match(/recruit|hr |human resource|talent/i)) result.title = 'HR Professional';
      else if (fullText.match(/sales|business development|account manager/i)) result.title = 'Business Development Professional';
      else if (fullText.match(/software|developer|engineer|programmer/i)) result.title = 'Technology Professional';
      else if (fullText.match(/manager|director|head|lead|vp/i)) result.title = 'Management Professional';
      else if (fullText.match(/design|creative|ux|ui/i)) result.title = 'Creative Professional';
      else if (fullText.match(/market|brand|seo|content/i)) result.title = 'Marketing Professional';
    }

    // 2. Calculate years - try multiple sources
    var totalYears = 0;
    // Source 1: Experience dates
    if (rd.experience && rd.experience.length > 0) {
      rd.experience.forEach(function(exp) {
        var dates = (exp.dates || exp.startDate || exp.endDate || '').toString();
                var years = dates.match(/(\d{4})/g);
        if (years && years.length >= 1) {
          var endYear = years.length >= 2 ? parseInt(years[1]) : new Date().getFullYear();
          totalYears += Math.max(0, endYear - parseInt(years[0]));
        }
      });
      // Cap total years to avoid overcounting overlapping jobs
      if (totalYears > 50) totalYears = 50;
      // If more than 30, likely overlapping roles — take a reasonable estimate
      if (totalYears > 30 && rd.experience.length > 3) totalYears = Math.round(totalYears / (rd.experience.length / 3));
    }
    
   // Source 2: Summary text mentions years (use if higher than calculated)
    var yearMatch = summaryText.match(/(\d{2})\+?\s*(years|yrs)/i) ||
                    summaryText.match(/about\s*(\d{2})\s*(years|yrs)/i) ||
                    summaryText.match(/(\d{2})\s*(years|yrs)\s*(of\s*)?experience/i);
    if (yearMatch) {
      var summaryYears = parseInt(yearMatch[1]);
      if (summaryYears > totalYears) totalYears = summaryYears;
    }
    // Source 3: Estimate from number of jobs
    if (totalYears === 0 && rd.experience && rd.experience.length > 0) {
      totalYears = rd.experience.length * 3; // Average 3 years per job
    }
    result.years = totalYears || 1;

    // 3. Industry detection - use FULL resume text, not just summary
    var industries = {
      hr: ['recruit','onboarding','payroll','benefits','talent','hris','employee relations','human resource','performance management','succession planning','workforce','compensation','screening resumes','interviewing','welfare','staff','hiring','job boards','soft skills','hr processes','hr activities'],
      sales: ['sales','business development','account manager','lead generation','crm','revenue','b2b','enterprise sales','key accounts','client relationship','partner management','software sales','it solutions'],
      tech: ['software','developer','engineer','cloud','api','devops','sprint','coding','programming','full stack','frontend','backend','database','java','python','react','aws'],
      finance: ['financial','banking','investment','accounting','audit','compliance','tax','portfolio','wealth','fintech'],
      healthcare: ['patient','clinical','medical','hospital','nursing','hipaa','diagnostic','pharma'],
      marketing: ['marketing','brand','social media','seo','sem','campaign','content','digital','advertising'],
      operations: ['logistics','supply chain','procurement','inventory','warehouse','distribution','lean','six sigma']
    };
    var bestIndustry = '';
    var maxCount = 0;
    Object.entries(industries).forEach(function(entry) {
      var count = entry[1].filter(function(k) { return fullText.includes(k); }).length;
      if (count > maxCount) { maxCount = count; bestIndustry = entry[0]; }
    });
    result.industry = bestIndustry || 'professional services';
    // Override: if HR keywords strongly present, force HR industry
    var hrKeywords = ['recruit','onboarding','talent','hris','employee relations','human resource','performance management','succession planning','screening resumes','interviewing','welfare','staff','hr processes','hr activities'];
    var hrCount = hrKeywords.filter(function(k) { return fullText.includes(k); }).length;
        var hrCount = hrKeywords.filter(function(k) { return fullText.includes(k) || text.includes(k); }).length;
    if (hrCount >= 3) result.industry = 'HR';

    // 4. Skills - use 150+ skillMap if available, else fallback
    var foundSkills = [];
    var allSkills = [];
    // Try the global skillMap
    try {
      if (typeof skillMap !== 'undefined' && Array.isArray(skillMap)) {
        allSkills = skillMap;
      }
    } catch(e) {}
    // If skillMap not available, use comprehensive fallback
    if (allSkills.length === 0) {
      allSkills = ['recruitment','onboarding','talent acquisition','employee relations','performance management','succession planning','hr operations','workforce planning','compensation','benefits administration','hris','payroll','employee engagement','training','screening resumes','interviewing','business development','software sales','account management','lead generation','crm','customer success','revenue growth','key accounts','negotiation','stakeholder management','client relationship','leadership','communication','project management','strategic planning','analytical','problem-solving','team management','mentoring','interpersonal','python','java','javascript','react','aws','docker','sql','agile','scrum'];
    }
    allSkills.forEach(function(skill) {
      if (fullText.includes(skill.toLowerCase())) {
        foundSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
      }
    });
    result.skills = foundSkills.slice(0, 5);

    // 5. Find best achievement
    var sentences = summaryText.split(/[.!?]+/);
    sentences.forEach(function(sentence) {
      if (/\d+%|\$\d+|\d+ (users|customers|clients|hours|days|million|thousand)/i.test(sentence) && sentence.length > (result.achievement || '').length) {
        result.achievement = sentence.trim();
      }
    });
    if (!result.achievement && rd.experience) {
      rd.experience.forEach(function(exp) {
        var bullets = (exp.bullets || '').split('\n');
        bullets.forEach(function(b) {
          var clean = b.replace(/^[•\-\*\s]+/, '').trim();
          if (/\d+%|\$\d+|\d+ (users|customers|clients)/i.test(clean) && clean.length > (result.achievement || '').length) {
            result.achievement = clean;
          }
        });
      });
    }

    return result;
  },

  // Rewrite summary using template
  rewrite: function(summaryText, resumeData) {
    var analysis = this.analyze(summaryText, resumeData);
    if (!analysis) return summaryText; // Return original if analysis fails

    var templates = [
      // Template 1: Experience + Skills focused
      (analysis.title && analysis.years >= 2) 
        ? 'Results-driven ' + analysis.title + ' with ' + analysis.years + '+ years of experience' + (analysis.industry ? ' in the ' + analysis.industry + ' industry' : '') + '. ' + (analysis.skills.length > 0 ? 'Expertise in ' + analysis.skills.slice(0,3).join(', ') + '. ' : '') + (analysis.achievement ? 'Proven track record: ' + analysis.achievement + '.' : '')
        : null,
      
      // Template 2: Skills-first (for freshers)
      (analysis.skills.length >= 2)
        ? 'Skilled professional' + (analysis.title ? ' (' + analysis.title + ')' : '') + ' with proficiency in ' + analysis.skills.slice(0,4).join(', ') + '. ' + (analysis.achievement ? 'Demonstrated success: ' + analysis.achievement + '.' : 'Eager to contribute to innovative projects and grow within a dynamic team.')
        : null,
      
      // Template 3: Achievement-focused
      analysis.achievement
        ? 'Accomplished professional with a track record of delivering results. ' + analysis.achievement + ' ' + (analysis.skills.length > 0 ? 'Skilled in ' + analysis.skills.slice(0,3).join(', ') + '.' : '')
        : null
    ];

    // Pick the best non-null template
    var bestTemplate = templates.find(function(t) { return t !== null; }) || summaryText;
    
    // Ensure it ends with a complete sentence
    if (!/[.!?]$/.test(bestTemplate)) {
      bestTemplate += '.';
    }

    return bestTemplate;
  },

  // Enhance existing summary (for Pro users with AI)
  enhance: function(currentSummary, resumeData) {
    // This is called after the free rewrite
    // If user is Pro, they can click "Enhance with AI" which calls tailorResume()
    return {
      summary: currentSummary,
      canEnhance: typeof canAccess === 'function' && canAccess('ai_targeting'),
      enhanceAction: 'tailorResume'
    };
  }
};

