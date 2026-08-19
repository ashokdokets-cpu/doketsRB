// Expert Review Marketplace
// Connects users with professional resume writers for final audit

function showExpertReview() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }

  var existing = document.getElementById('expert-review-modal');
  if (existing) existing.remove();

  var modal = document.createElement('div');
  modal.id = 'expert-review-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

  var reviewPrices = {
    USD: { symbol: '$', price: '49', label: '$49' },
    INR: { symbol: '₹', price: '2,499', label: '₹2,499' },
    EUR: { symbol: '€', price: '45', label: '€45' },
    GBP: { symbol: '£', price: '39', label: '£39' },
    CAD: { symbol: 'C$', price: '65', label: 'C$65' },
    AUD: { symbol: 'A$', price: '75', label: 'A$75' },
    SGD: { symbol: 'S$', price: '65', label: 'S$65' }
  };
  var rc = (typeof App !== 'undefined' && App.currency) ? App.currency : 'USD';
  var rp = reviewPrices[rc] || reviewPrices['USD'];

  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:500px;width:90%;max-height:85vh;overflow-y:auto;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">👨‍💼 Expert Resume Review</h2><button onclick="document.getElementById(\'expert-review-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">X</button></div><p style="font-size:0.85rem;color:#6b7280;margin-bottom:16px;">Get your resume reviewed by certified professional resume writers. They will audit your resume and provide detailed feedback.</p><div style="background:#f9fafb;border-radius:10px;padding:16px;margin-bottom:12px;"><h3 style="font-weight:600;margin-bottom:8px;">How It Works:</h3><ol style="font-size:0.85rem;color:#4b5563;padding-left:20px;"><li>Submit your resume</li><li>Our experts review within 24-48 hours</li><li>Receive detailed feedback and suggestions</li><li>Apply changes and land more interviews</li></ol></div><div style="background:#eff6ff;border-radius:10px;padding:16px;margin-bottom:12px;"><h3 style="font-weight:600;margin-bottom:4px;color:#1e40af;">💰 Pricing</h3><p style="font-size:1.5rem;font-weight:800;color:#2563eb;">' + rp.label + ' <span style="font-size:0.85rem;font-weight:400;color:#6b7280;">per review</span></p><p style="font-size:0.8rem;color:#6b7280;">Includes: ATS analysis, content review, formatting check, and actionable suggestions.</p></div><button onclick="submitForExpertReview()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;margin-bottom:8px;">Submit for Review (' + rp.label + ')</button><p style="font-size:0.75rem;color:#9ca3af;text-align:center;">Secure payment via Razorpay/PayPal. 100% satisfaction guarantee.</p></div>';
  document.body.appendChild(modal);
}

function submitForExpertReview() {
  if (!App.resumeData?.personal?.fullName) { showError('Add resume content before submitting.'); return; }

  var subject = 'Expert Resume Review Request - ' + App.resumeData.personal.fullName;
  var body = 'Name: ' + App.resumeData.personal.fullName + '%0D%0A' +
             'Email: ' + (App.resumeData.personal.email || 'N/A') + '%0D%0A' +
             'Plan: ' + (userProfile?.plan || 'free') + '%0D%0A%0D%0A' +
             'Resume Summary:%0D%0A' + (App.resumeData.summary || 'N/A') + '%0D%0A%0D%0A' +
             'Skills: ' + (App.resumeData.skills?.join(', ') || 'N/A');

  window.open('mailto:contact@dokets.com?subject=' + encodeURIComponent(subject) + '&body=' + body, '_blank');
  document.getElementById('expert-review-modal').remove();
  showSuccess('Expert review request sent! We will contact you within 24-48 hours.');
}
