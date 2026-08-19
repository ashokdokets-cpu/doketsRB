// Extra Resume Examples - Adds 6 industries at runtime
// Does NOT modify index.html - SAFE approach
(function() {
  var extraExamples = [
    {
      industry: 'Human Resources',
      icon: '👥',
      levels: [
        { level: 'Entry', role: 'HR Coordinator', summary: 'HR graduate with internship experience in recruitment and onboarding.', skills: ['Recruitment', 'Onboarding', 'HRIS', 'Communication'], bullets: '• Coordinated recruitment for 20+ positions\n• Managed onboarding for 50+ new hires\n• Maintained employee records in HRIS' },
        { level: 'Mid', role: 'HR Manager', summary: 'HR Manager with 5+ years of experience in talent acquisition.', skills: ['Talent Acquisition', 'Employee Relations', 'HR Strategy'], bullets: '• Reduced time-to-hire by 30%\n• Managed team of 5 HR professionals\n• Improved retention by 25%' }
      ]
    },
    {
      industry: 'Legal',
      icon: '⚖️',
      levels: [
        { level: 'Entry', role: 'Paralegal', summary: 'Paralegal with corporate law experience.', skills: ['Legal Research', 'Document Drafting', 'Case Management'], bullets: '• Assisted in 50+ case preparations\n• Drafted 100+ legal documents\n• Managed document discovery' },
        { level: 'Mid', role: 'Attorney', summary: 'Attorney with 4+ years in corporate law.', skills: ['Contract Law', 'Negotiation', 'Litigation'], bullets: '• Negotiated 200+ contracts worth $50M+\n• Represented clients in 30+ proceedings\n• Reduced legal costs by 20%' }
      ]
    },
    {
      industry: 'Customer Service',
      icon: '🎧',
      levels: [
        { level: 'Entry', role: 'Customer Service Rep', summary: 'Customer service professional with strong communication skills.', skills: ['Communication', 'CRM', 'Problem Solving'], bullets: '• Handled 100+ inquiries daily\n• Maintained 95% satisfaction\n• Resolved 80% on first contact' },
        { level: 'Mid', role: 'Customer Success Manager', summary: 'CSM with 5+ years in client retention.', skills: ['Client Management', 'Upselling', 'Onboarding'], bullets: '• Managed 50+ enterprise accounts\n• Improved retention by 30%\n• Generated $500K upsell revenue' }
      ]
    },
    {
      industry: 'Operations',
      icon: '⚙️',
      levels: [
        { level: 'Entry', role: 'Operations Coordinator', summary: 'Operations professional with logistics experience.', skills: ['Logistics', 'Excel', 'Process Improvement'], bullets: '• Coordinated 50+ team members\n• Reduced conflicts by 40%\n• Maintained 98% accuracy' },
        { level: 'Mid', role: 'Operations Manager', summary: 'Operations Manager with 6+ years in supply chain.', skills: ['Supply Chain', 'Team Leadership', 'Budgeting'], bullets: '• Managed $5M budget\n• Reduced costs by 25%\n• Led team of 30' }
      ]
    },
    {
      industry: 'Real Estate',
      icon: '🏠',
      levels: [
        { level: 'Entry', role: 'Real Estate Agent', summary: 'Licensed agent with strong negotiation skills.', skills: ['Negotiation', 'MLS', 'Client Management'], bullets: '• Closed 15+ transactions\n• Built 100+ client base\n• Increased property visibility' },
        { level: 'Mid', role: 'Senior Broker', summary: 'Broker with 7+ years in commercial real estate.', skills: ['Commercial RE', 'Team Leadership', 'Valuation'], bullets: '• Managed $100M+ transactions\n• Led team of 10 agents\n• Increased revenue by 40%' }
      ]
    },
    {
      industry: 'Consulting',
      icon: '📈',
      levels: [
        { level: 'Entry', role: 'Business Analyst', summary: 'Business Analyst with strong analytical skills.', skills: ['Data Analysis', 'Excel', 'PowerPoint'], bullets: '• Conducted market research\n• Created executive dashboards\n• Identified $1M cost savings' },
        { level: 'Mid', role: 'Management Consultant', summary: 'Consultant with 5+ years in strategy.', skills: ['Strategy', 'Process Improvement', 'Financial Modeling'], bullets: '• Led 15+ engagements worth $5M+\n• Developed strategic plans\n• Improved efficiency by 30%' }
      ]
    }
  ];

  // Wait for existing examples to render, then add ours
  function injectExtraExamples() {
    // ONLY inject on Resume Examples page
    if (window.location.hash !== '#resume-examples') { return; }
    
    var grid = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
    if (!grid) { setTimeout(injectExtraExamples, 500); return; }
    
    // Check if already injected
    if (grid.querySelector('[data-extra-example]')) return;
    
    extraExamples.forEach(function(ex) {
      var card = document.createElement('div');
      card.setAttribute('data-extra-example', 'true');
      card.className = 'bg-white rounded-xl p-6 border shadow-sm';
      
      var html = '<div class="flex items-center gap-2 mb-4"><span class="text-2xl">' + ex.icon + '</span><h2 class="font-bold text-lg">' + ex.industry + '</h2></div>';
      
      ex.levels.forEach(function(l) {
        html += '<div class="border border-gray-100 rounded-lg p-4 mb-3">';
        html += '<div class="flex justify-between items-start mb-2"><div><span class="text-xs font-bold text-brand-600 uppercase">' + l.level + '</span><h3 class="font-bold mt-1">' + l.role + '</h3></div>';
        html += '<button data-role="' + l.role.replace(/"/g, '&quot;') + '" data-summary="' + l.summary.replace(/"/g, '&quot;') + '" data-skills="' + l.skills.join(',').replace(/"/g, '&quot;') + '" data-bullets="' + l.bullets.replace(/"/g, '&quot;') + '" onclick="loadResumeExampleFromButton(this)" class="px-3 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition">Use Template</button></div>';
        html += '<p class="text-sm text-gray-600 mb-2">' + l.summary + '</p>';
        html += '<div class="flex flex-wrap gap-1 mb-2">' + l.skills.map(function(s){ return '<span class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">' + s + '</span>'; }).join('') + '</div>';
        html += '</div>';
      });
      
      card.innerHTML = html;
      grid.appendChild(card);
    });
    
    console.log('✅ 6 extra resume example industries added!');
  }
  
  // Run after page loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(injectExtraExamples, 1500);
    });
  } else {
    setTimeout(injectExtraExamples, 1500);
  }
})();