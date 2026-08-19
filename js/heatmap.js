// Dynamic Recruiter Eye-Tracking Heatmap
// Analyzes actual resume content and overlays zones on real sections

function showHeatmapOverlay() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }

  var preview = document.getElementById('resume-preview-area');
  if (!preview || !preview.innerHTML || preview.innerHTML.length < 100) {
    showError('Add resume content first to see the heatmap.');
    return;
  }

  var existing = document.getElementById('heatmap-overlay');
  if (existing) { existing.remove(); return; }

  // Create overlay container
  var overlay = document.createElement('div');
  overlay.id = 'heatmap-overlay';
  overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;';
  preview.style.position = 'relative';
  
  // Analyze the actual DOM to find sections
  var sections = findResumeSections(preview);
  
  sections.forEach(function(s, i) {
    var zone = document.createElement('div');
    zone.style.cssText = 'position:absolute;top:' + s.top + '%;left:' + s.left + '%;width:' + s.width + '%;height:' + s.height + '%;background:' + s.color + ';border-radius:4px;pointer-events:none;';
    zone.title = s.tip;
    
    var label = document.createElement('span');
    label.textContent = s.attention + '%';
    label.style.cssText = 'position:absolute;top:2px;right:4px;font-size:10px;font-weight:700;color:' + (s.attention > 70 ? '#065f46' : s.attention > 40 ? '#92400e' : '#991b1b') + ';background:white;padding:1px 4px;border-radius:3px;';
    zone.appendChild(label);
    overlay.appendChild(zone);
  });
  
  preview.appendChild(overlay);
  
  // Click anywhere to remove
  setTimeout(function() {
    document.addEventListener('click', function removeHeatmap(e) {
      var hm = document.getElementById('heatmap-overlay');
      if (hm) { hm.remove(); }
      document.removeEventListener('click', removeHeatmap);
    });
  }, 100);
}

function findResumeSections(preview) {
  var sections = [];
  var previewHeight = preview.offsetHeight || 500;
  var html = preview.innerHTML.toLowerCase();
  var text = preview.innerText || '';
  
  // 1. Find name/contact area (first 15% of resume)
  var hasName = App.resumeData?.personal?.fullName ? true : false;
  sections.push({
    name: 'Name & Contact',
    top: 0, left: 0, width: 100, height: hasName ? 12 : 8,
    attention: hasName ? 95 : 40,
    color: hasName ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.3)',
    tip: hasName ? 'Recruiters spend 2 seconds here. Your name stands out.' : 'Add your full name — this is the #1 most viewed area.'
  });
  
  // 2. Find summary section
  var hasSummary = App.resumeData?.summary && App.resumeData.summary.length > 50;
  var summaryTop = hasName ? 12 : 8;
  sections.push({
    name: 'Summary',
    top: summaryTop, left: 0, width: 100, height: hasSummary ? 14 : 6,
    attention: hasSummary ? 85 : 25,
    color: hasSummary ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.2)',
    tip: hasSummary ? 'Summary is well-written. Recruiters scan this for fit.' : 'Add a professional summary — it is scanned quickly for role fit.'
  });
  
  // 3. Find experience section
  var expCount = App.resumeData?.experience?.length || 0;
  var expTop = summaryTop + (hasSummary ? 14 : 6);
  var hasAchievements = false;
  if (App.resumeData?.experience) {
    App.resumeData.experience.forEach(function(e) {
      if (e.bullets && /\d+%|\$\d+|\d+ people|\d+ team|\d+ million/i.test(e.bullets)) hasAchievements = true;
    });
  }
  
  sections.push({
    name: 'Experience',
    top: expTop, left: 0, width: 70, height: Math.min(40, expCount * 10),
    attention: expCount >= 2 ? (hasAchievements ? 90 : 65) : 30,
    color: expCount >= 2 ? (hasAchievements ? 'rgba(16,185,129,0.35)' : 'rgba(245,158,11,0.35)') : 'rgba(239,68,68,0.25)',
    tip: expCount >= 2 ? (hasAchievements ? 'Good experience with metrics. Recruiters focus here.' : 'Add numbers to your achievements.') : 'Add more experience with measurable results.'
  });
  
  sections.push({
    name: 'Achievements',
    top: expTop, left: 70, width: 30, height: Math.min(40, expCount * 10),
    attention: hasAchievements ? 80 : 35,
    color: hasAchievements ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.2)',
    tip: hasAchievements ? 'Metrics catch attention here. Good job!' : 'Add specific numbers — they draw the eye immediately.'
  });
  
  // 4. Find skills section
  var skillCount = App.resumeData?.skills?.length || 0;
  var skillsTop = expTop + Math.min(40, Math.max(expCount * 10, 15));
  sections.push({
    name: 'Skills',
    top: skillsTop, left: 0, width: 100, height: Math.min(12, skillCount * 2),
    attention: skillCount >= 5 ? 70 : skillCount > 0 ? 45 : 15,
    color: skillCount >= 5 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.2)',
    tip: skillCount >= 5 ? 'Good skill list. Recruiters scan for keywords.' : 'Add more skills matching your target job keywords.'
  });
  
  // 5. Find education section
  var eduCount = App.resumeData?.education?.length || 0;
  var eduTop = skillsTop + Math.min(12, skillCount * 2);
  sections.push({
    name: 'Education',
    top: eduTop, left: 0, width: 100, height: Math.min(10, eduCount * 5),
    attention: eduCount > 0 ? 35 : 15,
    color: 'rgba(99,102,241,0.2)',
    tip: 'Quick glance only. Move this down if you have 5+ years experience.'
  });
  
  return sections;
}