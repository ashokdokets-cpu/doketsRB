// ENHANCE Export Sections - Adds My Time, Strengths, Philosophy, Books to exports
// Shared function used by PDF, DOCX, and print exports

function buildEnhanceSections(rd) {
  var html = '';
  
  // My Time section
  if (rd.myTime && rd.myTime.length > 0) {
    html += '<h2>MY TIME</h2>';
    rd.myTime.forEach(function(item) {
      if (item.activity && item.percentage > 0) {
        html += '<div style="margin-bottom:6px;">';
        html += '<div style="display:flex;justify-content:space-between;font-size:11px;">';
        html += '<span>' + item.activity + '</span><span>' + item.percentage + '%</span></div>';
        html += '<div style="background:#e5e7eb;height:6px;border-radius:8px;"><div style="background:#2563eb;height:6px;border-radius:8px;width:' + item.percentage + '%;"></div></div>';
        html += '</div>';
      }
    });
  }
  
  // Strengths section
  if (rd.strengths && rd.strengths.length > 0) {
    html += '<h2>STRENGTHS</h2>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">';
    rd.strengths.forEach(function(s) {
      html += '<span style="background:#eff6ff;color:#2563eb;padding:3px 10px;border-radius:12px;font-size:10px;">' + s + '</span>';
    });
    html += '</div>';
  }
  
  // Philosophy section
  if (rd.philosophy) {
    html += '<h2>PHILOSOPHY</h2>';
    html += '<p style="font-style:italic;">"' + rd.philosophy + '"</p>';
  }
  
  // Books section
  if (rd.books && rd.books.length > 0) {
    html += '<h2>BOOKS & INFLUENCES</h2>';
    rd.books.forEach(function(b) {
      if (b.title) {
        html += '<p>' + b.title + (b.author ? ' - ' + b.author : '') + '</p>';
      }
    });
  }
  
  return html;
}

// Export to global
window.buildEnhanceSections = buildEnhanceSections;