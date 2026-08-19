// LinkedIn Direct Import
// Parses LinkedIn profile data directly for auto-fill
// Extends existing triggerLinkedInUpload() - does not replace it

const linkedinParser = {
  parse: function(jsonData) {
    var result = { personal: {}, experience: [], education: [], skills: [], summary: '' };
    
    try {
      var d = jsonData;
      
      // Basic profile info
      if (d.firstName || d.lastName) {
        result.personal.fullName = (d.firstName || '') + ' ' + (d.lastName || '');
      }
      if (d.headline) result.personal.headline = d.headline;
      if (d.summary || d.about) result.summary = d.summary || d.about;
      if (d.location) {
        var loc = d.location;
        if (typeof loc === 'object') {
          result.personal.location = (loc.city || '') + ', ' + (loc.country || '');
        } else {
          result.personal.location = loc;
        }
      }
      if (d.email || d.emailAddress) result.personal.email = d.email || d.emailAddress;
      if (d.phone || d.phoneNumber) result.personal.phone = d.phone || d.phoneNumber;
      if (d.linkedinUrl || d.publicProfileUrl) result.personal.linkedin = d.linkedinUrl || d.publicProfileUrl;

      // Experience
      var positions = d.positions || d.experience || [];
      positions.forEach(function(pos) {
        result.experience.push({
          title: pos.title || pos.position || '',
          company: pos.companyName || pos.company || '',
          startDate: pos.startDate ? (pos.startDate.year || pos.startDate) : '',
          endDate: pos.endDate ? (pos.endDate.year || pos.endDate || 'Present') : '',
          bullets: (pos.description || pos.summary || '').split('\n').filter(function(b) { return b.trim(); }).map(function(b) { return '• ' + b.trim(); }).join('\n')
        });
      });

      // Education
      var schools = d.education || d.schools || [];
      schools.forEach(function(sch) {
        result.education.push({
          school: sch.schoolName || sch.school || '',
          degree: sch.degree || sch.fieldOfStudy || '',
          year: sch.endDate ? (sch.endDate.year || sch.endDate) : ''
        });
      });

      // Skills
      var skills = d.skills || d.skillNames || [];
      skills.forEach(function(s) {
        var name = typeof s === 'string' ? s : (s.name || s.skill || '');
        if (name) result.skills.push(name);
      });

      return result;
    } catch(e) {
      console.error('LinkedIn parse error:', e);
      return null;
    }
  },

  merge: function(parsed) {
    if (!parsed) return false;
    var rd = JSON.parse(JSON.stringify(App.resumeData));

    if (parsed.personal.fullName && !rd.personal.fullName) rd.personal.fullName = parsed.personal.fullName;
    if (parsed.personal.email && !rd.personal.email) rd.personal.email = parsed.personal.email;
    if (parsed.personal.phone && !rd.personal.phone) rd.personal.phone = parsed.personal.phone;
    if (parsed.personal.location && !rd.personal.location) rd.personal.location = parsed.personal.location;
    if (parsed.personal.linkedin && !rd.personal.linkedin) rd.personal.linkedin = parsed.personal.linkedin;
    if (parsed.summary && !rd.summary) rd.summary = parsed.summary;

    if (parsed.experience.length > 0 && rd.experience.length === 0) rd.experience = parsed.experience;
    if (parsed.education.length > 0 && rd.education.length === 0) rd.education = parsed.education;
    if (parsed.skills.length > 0) {
      var existingSkills = (rd.skills || []).map(function(s) { return s.toLowerCase(); });
      parsed.skills.forEach(function(s) {
        if (!existingSkills.includes(s.toLowerCase())) rd.skills.push(s);
      });
    }

    updateState({ resumeData: rd });
    return true;
  }
};

function showLinkedInDirectImport() {
  var existing = document.getElementById('linkedin-direct-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'linkedin-direct-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">🔗 LinkedIn Direct Import</h2><button onclick="document.getElementById(\'linkedin-direct-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button></div><div style="margin-bottom:16px;padding:14px;background:#eff6ff;border-radius:10px;font-size:0.85rem;color:#1e40af;"><b>How to get your LinkedIn data:</b><br>1. Go to LinkedIn → Settings & Privacy<br>2. Data Privacy → Get a copy of your data<br>3. Download the ZIP and extract the JSON file<br>4. Paste the JSON content below</div><textarea id="linkedin-json-input" placeholder="Paste your LinkedIn JSON data here..." style="width:100%;height:150px;padding:10px;border:1px solid #e5e7eb;border-radius:8px;font-size:0.8rem;font-family:monospace;resize:vertical;"></textarea><button onclick="processLinkedInJSON()" style="width:100%;padding:10px;background:#0077b5;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-top:10px;">📥 Import from LinkedIn JSON</button><div id="linkedin-import-status" style="margin-top:10px;text-align:center;font-size:0.85rem;"></div></div>';
  document.body.appendChild(modal);
}

function processLinkedInJSON() {
  var input = document.getElementById('linkedin-json-input').value;
  var statusEl = document.getElementById('linkedin-import-status');
  
  if (!input.trim()) {
    statusEl.innerHTML = '<span style="color:#ef4444;">Please paste your LinkedIn JSON data.</span>';
    return;
  }

  try {
    var data = JSON.parse(input);
    var parsed = linkedinParser.parse(data);
    
    if (parsed && linkedinParser.merge(parsed)) {
      var count = 0;
      if (parsed.personal.fullName) count++;
      if (parsed.experience.length > 0) count += parsed.experience.length;
      if (parsed.skills.length > 0) count += parsed.skills.length;
      
      statusEl.innerHTML = '<span style="color:#10b981;">Imported ' + count + ' items! Redirecting...</span>';
      setTimeout(function() {
        document.getElementById('linkedin-direct-modal').remove();
        refreshView();
        navigate('builder');
        showSuccess('LinkedIn data imported!');
      }, 1000);
    } else {
      statusEl.innerHTML = '<span style="color:#ef4444;">Could not parse LinkedIn data. Check the JSON format.</span>';
    }
  } catch(e) {
    statusEl.innerHTML = '<span style="color:#ef4444;">Invalid JSON. Please paste valid LinkedIn data.</span>';
  }
}