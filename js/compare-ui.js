// Side-by-Side Resume Compare UI
// Compare two saved versions visually

const compareUI = {
  versions: [],

  loadVersions() {
    try {
      this.versions = JSON.parse(localStorage.getItem('resume_version_history') || '[]');
    } catch(e) {
      this.versions = [];
    }
    return this.versions;
  },

  getVersionById(id) {
    return this.versions.find(v => v.id === id);
  }
};

function showCompareUI() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  const versions = compareUI.loadVersions();
  
  if (versions.length < 2) {
    showError('Save at least 2 versions first (use History button).');
    return;
  }

  const existing = document.getElementById('compare-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'compare-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  const latest = versions[versions.length - 1];
  const previous = versions.length >= 2 ? versions[versions.length - 2] : versions[0];

  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:24px;max-width:95vw;width:1000px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h2 style="font-size:1.5rem;font-weight:700;">🔍 Compare Versions</h2>
        <button onclick="document.getElementById('compare-modal').remove()" 
                style="background:none;border:none;font-size:1.5rem;cursor:pointer;padding:4px 8px;">✕</button>
      </div>

      <!-- Version Selectors -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
        <div>
          <label style="font-size:0.8rem;font-weight:600;color:#6b7280;">Left (Older)</label>
          <select id="compare-left" onchange="updateCompareView()" 
                  style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:8px;margin-top:4px;">
            ${versions.map((v,i) => `<option value="${v.id}" ${i===versions.length-2?'selected':''}>${v.message} (${new Date(v.timestamp).toLocaleDateString()})</option>`).join('')}
          </select>
        </div>
        <div>
          <label style="font-size:0.8rem;font-weight:600;color:#6b7280;">Right (Newer)</label>
          <select id="compare-right" onchange="updateCompareView()" 
                  style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:8px;margin-top:4px;">
            ${versions.map((v,i) => `<option value="${v.id}" ${i===versions.length-1?'selected':''}>${v.message} (${new Date(v.timestamp).toLocaleDateString()})</option>`).join('')}
          </select>
        </div>
      </div>

      <!-- Side-by-Side Content -->
      <div id="compare-content" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
        ${renderComparePanel(previous, latest)}
      </div>

      <div style="display:flex;gap:8px;margin-top:16px;justify-content:center;">
        <button onclick="restoreCompareVersion('left')" 
                style="padding:8px 16px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
          Restore Left Version
        </button>
        <button onclick="restoreCompareVersion('right')" 
                style="padding:8px 16px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
          Restore Right Version
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function renderComparePanel(left, right) {
  return `
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
      <div style="font-weight:700;font-size:0.9rem;color:#6366f1;margin-bottom:12px;">${left.message}</div>
      <div style="font-size:0.8rem;">
        <p><strong>Skills:</strong> ${(left.resume.skills||[]).length} | <strong>Experience:</strong> ${(left.resume.experience||[]).length} | <strong>Education:</strong> ${(left.resume.education||[]).length}</p>
        <p><strong>Words:</strong> ${left.stats.wordCount} | <strong>Sections:</strong> ${left.stats.sections}</p>
        <hr style="margin:8px 0;">
        <pre style="font-size:0.7rem;max-height:300px;overflow-y:auto;white-space:pre-wrap;background:#f9fafb;padding:8px;border-radius:6px;">${JSON.stringify(left.resume, null, 2).substring(0, 1500)}</pre>
      </div>
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:12px;padding:16px;">
      <div style="font-weight:700;font-size:0.9rem;color:#8b5cf6;margin-bottom:12px;">${right.message}</div>
      <div style="font-size:0.8rem;">
        <p><strong>Skills:</strong> ${(right.resume.skills||[]).length} | <strong>Experience:</strong> ${(right.resume.experience||[]).length} | <strong>Education:</strong> ${(right.resume.education||[]).length}</p>
        <p><strong>Words:</strong> ${right.stats.wordCount} | <strong>Sections:</strong> ${right.stats.sections}</p>
        <hr style="margin:8px 0;">
        <pre style="font-size:0.7rem;max-height:300px;overflow-y:auto;white-space:pre-wrap;background:#f9fafb;padding:8px;border-radius:6px;">${JSON.stringify(right.resume, null, 2).substring(0, 1500)}</pre>
      </div>
    </div>
  `;
}

function updateCompareView() {
  const leftId = parseInt(document.getElementById('compare-left').value);
  const rightId = parseInt(document.getElementById('compare-right').value);
  const left = compareUI.getVersionById(leftId);
  const right = compareUI.getVersionById(rightId);
  
  if (left && right) {
    document.getElementById('compare-content').innerHTML = renderComparePanel(left, right);
  }
}

function restoreCompareVersion(side) {
  const id = parseInt(document.getElementById('compare-' + side).value);
  const version = compareUI.getVersionById(id);
  if (version && confirm('Restore "' + version.message + '" ? Current changes will be lost.')) {
    App.resumeData = JSON.parse(JSON.stringify(version.resume));
    if (version.template) App.selectedTemplate = version.template;
    saveToStorage();
    refreshView();
    document.getElementById('compare-modal').remove();
    showSuccess('Version restored!');
  }
}