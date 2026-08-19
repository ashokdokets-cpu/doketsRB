// Email Templates System - 40+ Professional Templates
// Categories: Follow-ups, Thank-yous, Networking, Referrals, Negotiation, Rejection, Recruiter, Update, Recommendation, Resignation, Internship, Cold Email

const EmailTemplates = {
  categories: {
    follow_up: {
      label: 'Application Follow-ups',
      icon: '📧',
      templates: [
        { id: 'fu1', name: 'Application Follow-up (1 week)', subject: 'Following up on my application for {jobTitle}', body: 'Dear {hiringManager},\n\nI hope this email finds you well. I submitted my application for the {jobTitle} position at {company} on {date}, and I wanted to follow up to express my continued interest in the role.\n\nAfter researching {company} work in {industry}, I am confident that my background in {skill1} and {skill2} would allow me to contribute meaningfully to your team.\n\nI have attached my resume for your convenience. I would welcome the opportunity to discuss how my experience aligns with your needs.\n\nThank you for your time and consideration.\n\nBest regards,\n{fullName}\n{phone}\n{email}' },
        { id: 'fu2', name: 'Application Follow-up (2 weeks)', subject: 'Re: Application for {jobTitle} - {fullName}', body: 'Dear {hiringManager},\n\nI am writing to follow up on my application for the {jobTitle} position at {company}. I remain very interested in this opportunity and would love to learn more about the next steps in your hiring process.\n\nSince applying, I have continued to develop my skills in {skill1} and would be excited to bring this expertise to {company}.\n\nPlease let me know if there is any additional information I can provide to support my application.\n\nWarm regards,\n{fullName}' },
        { id: 'fu3', name: 'Application Follow-up (After Interview)', subject: 'Following up on {jobTitle} interview', body: 'Dear {hiringManager},\n\nThank you again for taking the time to interview me for the {jobTitle} position. I enjoyed learning more about {company} and the team.\n\nI wanted to follow up on the next steps in the process. I remain very excited about this opportunity and am confident I can contribute to {company} success.\n\nPlease let me know if there is any additional information I can provide.\n\nBest regards,\n{fullName}' },
        { id: 'fu4', name: 'Follow-up After Referral', subject: 'Following up on referral from {contactName}', body: 'Dear {hiringManager},\n\n{contactName} referred me for the {jobTitle} position at {company}. I submitted my application and wanted to follow up to express my strong interest.\n\nMy background in {skill1} aligns well with the requirements, and I am eager to contribute to your team.\n\nThank you for considering my application.\n\nBest regards,\n{fullName}' },
        { id: 'fu5', name: 'Follow-up (Final Check)', subject: 'Final follow-up: {jobTitle} application', body: 'Dear {hiringManager},\n\nI wanted to send one final follow-up regarding my application for the {jobTitle} position. I remain very interested in joining {company}.\n\nI understand you have a busy schedule, so I will not reach out again. If you need any additional information, please do not hesitate to contact me.\n\nThank you for your consideration.\n\nBest regards,\n{fullName}' }
      ]
    },
    thank_you: {
      label: 'Interview Thank-yous',
      icon: '🙏',
      templates: [
        { id: 'ty1', name: 'Thank You (Standard)', subject: 'Thank you for the interview - {jobTitle}', body: 'Dear {hiringManager},\n\nThank you for taking the time to interview me today for the {jobTitle} position. I enjoyed learning more about the role and {company} mission.\n\nOur conversation reinforced my enthusiasm for this opportunity.\n\nPlease do not hesitate to reach out if you need any additional information.\n\nBest regards,\n{fullName}' },
        { id: 'ty2', name: 'Thank You (Detailed)', subject: 'Thank you - {jobTitle} Interview', body: 'Dear {hiringManager},\n\nThank you for the opportunity to interview for the {jobTitle} position at {company}. I truly appreciated learning about the team goals and how this role contributes to the organization.\n\nI was particularly inspired by {specificTopic}. My experience with {relevantSkill} would allow me to hit the ground running.\n\nI look forward to hearing about the next steps.\n\nWarm regards,\n{fullName}' },
        { id: 'ty3', name: 'Thank You (Panel Interview)', subject: 'Thank you - {jobTitle} Panel Interview', body: 'Dear {hiringManager} and Team,\n\nI wanted to express my sincere gratitude for the opportunity to meet with each of you during my interview for the {jobTitle} position.\n\nI was impressed by the team passion and the exciting projects at {company}.\n\nI am very enthusiastic about the possibility of joining your team.\n\nBest regards,\n{fullName}' },
        { id: 'ty4', name: 'Thank You (Phone Screen)', subject: 'Thank you - Phone Screen', body: 'Dear {hiringManager},\n\nThank you for the phone conversation today regarding the {jobTitle} position. I appreciated learning more about {company} and the role.\n\nI am excited about the opportunity and look forward to the next steps.\n\nBest regards,\n{fullName}' },
        { id: 'ty5', name: 'Thank You (Final Round)', subject: 'Thank you - Final Interview', body: 'Dear {hiringManager},\n\nThank you for the opportunity to participate in the final round of interviews for the {jobTitle} position.\n\nI am very excited about the possibility of joining {company} and contributing to your team success.\n\nI look forward to hearing from you.\n\nWarm regards,\n{fullName}' }
      ]
    },
    networking: {
      label: 'Networking',
      icon: '🤝',
      templates: [
        { id: 'nw1', name: 'LinkedIn Connection Request', subject: 'Connection Request', body: 'Hi {contactName},\n\nI came across your profile while researching {industry} professionals and was impressed by your experience at {company}.\n\nI am currently exploring opportunities in {field} and would love to connect and learn from your journey.\n\nLooking forward to connecting!\n\n{fullName}' },
        { id: 'nw2', name: 'Informational Interview Request', subject: 'Request for 15-min informational chat', body: 'Dear {contactName},\n\nI hope this message finds you well. I am reaching out because I am exploring career opportunities in {field} and noticed your impressive background at {company}.\n\nWould you be open to a brief 15-minute conversation to share your insights?\n\nI understand you are busy, so I truly appreciate your consideration.\n\nBest regards,\n{fullName}' },
        { id: 'nw3', name: 'Post-Networking Follow-up', subject: 'Great connecting with you', body: 'Hi {contactName},\n\nIt was wonderful meeting you at {event}. I enjoyed our conversation about {topic}.\n\nI wanted to follow up and express my appreciation for your insights.\n\nPlease let me know if there is any way I can be helpful to you as well.\n\nBest regards,\n{fullName}' },
        { id: 'nw4', name: 'Alumni Networking', subject: 'Connecting with fellow alum', body: 'Hi {contactName},\n\nI noticed we both attended {event}. I am reaching out to connect with fellow alumni in {field}.\n\nI would love to learn about your experience at {company} and any advice you might have for someone transitioning into this field.\n\nThank you for your time!\n\nBest regards,\n{fullName}' }
      ]
    },
    referral: {
      label: 'Referral Requests',
      icon: '📋',
      templates: [
        { id: 'rf1', name: 'Referral Request', subject: 'Request for referral - {jobTitle} at {company}', body: 'Hi {contactName},\n\nI hope you are doing well. I noticed that {company} is hiring for a {jobTitle} position, and I am very interested in applying.\n\nBased on my experience in {skill1} and {skill2}, I believe I would be a strong fit. Would you be comfortable referring me for this role?\n\nI have attached my resume for your reference.\n\nThank you so much for considering this!\n\nBest regards,\n{fullName}' },
        { id: 'rf2', name: 'Referral Thank You', subject: 'Thank you for the referral', body: 'Hi {contactName},\n\nThank you so much for referring me for the {jobTitle} position at {company}. I truly appreciate your support.\n\nI have submitted my application and will keep you updated on the process.\n\nThanks again for your kindness!\n\nBest regards,\n{fullName}' },
        { id: 'rf3', name: 'Referral Update (Got Interview)', subject: 'Update: Got an interview!', body: 'Hi {contactName},\n\nGreat news! Thanks to your referral, I have been invited to interview for the {jobTitle} position at {company}.\n\nI am very excited and will keep you updated on how it goes.\n\nThank you again for your support!\n\nBest regards,\n{fullName}' },
        { id: 'rf4', name: 'Referral Update (Got Offer)', subject: 'Update: Got the offer!', body: 'Hi {contactName},\n\nWonderful news! I received an offer for the {jobTitle} position at {company}!\n\nThank you so much for your referral. It made all the difference.\n\nI would love to treat you to coffee as a thank you!\n\nBest regards,\n{fullName}' }
      ]
    },
    negotiation: {
      label: 'Salary Negotiation',
      icon: '💰',
      templates: [
        { id: 'ng1', name: 'Salary Negotiation', subject: 'Regarding compensation for {jobTitle}', body: 'Dear {hiringManager},\n\nThank you for the offer for the {jobTitle} position. I am very excited about the opportunity to join {company}.\n\nAfter careful consideration, I would like to discuss the compensation package. Based on my experience in {skill1} and market research, I was expecting a salary in the range of {topic}.\n\nWould it be possible to revisit the offer?\n\nThank you for your understanding.\n\nBest regards,\n{fullName}' },
        { id: 'ng2', name: 'Counter Offer', subject: 'Counter offer for {jobTitle}', body: 'Dear {hiringManager},\n\nThank you for the offer. I am very interested in joining {company}, but I would like to propose a counter offer of {topic}.\n\nThis is based on my {relevantSkill} experience and current market rates.\n\nI hope we can reach an agreement.\n\nBest regards,\n{fullName}' },
        { id: 'ng3', name: 'Benefits Negotiation', subject: 'Discussion on benefits package', body: 'Dear {hiringManager},\n\nThank you for the offer details. I would like to discuss the benefits package, specifically regarding {topic}.\n\nI am very excited about the role and hope we can find a mutually beneficial arrangement.\n\nBest regards,\n{fullName}' }
      ]
    },
    rejection: {
      label: 'Rejection Responses',
      icon: '📝',
      templates: [
        { id: 'rj1', name: 'Graceful Rejection Response', subject: 'Re: {jobTitle} Application Update', body: 'Dear {hiringManager},\n\nThank you for letting me know about the decision regarding the {jobTitle} position. While I am disappointed, I appreciate the opportunity to interview with {company}.\n\nI would be grateful if you could keep me in mind for future opportunities that may be a better fit.\n\nI wish you and the team all the best.\n\nBest regards,\n{fullName}' },
        { id: 'rj2', name: 'Request for Feedback', subject: 'Request for feedback - {jobTitle}', body: 'Dear {hiringManager},\n\nThank you for considering my application for the {jobTitle} position. I appreciate the update.\n\nIf possible, I would be grateful for any feedback you could share about my application or interview. This would help me improve for future opportunities.\n\nThank you for your time.\n\nBest regards,\n{fullName}' },
        { id: 'rj3', name: 'Stay in Touch After Rejection', subject: 'Staying in touch', body: 'Dear {hiringManager},\n\nThank you for the update regarding the {jobTitle} position. While I am disappointed, I remain very interested in {company} and would love to be considered for future roles.\n\nI will continue to follow {company} work and would welcome the opportunity to stay in touch.\n\nBest regards,\n{fullName}' }
      ]
    },
    recruiter: {
      label: 'Recruiter Outreach',
      icon: '📞',
      templates: [
        { id: 'rc1', name: 'Recruiter Introduction', subject: 'Inquiry about opportunities at {company}', body: 'Dear {hiringManager},\n\nI hope this message finds you well. I came across your profile and wanted to introduce myself.\n\nI am a professional with experience in {skill1} and {skill2}, and I am very interested in opportunities at {company}.\n\nI have attached my resume for your review. I would love to connect and discuss how my background could be a good fit.\n\nThank you for your time.\n\nBest regards,\n{fullName}' },
        { id: 'rc2', name: 'Recruiter Follow-up', subject: 'Following up on our conversation', body: 'Dear {hiringManager},\n\nThank you for taking the time to speak with me about opportunities at {company}. I enjoyed our conversation.\n\nAs discussed, I am very interested in roles related to {field}. Please let me know if there are any positions that align with my background.\n\nBest regards,\n{fullName}' },
        { id: 'rc3', name: 'Recruiter Reconnection', subject: 'Reconnecting regarding opportunities', body: 'Dear {hiringManager},\n\nI hope you are doing well. We spoke previously about opportunities at {company}, and I wanted to reconnect.\n\nI have since gained additional experience in {skill1} and am even more excited about the possibility of joining your team.\n\nBest regards,\n{fullName}' }
      ]
    },
    update: {
      label: 'Application Status Updates',
      icon: '📊',
      templates: [
        { id: 'up1', name: 'Update: Got Interview', subject: 'Update: Interview scheduled!', body: 'Hi {contactName},\n\nI wanted to share some exciting news - I have been invited to interview for the {jobTitle} position at {company}!\n\nThank you for your support and guidance throughout this process.\n\nI will keep you updated on how it goes.\n\nBest regards,\n{fullName}' },
        { id: 'up2', name: 'Update: Got Offer', subject: 'Update: Offer received!', body: 'Hi {contactName},\n\nWonderful news - I received an offer for the {jobTitle} position at {company}!\n\nThank you so much for your help and support.\n\nI will share more details soon.\n\nBest regards,\n{fullName}' },
        { id: 'up3', name: 'Update: Accepted Offer', subject: 'Update: I accepted the offer!', body: 'Hi {contactName},\n\nI am thrilled to share that I have accepted the {jobTitle} position at {company}!\n\nThank you for being part of my journey. I could not have done it without your support.\n\nI start in a few weeks and am very excited.\n\nBest regards,\n{fullName}' }
      ]
    },
    recommendation: {
      label: 'Recommendation Requests',
      icon: '⭐',
      templates: [
        { id: 'rm1', name: 'LinkedIn Recommendation Request', subject: 'Request for LinkedIn recommendation', body: 'Hi {contactName},\n\nI hope you are doing well. I am updating my LinkedIn profile and would be honored if you could write a brief recommendation for me.\n\nIf you are comfortable, I would appreciate it if you could mention our work together on {topic}.\n\nThank you so much for your support!\n\nBest regards,\n{fullName}' },
        { id: 'rm2', name: 'Thank You for Recommendation', subject: 'Thank you for the recommendation', body: 'Hi {contactName},\n\nThank you so much for writing such a wonderful recommendation for me. Your kind words mean a lot.\n\nI truly appreciate your support and guidance.\n\nBest regards,\n{fullName}' }
      ]
    },
    resignation: {
      label: 'Resignation',
      icon: '📄',
      templates: [
        { id: 'rs1', name: 'Resignation Letter', subject: 'Resignation - {fullName}', body: 'Dear {hiringManager},\n\nPlease accept this letter as formal notification that I am resigning from my position as {jobTitle} at {company}.\n\nMy last day will be two weeks from today.\n\nI would like to thank you for the opportunity to work at {company}. I have learned a great deal and appreciate the support I have received.\n\nI will ensure a smooth transition during my remaining time.\n\nSincerely,\n{fullName}' },
        { id: 'rs2', name: 'Resignation (Immediate)', subject: 'Immediate Resignation - {fullName}', body: 'Dear {hiringManager},\n\nPlease accept this letter as formal notification that I am resigning from my position as {jobTitle} at {company}, effective immediately.\n\nI apologize for the short notice and any inconvenience this may cause.\n\nThank you for the opportunity.\n\nSincerely,\n{fullName}' }
      ]
    },
    internship: {
      label: 'Internship Requests',
      icon: '🎓',
      templates: [
        { id: 'in1', name: 'Internship Application', subject: 'Internship Application - {fullName}', body: 'Dear {hiringManager},\n\nI am writing to express my interest in internship opportunities at {company}. I am currently pursuing my degree in {field} and am eager to gain hands-on experience.\n\nMy coursework in {skill1} and {skill2} has prepared me well for this opportunity.\n\nI have attached my resume for your consideration.\n\nThank you for your time.\n\nBest regards,\n{fullName}' },
        { id: 'in2', name: 'Internship Follow-up', subject: 'Following up on internship application', body: 'Dear {hiringManager},\n\nI submitted my internship application for {company} last week and wanted to follow up.\n\nI remain very interested in this opportunity and would be honored to contribute to your team.\n\nPlease let me know if you need any additional information.\n\nBest regards,\n{fullName}' }
      ]
    },
    cold_email: {
      label: 'Cold Emails',
      icon: '📬',
      templates: [
        { id: 'ce1', name: 'Cold Email to Hiring Manager', subject: 'Inquiry about {jobTitle} opportunities', body: 'Dear {hiringManager},\n\nI hope this message finds you well. I am reaching out because I greatly admire {company} work in {industry}.\n\nI have experience in {skill1} and {skill2}, and I believe I could add value to your team.\n\nWould you be open to a brief conversation about potential opportunities?\n\nThank you for your time.\n\nBest regards,\n{fullName}' },
        { id: 'ce2', name: 'Cold Email (Direct Application)', subject: 'Application for {jobTitle} role', body: 'Dear {hiringManager},\n\nI am writing to apply for the {jobTitle} role at {company}, which I learned about through {topic}.\n\nWith my background in {skill1}, I am confident I can contribute to your team from day one.\n\nI have attached my resume for your review.\n\nI look forward to hearing from you.\n\nBest regards,\n{fullName}' },
        { id: 'ce3', name: 'Cold Email (Intro + Value)', subject: 'How I can help {company} team', body: 'Dear {hiringManager},\n\nI have been following {company} and am impressed by your work in {industry}.\n\nI noticed that your team is expanding. With my experience in {skill1}, I believe I could help with {topic}.\n\nWould you be open to a 10-minute chat?\n\nBest regards,\n{fullName}' }
      ]
    }
  },

  fill: function(templateId, userData) {
    let template = null;
    for (const cat of Object.values(this.categories)) {
      const found = cat.templates.find(t => t.id === templateId);
      if (found) { template = found; break; }
    }
    if (!template) return null;

    let subject = template.subject;
    let body = template.body;

    const placeholders = {
      '{hiringManager}': userData.hiringManager || 'Hiring Manager',
      '{jobTitle}': userData.jobTitle || 'position',
      '{company}': userData.company || 'your company',
      '{industry}': userData.industry || 'the industry',
      '{skill1}': userData.skill1 || 'my primary skill',
      '{skill2}': userData.skill2 || 'my secondary skill',
      '{fullName}': userData.fullName || '',
      '{email}': userData.email || '',
      '{phone}': userData.phone || '',
      '{date}': new Date().toLocaleDateString(),
      '{contactName}': userData.contactName || '',
      '{field}': userData.field || 'my field',
      '{topic}': userData.topic || 'the industry',
      '{event}': userData.event || 'the event',
      '{specificTopic}': userData.specificTopic || 'the projects we discussed',
      '{relevantSkill}': userData.relevantSkill || 'my relevant experience'
    };

    for (const [key, value] of Object.entries(placeholders)) {
      subject = subject.split(key).join(value);
      body = body.split(key).join(value);
    }

    return { subject, body };
  },

  showPicker: function() {
    const existing = document.getElementById('email-template-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'email-template-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10000;display:flex;align-items:center;justify-content:center;';
    modal.onclick = function(e) { if (e.target === modal) modal.remove(); };

    let html = '<div style="background:white;border-radius:16px;padding:24px;max-width:650px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);">';
    html += '<h2 style="font-size:1.4rem;font-weight:700;margin-bottom:16px;">📧 Email Templates (' + this.getTotalCount() + ')</h2>';

    for (const [catId, cat] of Object.entries(this.categories)) {
      html += '<h3 style="font-size:0.9rem;font-weight:700;color:#6366f1;margin:16px 0 8px;">' + cat.icon + ' ' + cat.label + ' (' + cat.templates.length + ')</h3>';
      cat.templates.forEach(function(t) {
        html += '<button onclick="EmailTemplates.useTemplate(\'' + t.id + '\')" style="display:block;width:100%;padding:10px;margin-bottom:6px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;cursor:pointer;text-align:left;font-size:0.85rem;">';
        html += '<div style="font-weight:600;">' + t.name + '</div>';
        html += '<div style="font-size:0.75rem;color:#6b7280;">' + t.subject + '</div>';
        html += '</button>';
      });
    }

    html += '</div>';
    modal.innerHTML = html;
    document.body.appendChild(modal);
  },

  getTotalCount: function() {
    let total = 0;
    for (const cat of Object.values(this.categories)) {
      total += cat.templates.length;
    }
    return total;
  },

  useTemplate: function(templateId) {
    const userData = {
      fullName: (window.App && App.resumeData && App.resumeData.personal) ? App.resumeData.personal.fullName : '',
      email: (window.App && App.resumeData && App.resumeData.personal) ? App.resumeData.personal.email : '',
      phone: (window.App && App.resumeData && App.resumeData.personal) ? App.resumeData.personal.phone : ''
    };

    const filled = this.fill(templateId, userData);
    if (!filled) { showError('Template not found'); return; }

    const modal = document.getElementById('email-template-modal');
    if (modal) modal.remove();

    this.showFilled(filled);
  },

  showFilled: function(filled) {
    const modal = document.createElement('div');
    modal.id = 'email-filled-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:10001;display:flex;align-items:center;justify-content:center;';
    modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:650px;width:90%;max-height:85vh;overflow-y:auto;">' +
      '<h3 style="font-weight:700;margin-bottom:12px;">Email Preview</h3>' +
      '<div style="margin-bottom:8px;"><strong>Subject:</strong></div>' +
      '<input id="email-subject" value="' + filled.subject + '" style="width:100%;padding:8px;border:1px solid #e5e7eb;border-radius:6px;margin-bottom:12px;">' +
      '<div style="margin-bottom:8px;"><strong>Body:</strong></div>' +
      '<textarea id="email-body" style="width:100%;height:250px;padding:12px;border:1px solid #e5e7eb;border-radius:6px;font-family:Georgia,serif;line-height:1.5;">' + filled.body + '</textarea>' +
      '<div style="display:flex;gap:8px;margin-top:12px;">' +
      '<button onclick="EmailTemplates.copyEmail()" style="flex:1;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">📋 Copy</button>' +
      '<button onclick="document.getElementById(\'email-filled-modal\').remove()" style="padding:10px 20px;background:#f3f4f6;border:none;border-radius:8px;cursor:pointer;">Close</button>' +
      '</div></div>';
    document.body.appendChild(modal);
  },

  copyEmail: function() {
    const subject = document.getElementById('email-subject').value;
    const body = document.getElementById('email-body').value;
    const fullText = 'Subject: ' + subject + '\n\n' + body;
    navigator.clipboard.writeText(fullText).then(function() {
      showSuccess('Email copied to clipboard!');
    });
  }
};

window.EmailTemplates = EmailTemplates;