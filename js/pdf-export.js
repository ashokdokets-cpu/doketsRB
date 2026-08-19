// PDF Export System - Integrates with existing Dokets Resume Builder
// Uses html2pdf.js - lightweight and easy to integrate

// Load html2pdf library dynamically
function loadPDFLibrary() {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load PDF library'));
    document.head.appendChild(script);
  });
}

// Get current resume preview element
function getResumePreviewElement() {
  // Include enhance overlay if present
  var overlay = document.getElementById('enhance-overlay');
  if (overlay && overlay.innerHTML) {
    var preview = document.getElementById('builder-preview-area');
    if (preview) {
      // Create a wrapper that includes both preview and overlay
      var wrapper = document.createElement('div');
      wrapper.appendChild(preview.cloneNode(true));
      wrapper.appendChild(overlay.cloneNode(true));
      return wrapper;
    }
  }
  // Try multiple possible preview containers
  const selectors = [
    '#resume-preview',
    '.resume-preview',
    '#resume-display',
    '.resume-display',
    '#live-preview',
    '.live-preview',
    '#builder-preview',
    '.builder-preview',
    '[data-resume-preview]',
    'main .resume',
    '.resume-container'
  ];
  
  for (let selector of selectors) {
    const element = document.querySelector(selector);
    if (element && element.offsetHeight > 100) {
      return element;
    }
  }
  
  // Fallback: find the largest text container in the builder view
  const builderView = document.getElementById('builder') || document.getElementById('app');
  if (builderView) {
    const divs = builderView.querySelectorAll('div');
    let largest = null;
    let maxHeight = 0;
    
    divs.forEach(div => {
      const height = div.offsetHeight;
      if (height > maxHeight && div.innerText && div.innerText.length > 100) {
        maxHeight = height;
        largest = div;
      }
    });
    
    if (largest) return largest;
  }
  
  // Last resort: body
  return document.body;
}

// Generate PDF from current resume
async function exportToPDF(options = {}) {
  const {
    filename = null,
    format = 'a4',
    quality = 0.95,
    margin = [10, 10, 10, 10],
    enableLinks = true,
    pageBreak = true,
    showLoader = true
  } = options;
  
  // Validate resume data
  if (!App.resumeData || !App.resumeData.personal || !App.resumeData.personal.fullName) {
    showError('Add content before exporting.');
    return;
  }
  
  if (showLoader) showLoader();
  
  try {
    await loadPDFLibrary();
    
    const element = getResumePreviewElement();
    
    // Append ENHANCE sections to element for export
    if (typeof buildEnhanceSections === 'function' && App.resumeData) {
      var enhanceHTML = buildEnhanceSections(App.resumeData);
      if (enhanceHTML) {
        var enhanceDiv = document.createElement('div');
        enhanceDiv.innerHTML = enhanceHTML;
        element.appendChild(enhanceDiv);
      }
    }
    const name = filename || App.resumeData.personal.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_resume.pdf';
    
    // Ensure element is visible for proper rendering
    const originalDisplay = element.style.display;
    const originalVisibility = element.style.visibility;
    
    if (element.offsetHeight === 0) {
      element.style.display = 'block';
      element.style.visibility = 'visible';
      element.style.position = 'fixed';
      element.style.left = '-9999px';
      element.style.top = '0';
    }
    
    const opt = {
      margin: margin,
      filename: name,
      image: { type: 'jpeg', quality: quality },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        letterRendering: true,
        windowWidth: element.scrollWidth,
        logging: false
      },
      jsPDF: { 
        unit: 'mm', 
        format: format, 
        orientation: 'portrait' 
      },
      pagebreak: pageBreak ? { mode: ['avoid-all', 'css', 'legacy'] } : { mode: [] },
      enableLinks: enableLinks
    };
    
    // Generate PDF
    await html2pdf().set(opt).from(element).save();
    
    // Restore original styles
    element.style.display = originalDisplay;
    element.style.visibility = originalVisibility;
    element.style.position = '';
    element.style.left = '';
    element.style.top = '';
    
    if (showLoader) hideLoader();
    showSuccess('PDF downloaded successfully!');
    
    // Track export
    if (typeof trackEvent === 'function') {
      trackEvent('resume_export_pdf', { 
        template: App.selectedTemplate,
        format: format 
      });
    }
    
    return true;
    
  } catch (error) {
    console.error('PDF export error:', error);
    if (showLoader) hideLoader();
    
    // Fallback: Use browser print
    if (confirm('PDF generation failed. Use browser print instead?')) {
      printToPDF();
    } else {
      showError('PDF export failed. Please try again or use print option.');
    }
    return false;
  }
}

// Fallback: Use browser's native print-to-PDF
function printToPDF() {
  const element = getResumePreviewElement();
  
  // Create a new window for printing
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    showError('Popup blocked. Please allow popups and try again.');
    return;
  }
  
  // Get styles from parent window
  const styles = [];
  document.querySelectorAll('link[rel="stylesheet"], style').forEach(style => {
    styles.push(style.outerHTML);
  });
  
  // Build print window HTML
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${App.resumeData.personal.fullName || 'Resume'} - Dokets</title>
      ${styles.join('\n')}
      <style>
        body { 
          padding: 40px; 
          font-family: Arial, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none !important; }
        }
        .print-button {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 12px 24px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          z-index: 9999;
        }
        .print-button:hover { background: #4f46e5; }
      </style>
    </head>
    <body>
      <button class="print-button no-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
      ${element.outerHTML}
      <script>
        window.onload = function() {
          // Auto-trigger print dialog after a short delay
          setTimeout(function() {
            // Uncomment next line to auto-open print dialog
            // window.print();
          }, 500);
        };
      <\/script>
    </body>
    </html>
  `);
  
  printWindow.document.close();
}

// Quick export menu function
function showExportMenu() {
  const existing = document.getElementById('export-menu-modal');
  if (existing) existing.remove();
  
  const modal = document.createElement('div');
  modal.id = 'export-menu-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };
  
  modal.innerHTML = `
    <div style="background:white;border-radius:16px;padding:24px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h2 style="font-size:1.4rem;font-weight:700;">📥 Export Resume</h2>
        <button onclick="document.getElementById('export-menu-modal').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button>
      </div>
      
      <div style="display:grid;gap:10px;">
        <button onclick="exportToPDF(); document.getElementById('export-menu-modal').remove();" 
                style="padding:14px;background:#ef4444;color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:0.95rem;">
          📄 Export as PDF
        </button>
        
        <button onclick="printToPDF(); document.getElementById('export-menu-modal').remove();" 
                style="padding:14px;background:#6366f1;color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:0.95rem;">
          🖨️ Print / Save as PDF (Browser)
        </button>
        
        <button onclick="exportDOCXWithComments(); document.getElementById('export-menu-modal').remove();" 
                style="padding:14px;background:#3b82f6;color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:0.95rem;">
          📝 Export as DOCX (with coaching tips)
        </button>
        
        <button onclick="exportAsTXT(); document.getElementById('export-menu-modal').remove();" 
                style="padding:14px;background:#10b981;color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;font-size:0.95rem;">
          📃 Export as Text
        </button>
      </div>
      
      <div style="margin-top:16px;padding:12px;background:#f9fafb;border-radius:8px;font-size:0.8rem;color:#6b7280;">
        💡 <b>Pro Tip:</b> PDF format is best for ATS systems and email attachments. DOCX is better for editing.
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Export as plain text
function exportAsTXT() {
  const rd = App.resumeData;
  if (!rd || !rd.personal || !rd.personal.fullName) {
    showError('Add content before exporting.');
    return;
  }

  let text = '';
  text += rd.personal.fullName.toUpperCase() + '\n';
  text += '='.repeat(50) + '\n\n';

  if (rd.personal.email) text += 'Email: ' + rd.personal.email + '\n';
  if (rd.personal.phone) text += 'Phone: ' + rd.personal.phone + '\n';
  if (rd.personal.location) text += 'Location: ' + rd.personal.location + '\n';
  text += '\n';

  if (rd.summary) {
    text += 'PROFESSIONAL SUMMARY\n' + '-'.repeat(30) + '\n' + rd.summary + '\n\n';
  }

  if (rd.experience && rd.experience.length > 0) {
    text += 'EXPERIENCE\n' + '-'.repeat(30) + '\n';
    rd.experience.forEach(function(exp) {
      text += (exp.title || '') + ' - ' + (exp.company || '') + '\n';
      if (exp.bullets) {
        exp.bullets.split('\n').forEach(function(bullet) {
          if (bullet.trim()) text += '  ' + bullet.trim() + '\n';
        });
      }
      text += '\n';
    });
  }

  if (rd.education && rd.education.length > 0) {
    text += 'EDUCATION\n' + '-'.repeat(30) + '\n';
    rd.education.forEach(function(edu) {
      text += (edu.degree || '') + ' - ' + (edu.school || '') + '\n';
    });
    text += '\n';
  }

  if (rd.skills && rd.skills.length > 0) {
    text += 'SKILLS\n' + '-'.repeat(30) + '\n';
    text += rd.skills.join(', ') + '\n';
  }

  // Add ENHANCE sections
  if (rd.myTime && rd.myTime.length > 0) {
    text += '\nMY TIME\n' + '-'.repeat(30) + '\n';
    rd.myTime.forEach(function(item) {
      if (item.activity && item.percentage > 0) {
        text += item.activity + ': ' + item.percentage + '%\n';
      }
    });
  }
  
  if (rd.strengths && rd.strengths.length > 0) {
    text += '\nSTRENGTHS\n' + '-'.repeat(30) + '\n';
    text += rd.strengths.join(', ') + '\n';
  }
  
  if (rd.philosophy) {
    text += '\nPHILOSOPHY\n' + '-'.repeat(30) + '\n';
    text += '"' + rd.philosophy + '"\n';
  }
  
  if (rd.books && rd.books.length > 0) {
    text += '\nBOOKS & INFLUENCES\n' + '-'.repeat(30) + '\n';
    rd.books.forEach(function(b) {
      if (b.title) text += b.title + (b.author ? ' - ' + b.author : '') + '\n';
    });
  }

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = rd.personal.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_resume.txt';
  a.click();
  URL.revokeObjectURL(url);

  showSuccess('Resume exported as text!');
}

window.exportAsTXT = exportAsTXT;
window.injectExportButton = injectExportButton;