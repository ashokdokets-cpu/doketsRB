// Simple Enhance Preview - Direct approach
function enhancePreview() {
  try {
    var rd = (typeof App !== "undefined" && App.resumeData) ? App.resumeData : {};
    var html = '';
    
    if (rd.myTime && rd.myTime.length > 0) {
      html += '<div style="margin-top:16px;"><h2>MY TIME</h2>';
      rd.myTime.forEach(function(item) {
        if (item.activity && item.percentage > 0) {
          html += '<div>' + item.activity + ': ' + item.percentage + '%</div>';
          html += '<div style="background:#e5e7eb;height:6px;border-radius:8px;"><div style="background:#2563eb;height:6px;border-radius:8px;width:' + item.percentage + '%;"></div></div>';
        }
      });
      html += '</div>';
    }
    
    if (rd.strengths && rd.strengths.length > 0) {
      html += '<div style="margin-top:16px;"><h2>STRENGTHS</h2><div>' + rd.strengths.join(', ') + '</div></div>';
    }
    
    if (rd.philosophy) {
      html += '<div style="margin-top:16px;"><h2>PHILOSOPHY</h2><p>"' + rd.philosophy + '"</p></div>';
    }
    
    if (rd.books && rd.books.length > 0) {
      html += '<div style="margin-top:16px;"><h2>BOOKS</h2>';
      rd.books.forEach(function(b) {
        if (b.title) html += '<p>' + b.title + (b.author ? ' - ' + b.author : '') + '</p>';
      });
      html += '</div>';
    }
    
    var old = document.getElementById('enhance-overlay');
    if (old) old.remove();
    
    if (html) {
      var overlay = document.createElement('div');
      overlay.id = 'enhance-overlay';
      overlay.innerHTML = html;
      var previewArea = document.getElementById('builder-preview-area');
      if (previewArea && previewArea.parentElement) {
        previewArea.parentElement.appendChild(overlay);
      }
    }
  } catch(e) {
    console.log('Enhance error:', e.message);
  }
}

setInterval(enhancePreview, 1000);
console.log('Enhance preview script loaded!');