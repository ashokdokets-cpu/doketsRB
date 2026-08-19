// DOCX+ Enhanced Export with Coaching Tips inside the document
function exportDOCXWithComments() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  if (!App.resumeData || !App.resumeData.personal || !App.resumeData.personal.fullName) {
    showError('Add content before exporting.');
    return;
  }
  showLoader();
  var rd = App.resumeData;

  try {
    var doc = new docx.Document({
      sections: [{
        properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
        children: buildCoachingDocx(rd)
      }]
    });
    docx.Packer.toBlob(doc).then(function(blob) {
      hideLoader();
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = rd.personal.fullName.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '_coaching.docx';
      a.click();
      URL.revokeObjectURL(url);
      showSuccess('DOCX with coaching tips downloaded!');
    }).catch(function() { hideLoader(); showError('Export failed.'); });
  } catch(e) { hideLoader(); showError('Export error.'); }
}

function buildCoachingDocx(rd) {
  var c = [];
  var accent = '2B579A';

  // Name
  c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: rd.personal.fullName, bold: true, size: 36 })], spacing: { after: 40 } }));

  // Contact
  var contact = [rd.personal.email, rd.personal.phone, rd.personal.location].filter(Boolean).join(' | ');
  c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: contact, size: 18, color: '64748b' })], spacing: { after: 40 } }));

  // Summary
  if (rd.summary) {
    c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 22, color: accent })], spacing: { after: 12 } }));
    c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: rd.summary, size: 20 })], spacing: { after: 30 } }));
  }

  // Experience
  if (rd.experience.length > 0) {
    c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: 'PROFESSIONAL EXPERIENCE', bold: true, size: 22, color: accent })], spacing: { after: 12 } }));
    rd.experience.forEach(function(exp) {
      c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: (exp.title || '') + (exp.dates ? ' (' + exp.dates + ')' : ''), bold: true, size: 22 })], spacing: { after: 8 } }));
      if (exp.bullets) {
        exp.bullets.split('\n').filter(function(b){ return b.trim(); }).forEach(function(bullet) {
          var clean = bullet.replace(/^[•\-\*\s]+/, '').trim();
          if (clean) c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: '• ' + clean, size: 20 })], spacing: { after: 6 } }));
        });
      }
      c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: '', size: 12 })], spacing: { after: 16 } }));
    });
  }

  // Education
  if (rd.education.length > 0) {
    c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: 'EDUCATION', bold: true, size: 22, color: accent })], spacing: { after: 12 } }));
    rd.education.forEach(function(edu) {
      c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: (edu.degree || '') + ' - ' + (edu.school || '') + (edu.year ? ' (' + edu.year + ')' : ''), size: 20 })], spacing: { after: 8 } }));
    });
    c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: '', size: 12 })], spacing: { after: 16 } }));
  }

  // Skills
  if (rd.skills.length > 0) {
    c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: 'SKILLS', bold: true, size: 22, color: accent })], spacing: { after: 12 } }));
    c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: rd.skills.join(' • '), size: 20 })], spacing: { after: 30 } }));
  }

  // Coaching Tips Section - simple, no special formatting
  c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: '', size: 12 })], spacing: { after: 20 } }));
  c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: 'COACHING TIPS (remove before submitting)', bold: true, size: 20, color: '2563eb' })], spacing: { after: 12 } }));
  
  var tips = [];
  if (!/\d+\+?\s*years/i.test(rd.summary || '')) tips.push('- Add years of experience to your summary (e.g., "10+ years in...")');
  var bc = 0, mc = 0;
  rd.experience.forEach(function(exp) {
    if (exp.bullets) exp.bullets.split('\n').forEach(function(b) {
      if (b.trim()) { bc++; if (/\d+%|\$\d+|increased|reduced|achieved|delivered/i.test(b)) mc++; }
    });
  });
  if (bc > 0 && mc < bc * 0.5) tips.push('- Add measurable results to your bullets. Only ' + mc + ' of ' + bc + ' bullets have metrics.');
  if (rd.skills.length < 8) tips.push('- Add more skills (aim for 8-15). Include technical, soft, and tools.');
  tips.push('- Use action verbs: Led, Managed, Developed, Implemented, Achieved, Increased, Reduced');
  tips.push('- Tailor your resume for EACH job application using the AI Tailor feature');
  tips.push('- Remove this coaching section before submitting to employers');
  
  tips.forEach(function(tip) {
    c.push(new docx.Paragraph({ children: [new docx.TextRun({ text: tip, size: 18, color: '475569' })], spacing: { after: 6 } }));
  });

  return c;
}