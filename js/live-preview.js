// Real-Time Live Preview
// Shows resume preview that updates as user types
// Extends existing refreshView() - does not replace it

(function() {
  var previewDebounce = null;

  function initLivePreview() {
    document.addEventListener('input', function(e) {
      var target = e.target;
      if (target.closest('#builder') || target.closest('.builder-section')) {
        if (previewDebounce) clearTimeout(previewDebounce);
        previewDebounce = setTimeout(updatePreview, 500);
      }
    });

    var observer = new MutationObserver(function() {
      if (previewDebounce) clearTimeout(previewDebounce);
      previewDebounce = setTimeout(updatePreview, 300);
    });

    var previewContainer = document.getElementById('preview-panel');
    if (previewContainer) {
      observer.observe(previewContainer, { childList: true, subtree: true, characterData: true });
    }

    setTimeout(updatePreview, 1000);
  }

  function updatePreview() {
    if (!App.resumeData) return;

    var previewPanel = document.getElementById('preview-panel');
    if (!previewPanel) {
      createPreviewPanel();
      previewPanel = document.getElementById('preview-panel');
    }

    if (previewPanel) {
      var content = document.getElementById('live-preview-content');
      if (content && typeof renderResumePreview === 'function') {
        content.innerHTML = renderResumePreview();
      }
      updateLiveStats(App.resumeData);
    }
  }

  function createPreviewPanel() {
    var builderGrid = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-5');
    if (!builderGrid) return;

    var panel = document.createElement('div');
    panel.id = 'preview-panel';
    panel.className = 'hidden lg:block lg:col-span-2';
    panel.style.cssText = 'max-height:calc(100vh - 200px);overflow-y:auto;position:sticky;top:20px;';
    panel.innerHTML = '<div class="bg-white rounded-xl border shadow-sm p-6"><h3 class="font-bold text-sm mb-3">📄 Live Preview</h3><div id="live-preview-content"><p class="text-gray-400 text-sm">Start typing to see a live preview...</p></div><div id="live-stats" class="mt-4 pt-4 border-t text-xs text-gray-500"></div></div>';

    builderGrid.appendChild(panel);
    updatePreview();
  }

  function updateLiveStats(rd) {
    var statsEl = document.getElementById('live-stats');
    if (!statsEl) return;

    var wordCount = JSON.stringify(rd).split(' ').length;
    var skillCount = (rd.skills || []).length;
    var expCount = (rd.experience || []).length;
    var eduCount = (rd.education || []).length;

    statsEl.innerHTML = '📄 ' + wordCount + ' words | 💡 ' + skillCount + ' skills | 💼 ' + expCount + ' roles | 🎓 ' + eduCount + ' degrees';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initLivePreview, 1500);
    });
  } else {
    setTimeout(initLivePreview, 1500);
  }
})();