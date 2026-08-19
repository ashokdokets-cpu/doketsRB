// Salary Negotiation Coach
// AI-powered salary range suggestions and negotiation scripts

const SalaryCoach = {
  industryData: {
    tech: { min: 60000, max: 200000, roles: { 'software engineer': [80000,180000], 'senior engineer': [120000,220000], 'tech lead': [130000,250000], 'cto': [180000,400000] } },
    finance: { min: 50000, max: 250000, roles: { 'analyst': [60000,120000], 'manager': [100000,200000], 'director': [150000,350000] } },
    healthcare: { min: 45000, max: 200000, roles: { 'nurse': [55000,110000], 'doctor': [150000,400000], 'administrator': [70000,150000] } },
    marketing: { min: 40000, max: 180000, roles: { 'specialist': [45000,85000], 'manager': [70000,150000], 'director': [120000,250000] } },
    hr: { min: 40000, max: 150000, roles: { 'generalist': [45000,75000], 'manager': [70000,130000], 'director': [100000,200000] } },
    sales: { min: 35000, max: 200000, roles: { 'representative': [40000,80000], 'manager': [80000,180000], 'director': [120000,250000] } }
  },
  
  scripts: {
    initial: 'Thank you for the offer. I am excited about the opportunity to join {company}. Based on my research and {years} years of experience in {field}, I was expecting a salary in the range of {range}. Would you be open to discussing this?',
    counter: 'I appreciate the offer of {offer}. Given my experience in {field} and track record of {achievement}, I would like to propose {counter}. I am confident I can deliver significant value to {company}.',
    benefits: 'I would like to discuss the overall compensation package. Beyond salary, I am interested in {benefits}. Could you share more details about these?',
    closing: 'Thank you for working with me on this. I am thrilled to accept the offer of {final} and look forward to contributing to {company}!'
  }
};

function showSalaryCoach() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  
  var existing = document.getElementById('salary-modal');
  if (existing) existing.remove();
  
  var modal = document.createElement('div');
  modal.id = 'salary-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;max-height:85vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">💰 Salary Negotiation Coach</h2><button onclick="document.getElementById(\'salary-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Target Role:</label><input id="sal-role" placeholder="e.g., Senior Software Engineer" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Company:</label><input id="sal-company" placeholder="e.g., Google" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Offer Amount (if received):</label><input id="sal-offer" type="number" placeholder="e.g., 120000" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-top:4px;"></div><button onclick="generateSalaryReport()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-bottom:12px;">Generate Salary Report</button><div id="salary-result" style="display:none;"></div></div>';
  document.body.appendChild(modal);
}

function generateSalaryReport() {
  var role = document.getElementById('sal-role').value.trim();
  var company = document.getElementById('sal-company').value.trim() || 'the company';
  var offer = parseInt(document.getElementById('sal-offer').value) || 0;
  
  if (!role) { showError('Please enter a target role.'); return; }
  
  // Detect industry from resume
  var industry = 'tech';
  var text = JSON.stringify(App.resumeData || {}).toLowerCase();
  if (text.match(/finance|accounting|bank/i)) industry = 'finance';
  else if (text.match(/health|medical|clinical|nurse/i)) industry = 'healthcare';
  else if (text.match(/market|brand|seo|content/i)) industry = 'marketing';
  else if (text.match(/hr |human resource|recruit/i)) industry = 'hr';
  else if (text.match(/sales|business development/i)) industry = 'sales';
  
  var data = SalaryCoach.industryData[industry] || SalaryCoach.industryData.tech;
  var roleLower = role.toLowerCase();
  var range = data.roles[Object.keys(data.roles).find(function(k){ return roleLower.includes(k); })] || [data.min, data.max];
  
  var years = 0;
  (App.resumeData?.experience || []).forEach(function(exp) {
    var dates = (exp.dates || '').match(/(\d{4})/g);
    if (dates && dates.length >= 2) years += parseInt(dates[1]) - parseInt(dates[0]);
  });
  years = years || 5;
  
  var achievement = '';
  (App.resumeData?.experience || []).forEach(function(exp) {
    (exp.bullets || '').split('\n').forEach(function(b) {
      var clean = b.replace(/^[•\-\*\s]+/, '').trim();
      if (clean.length > achievement.length && /\d+%|\$\d+/.test(clean)) achievement = clean;
    });
  });
  
    var curr = (typeof App !== 'undefined' && App.currency) ? App.currency : 'USD';
  var currSymbols = { USD: '$', INR: '₹', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$', SGD: 'S$' };
  var currRates = { USD: 1, INR: 83, EUR: 0.92, GBP: 0.79, CAD: 1.36, AUD: 1.53, SGD: 1.35 };
  var symbol = currSymbols[curr] || '$';
  var rate = currRates[curr] || 1;
  var minSal = Math.round(range[0] * rate);
  var maxSal = Math.round(range[1] * rate);
  if (curr === 'INR') {
    marketRange = symbol + (minSal/100000).toFixed(1) + 'L - ' + symbol + (maxSal/100000).toFixed(1) + 'L per year';
  } else {
    marketRange = symbol + (minSal/1000).toFixed(0) + 'K - ' + symbol + (maxSal/1000).toFixed(0) + 'K per year';
  }
  var initialScript = SalaryCoach.scripts.initial.replace('{company}', company).replace('{years}', years).replace('{field}', role).replace('{range}', marketRange);
  var offerAnalysis = '';
  if (offer > 0) {
    if (offer < range[0]) {
      offerAnalysis = '<div style="padding:10px;background:#fef2f2;border-radius:6px;margin-bottom:8px;font-size:0.8rem;color:#dc2626;">⚠️ Offer is below market range. Consider negotiating.</div>';
    } else if (offer > range[1]) {
      offerAnalysis = '<div style="padding:10px;background:#f0fdf4;border-radius:6px;margin-bottom:8px;font-size:0.8rem;color:#16a34a;">✅ Offer is above market range! Great job!</div>';
    } else {
      offerAnalysis = '<div style="padding:10px;background:#fffbeb;border-radius:6px;margin-bottom:8px;font-size:0.8rem;color:#92400e;">📊 Offer is within market range. Room for negotiation.</div>';
    }
  }
  
  document.getElementById('salary-result').innerHTML = '<div style="background:#f9fafb;border-radius:10px;padding:16px;margin-top:12px;"><h3 style="font-weight:700;font-size:1rem;margin-bottom:8px;">📊 Salary Report: '+role+'</h3><div style="margin-bottom:12px;"><span style="font-size:0.85rem;font-weight:600;">Market Range:</span> <span style="font-size:1.2rem;font-weight:700;color:#2563eb;">'+marketRange+'</span></div>'+offerAnalysis+'<div style="margin-bottom:12px;"><h4 style="font-weight:600;font-size:0.85rem;margin-bottom:4px;">💬 Negotiation Script:</h4><div style="padding:10px;background:white;border-radius:6px;font-size:0.8rem;line-height:1.5;">'+initialScript+'</div></div><p style="font-size:0.75rem;color:#9ca3af;">Industry: '+industry.charAt(0).toUpperCase()+industry.slice(1)+' | Experience: ~'+years+' years</p></div>';
  document.getElementById('salary-result').style.display = 'block';
}