// Job Application Auto-Filler
// Generates pre-filled data for job applications

const AutoFiller = {
  generate: function(resumeData) {
    var rd = resumeData || {};
    return {
      fullName: rd.personal?.fullName || '',
      email: rd.personal?.email || '',
      phone: rd.personal?.phone || '',
      location: rd.personal?.location || '',
      linkedin: rd.personal?.linkedin || '',
      summary: rd.summary || '',
      skills: (rd.skills || []).join(', '),
      currentTitle: rd.experience?.[0]?.title || '',
      currentCompany: rd.experience?.[0]?.company || '',
      yearsExperience: this.calcYears(rd),
      education: rd.education?.map(function(e){ return e.degree + ' - ' + e.school; }).join('; ') || ''
    };
  },
  
  calcYears: function(rd) {
    var total = 0;
    (rd.experience || []).forEach(function(exp) {
      var dates = (exp.dates || '').match(/(\d{4})/g);
      if (dates && dates.length >= 2) total += parseInt(dates[1]) - parseInt(dates[0]);
    });
    return total || (rd.experience || []).length * 3;
  }
};

function showAutoFiller() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  if (!App.resumeData?.personal?.fullName) { showError('Add resume content first.'); return; }
  
  var data = AutoFiller.generate(App.resumeData);
  
  var existing = document.getElementById('autofill-modal');
  if (existing) existing.remove();
  
  var modal = document.createElement('div');
  modal.id = 'autofill-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  var fieldsHTML = Object.entries(data).map(function(entry) {
    return '<div style="margin-bottom:8px;"><label style="font-size:0.75rem;font-weight:600;color:#6b7280;text-transform:uppercase;">'+entry[0].replace(/([A-Z])/g,' $1').trim()+'</label><input value="'+entry[1]+'" readonly style="width:100%;padding:6px;border:1px solid #e5e7eb;border-radius:4px;font-size:0.8rem;background:#f9fafb;" onclick="this.select()"></div>';
  }).join('');
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">📋 Auto-Fill Data</h2><button onclick="document.getElementById(\'autofill-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><p style="font-size:0.85rem;color:#6b7280;margin-bottom:12px;">Click any field to copy. Paste into job application forms.</p>'+fieldsHTML+'<button onclick="copyAllAutoFill()" style="width:100%;padding:10px;background:#10b981;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:8px;">Copy All Fields</button></div>';
  document.body.appendChild(modal);
}

function copyAllAutoFill() {
  var data = AutoFiller.generate(App.resumeData);
  var text = Object.entries(data).map(function(e){ return e[0].replace(/([A-Z])/g,' $1').trim().toUpperCase()+': '+e[1]; }).join('\n');
  navigator.clipboard.writeText(text).then(function(){ showSuccess('All fields copied!'); });
}