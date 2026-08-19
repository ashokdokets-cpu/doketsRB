// Resume Video Introduction
// Record or upload a 30-second video pitch for your resume

function showVideoIntro() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  
  var existing = document.getElementById('video-modal');
  if (existing) existing.remove();
  
  var modal = document.createElement('div');
  modal.id = 'video-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">🎥 Video Introduction</h2><button onclick="document.getElementById(\'video-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Add a 30-second video pitch to make your resume stand out. Recruiters love seeing personality!</p><div style="background:#f0fdf4;padding:16px;border-radius:10px;margin-bottom:16px;"><h3 style="font-weight:600;font-size:0.9rem;color:#166534;margin-bottom:8px;">💡 Video Script Tips:</h3><ol style="font-size:0.8rem;color:#166534;padding-left:20px;"><li>Start with your name and current role</li><li>Mention 1-2 key achievements (use numbers!)</li><li>Explain why you are interested in the role</li><li>End with a call to action</li><li>Keep it under 30 seconds</li></ol></div><div style="margin-bottom:12px;"><label style="font-size:0.85rem;font-weight:600;">Video URL (YouTube, Vimeo, or Loom):</label><input id="video-url" placeholder="https://www.youtube.com/watch?v=... or https://www.loom.com/share/..." style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-top:4px;font-size:0.85rem;"></div><div style="text-align:center;color:#9ca3af;font-size:0.8rem;margin-bottom:12px;">— OR —</div><div style="margin-bottom:16px;"><label style="font-size:0.85rem;font-weight:600;">Upload Video (MP4, max 30MB):</label><input type="file" id="video-file" accept="video/mp4" onchange="handleVideoUpload(this)" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-top:4px;font-size:0.85rem;"></div><div id="video-preview" style="display:none;margin-bottom:12px;"></div><button onclick="saveVideoIntro()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Save Video Introduction</button></div>';
  document.body.appendChild(modal);
}

function handleVideoUpload(input) {
  var file = input.files[0];
  if (!file) return;
  if (file.size > 30 * 1024 * 1024) {
    showError('Video must be under 30MB.');
    return;
  }
  
  var url = URL.createObjectURL(file);
  var preview = document.getElementById('video-preview');
  preview.innerHTML = '<video src="'+url+'" controls style="width:100%;max-height:200px;border-radius:8px;"></video><p style="font-size:0.75rem;color:#6b7280;margin-top:4px;">'+file.name+' ('+(file.size/1024/1024).toFixed(1)+' MB)</p>';
  preview.style.display = 'block';
}

function saveVideoIntro() {
  var url = document.getElementById('video-url').value.trim();
  var fileInput = document.getElementById('video-file');
  var file = fileInput.files[0];
  
  if (!url && !file) {
    showError('Please enter a video URL or upload a video.');
    return;
  }
  
  // Store video reference in resume data
  var videoData = url || (file ? file.name : '');
  if (!App.resumeData.customSections) App.resumeData.customSections = [];
  
  // Add or update video section
  var existingIdx = App.resumeData.customSections.findIndex(function(s){ return s.title === 'Video Introduction'; });
  if (existingIdx >= 0) {
    App.resumeData.customSections[existingIdx].content = videoData;
  } else {
    App.resumeData.customSections.push({ title: 'Video Introduction', content: videoData });
  }
  
  updateState({ resumeData: App.resumeData });
  document.getElementById('video-modal').remove();
  showSuccess('Video introduction saved! It will appear on your resume.');
}