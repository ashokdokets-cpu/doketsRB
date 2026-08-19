// Dynamic Web Profiles — Public resume URL
// Generates a shareable public profile page

function generatePublicProfile() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  if (!App.resumeData?.personal?.fullName) { showError('Add resume content first.'); return; }

  var rd = App.resumeData;
  var slug = rd.personal.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  
  // Store profile data
  var profileData = {
    fullName: rd.personal.fullName,
    email: rd.personal.email,
    phone: rd.personal.phone,
    location: rd.personal.location,
    linkedin: rd.personal.linkedin,
    summary: rd.summary,
    experience: rd.experience,
    education: rd.education,
    skills: rd.skills,
    template: App.selectedTemplate,
    created: new Date().toISOString()
  };
  localStorage.setItem('public_profile_' + slug, JSON.stringify(profileData));
  localStorage.setItem('current_profile_slug', slug);
  
  var profileUrl = window.location.origin + '/#profile-view';
  
  // Create a simple modal with the link
  var modal = document.createElement('div');
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;text-align:center;"><h3 style="font-size:1.2rem;font-weight:700;margin-bottom:12px;">Public Profile Created!</h3><p style="font-size:0.9rem;color:#6b7280;margin-bottom:16px;">Share this link to show your resume:</p><input value="' + profileUrl + '" readonly style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;text-align:center;margin-bottom:12px;" onclick="this.select();document.execCommand(\'copy\');"><button onclick="navigator.clipboard.writeText(\'' + profileUrl + '\');showSuccess(\'Link copied!\');" style="padding:10px 20px;background:#2563eb;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Copy Link</button><button onclick="window.open(\'' + profileUrl + '\', \'_blank\')" style="padding:10px 20px;background:#10b981;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;margin-left:8px;">View Profile</button></div>';
  document.body.appendChild(modal);
}

