// LinkedIn to ResumeAI Pro - Content Script
console.log('✅ LinkedIn to ResumeAI Pro - Content Script loaded');

// Main extraction function
function extractLinkedInProfile() {
    const profile = {
        personal: {
            fullName: '',
            email: '',
            phone: '',
            location: '',
            linkedin: window.location.href,
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        certifications: [],
    };

    try {
        // Extract name
        const nameEl = document.querySelector('h1.text-heading-xlarge') ||
                       document.querySelector('h1') ||
                       document.querySelector('.pv-top-card__list li');
        if (nameEl) profile.personal.fullName = nameEl.textContent.trim();

        // Extract headline/summary
        const headlineEl = document.querySelector('.text-body-medium.break-words') ||
                          document.querySelector('[data-section="headline"]') ||
                          document.querySelector('.pv-top-card__headline');
        if (headlineEl) profile.summary = headlineEl.textContent.trim();

        // Extract location
        const locationEl = document.querySelector('.text-body-small.inline.t-black--light') ||
                          document.querySelector('.pv-top-card__list-bullet');
        if (locationEl) profile.personal.location = locationEl.textContent.trim();

        // Extract experience
        const expSections = document.querySelectorAll('#experience ~ div ul li, .experience-item');
        expSections.forEach(exp => {
            const title = exp.querySelector('h3, .mr1, .t-bold, .pv-entity__summary-info h3')?.textContent?.trim() || '';
            const company = exp.querySelector('.t-14, .t-normal, .pv-entity__secondary-title')?.textContent?.trim() || '';
            const dates = exp.querySelector('.t-14.t-normal, .pv-entity__date-range span')?.textContent?.trim() || '';
            const desc = exp.querySelector('.pv-entity__description, .inline-show-more-text')?.textContent?.trim() || '';
            if (title) {
                profile.experience.push({ title, company, dates, bullets: desc });
            }
        });

        // Extract education
        const eduSections = document.querySelectorAll('#education ~ div ul li, .education-item');
        eduSections.forEach(edu => {
            const degree = edu.querySelector('h3, .mr1, .t-bold')?.textContent?.trim() || '';
            const school = edu.querySelector('.t-14, .t-normal, .pv-entity__secondary-title')?.textContent?.trim() || '';
            const year = edu.querySelector('.t-14.t-normal, .pv-entity__date-range span')?.textContent?.trim() || '';
            if (degree) {
                profile.education.push({ degree, school, year });
            }
        });

        // Extract skills
        const skillEls = document.querySelectorAll('.skill-category-entity__name-text, .pv-skill-category-entity__name-text, .pills__pill-text');
        skillEls.forEach(skill => {
            const skillName = skill.textContent.trim();
            if (skillName && !profile.skills.includes(skillName)) {
                profile.skills.push(skillName);
            }
        });

        console.log('📋 Extracted Profile:', 
            'Name:', profile.personal.fullName,
            '| Experience:', profile.experience.length, 'entries',
            '| Education:', profile.education.length, 'entries',
            '| Skills:', profile.skills.length, 'skills'
        );

    } catch (error) {
        console.error('❌ Extraction error:', error);
    }

    return profile;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scrapeProfile' || request.action === 'extract') {
        try {
            const profile = extractLinkedInProfile();
            sendResponse({ success: true, data: profile });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }
    return true;
});