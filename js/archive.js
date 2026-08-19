// Archive System
// Soft-delete resumes instead of permanent deletion

const archiveSystem = (function() {
  var STORAGE_KEY = 'resume_archives';

  function getAll() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch(e) { return []; }
  }

  function archive(message) {
    var archives = getAll();
    var entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      message: message || 'Archived ' + new Date().toLocaleDateString(),
      resume: JSON.parse(JSON.stringify(App.resumeData)),
      template: App.selectedTemplate
    };
    archives.push(entry);
    if (archives.length > 30) archives = archives.slice(-30);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(archives));
    return entry;
  }

  function restore(id) {
    var archives = getAll();
    var entry = archives.find(function(a) { return a.id === id; });
    if (entry) {
      App.resumeData = JSON.parse(JSON.stringify(entry.resume));
      if (entry.template) App.selectedTemplate = entry.template;
      saveToStorage();
      refreshView();
      return true;
    }
    return false;
  }

  function remove(id) {
    var archives = getAll().filter(function(a) { return a.id !== id; });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(archives));
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    getAll: getAll,
    archive: archive,
    restore: restore,
    remove: remove,
    clearAll: clearAll
  };
})();

function archiveCurrentResume() {
  if (!App.resumeData || !App.resumeData.personal || !App.resumeData.personal.fullName) {
    showError('Nothing to archive. Add some content first.');
    return;
  }

  var msg = prompt('Name this archive (optional):', 
    (App.resumeData.personal.fullName || 'Resume') + ' - ' + new Date().toLocaleDateString());
  if (msg === null) return;

  archiveSystem.archive(msg || undefined);
  showSuccess('Resume archived!');
}

function showArchives() {
  var archives = archiveSystem.getAll();
  var existing = document.getElementById('archive-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'archive-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  var listHTML = archives.length === 0 
    ? '<div style="text-align:center;padding:40px;color:#9ca3af;"><div style="font-size:3rem;">📦</div><div style="margin-top:8px;">No archived resumes</div></div>'
    : archives.slice().reverse().map(function(a) {
        var d = new Date(a.timestamp);
        return `
          <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;background:#f9fafb;border-radius:8px;margin-bottom:6px;">
            <div style="flex:1;min-width:0;">
              <div style="font-weight:600;font-size:0.85rem;">${a.message}</div>
              <div style="font-size:0.7rem;color:#6b7280;">${d.toLocaleString()} • ${(a.resume.skills||[]).length} skills</div>
            </div>
            <div style="display:flex;gap:6px;flex-shrink:0;">
              <button onclick="archiveSystem.restore(${a.id});document.getElementById('archive-modal').remove();showSuccess('Restored!')" 
                      style="padding:4px 10px;background:#6366f1;color:white;border:none;border-radius:5px;font-size:0.75rem;cursor:pointer;">Restore</button>
              <button onclick="archiveSystem.remove(${a.id});showArchives();" 
                      style="padding:4px 10px;background:#fef2f2;color:#dc2626;border:none;border-radius:5px;font-size:0.75rem;cursor:pointer;">Delete</button>
            </div>
          </div>`;
      }).join('');

  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h2 style="font-size:1.3rem;font-weight:700;">📦 Archived Resumes</h2>
        <button onclick="document.getElementById('archive-modal').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button>
      </div>
      <button onclick="archiveCurrentResume();setTimeout(showArchives,300)" 
              style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-bottom:12px;">
        ➕ Archive Current Resume
      </button>
      ${listHTML}
      ${archives.length > 0 ? '<div style="text-align:center;margin-top:12px;"><button onclick="if(confirm(\"Delete ALL archives?\")){archiveSystem.clearAll();showArchives();}" style="padding:8px 16px;background:#fef2f2;color:#dc2626;border:none;border-radius:8px;font-size:0.8rem;cursor:pointer;">Clear All Archives</button></div>' : ''}
    </div>
  `;
  document.body.appendChild(modal);
}