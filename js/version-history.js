// Version History with Timeline UI
// Does NOT modify any existing code

const resumeVersionHistory = (function() {
  const STORAGE_KEY = 'resume_version_history';
  
  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch(e) {
      return [];
    }
  }
  
  function save(versions) {
    // Keep only last 20 versions
    const trimmed = versions.slice(-20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
  }
  
  function addVersion(message) {
    const versions = getAll();
    const version = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      version: 'v' + (versions.length + 1),
      message: message || 'Snapshot ' + (versions.length + 1),
      resume: JSON.parse(JSON.stringify(App.resumeData)),
      template: App.selectedTemplate,
      stats: {
        sections: Object.keys(App.resumeData).filter(k => {
          const v = App.resumeData[k];
          return Array.isArray(v) ? v.length > 0 : !!v;
        }).length,
        skills: (App.resumeData.skills || []).length,
        experience: (App.resumeData.experience || []).length,
        education: (App.resumeData.education || []).length,
        wordCount: JSON.stringify(App.resumeData).split(' ').length
      }
    };
    
    versions.push(version);
    save(versions);
    return version;
  }
  
  function restore(id) {
    const versions = getAll();
    const version = versions.find(v => v.id === id);
    if (version) {
      App.resumeData = JSON.parse(JSON.stringify(version.resume));
      if (version.template) App.selectedTemplate = version.template;
      saveToStorage();
      refreshView();
      return true;
    }
    return false;
  }
  
  function remove(id) {
    let versions = getAll();
    versions = versions.filter(v => v.id !== id);
    save(versions);
  }
  
  function getLatest() {
    const versions = getAll();
    return versions.length > 0 ? versions[versions.length - 1] : null;
  }
  
  return { getAll, addVersion, restore, remove, getLatest };
})();

// Save current version
function saveVersion() {
  if (!canAccess('ai_targeting')) {
    showError('Pro feature. Please upgrade.');
    return;
  }
  
  const msg = prompt('Name this version (optional):', 
    'Version ' + (resumeVersionHistory.getAll().length + 1));
  if (msg === null) return; // cancelled
  
  const version = resumeVersionHistory.addVersion(msg || undefined);
  showSuccess('Version saved! (' + version.version + ')');
  renderVersionTimeline();
}

// Show version timeline
function showVersionTimeline() {
  const existing = document.getElementById('version-timeline-modal');
  if (existing) existing.remove();
  
  renderVersionTimeline();
}

function renderVersionTimeline() {
  const existing = document.getElementById('version-timeline-modal');
  if (existing) existing.remove();
  
  const versions = resumeVersionHistory.getAll();
  
  const modal = document.createElement('div');
  modal.id = 'version-timeline-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  let timelineHTML = '';
  
  if (versions.length === 0) {
    timelineHTML = `
      <div style="text-align:center;padding:40px 20px;color:#9ca3af;">
        <div style="font-size:3rem;margin-bottom:12px;">📋</div>
        <div style="font-weight:600;font-size:1.1rem;color:#6b7280;">No versions saved yet</div>
        <div style="font-size:0.85rem;margin-top:4px;">Save a version to track your resume changes over time.</div>
      </div>
    `;
  } else {
    timelineHTML = versions.slice().reverse().map((v, i) => {
      const date = new Date(v.timestamp);
      const formatted = date.toLocaleDateString('en-US', { 
        month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' 
      });
      
      return `
        <div style="display:flex;gap:12px;padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:8px;align-items:flex-start;">
          <div style="flex-shrink:0;width:36px;height:36px;border-radius:50%;background:${i===0?'#6366f1':'#e5e7eb'};display:flex;align-items:center;justify-content:center;color:${i===0?'white':'#6b7280'};font-weight:700;font-size:0.8rem;">
            ${i === 0 ? '★' : v.version.replace('v','')}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-weight:600;font-size:0.9rem;">${v.message}</span>
              <span style="font-size:0.7rem;color:#9ca3af;">${formatted}</span>
            </div>
            <div style="display:flex;gap:8px;margin-top:4px;font-size:0.7rem;color:#6b7280;">
              <span>📄 ${v.stats.wordCount} words</span>
              <span>📑 ${v.stats.sections} sections</span>
              <span>💡 ${v.stats.skills} skills</span>
            </div>
            <div style="display:flex;gap:6px;margin-top:8px;">
              <button onclick="restoreVersion(${v.id})" 
                      style="padding:4px 10px;background:#6366f1;color:white;border:none;border-radius:5px;font-size:0.75rem;cursor:pointer;font-weight:500;">
                Restore
              </button>
              <button onclick="deleteVersion(${v.id})" 
                      style="padding:4px 10px;background:#fef2f2;color:#dc2626;border:none;border-radius:5px;font-size:0.75rem;cursor:pointer;">
                Delete
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:24px;max-width:550px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="font-size:1.5rem;font-weight:700;">🕐 Version History</h2>
        <button onclick="document.getElementById('version-timeline-modal').remove()" 
                style="background:none;border:none;font-size:1.5rem;cursor:pointer;padding:4px 8px;">✕</button>
      </div>
      
      <button onclick="saveVersion()" 
              style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-bottom:16px;">
        💾 Save Current Version
      </button>
      
      <div style="max-height:50vh;overflow-y:auto;">
        ${timelineHTML}
      </div>
      
      ${versions.length > 0 ? `
      <div style="text-align:center;margin-top:12px;font-size:0.75rem;color:#9ca3af;">
        ${versions.length} version${versions.length !== 1 ? 's' : ''} • Latest on top
      </div>
      ` : ''}
    </div>
  `;
  
  document.body.appendChild(modal);
}

function restoreVersion(id) {
  if (!confirm('Restore this version? Current unsaved changes will be lost.')) return;
  
  if (resumeVersionHistory.restore(id)) {
    document.getElementById('version-timeline-modal').remove();
    showSuccess('Version restored!');
  } else {
    showError('Failed to restore version.');
  }
}

function deleteVersion(id) {
  if (!confirm('Delete this version?')) return;
  resumeVersionHistory.remove(id);
  renderVersionTimeline();
  showSuccess('Version deleted.');
}