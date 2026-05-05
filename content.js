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
                       document.querySelector('.pv-top-card--list li');
        if (nameEl) profile.personal.fullName = nameEl.textContent.trim();

        // Extract headline/summary
        const headlineEl = document.querySelector('.text-body-medium.break-words') ||
                          document.querySelector('[data-section="headline"]') ||
                          document.querySelector('.pv-top-card__headline');
        if (headlineEl) profile.summary = headlineEl.textContent.trim();

        // Extract location
        const locationEl = document.querySelector('.text-body-small.inline.t-black--light') ||
                          document.querySelector('.pv-top-card--list-bullet') ||
                          document.querySelector('.pv-top-card__location');
        if (locationEl) profile.personal.location = locationEl.textContent.trim();

        // Extract About section as summary if no headline
        const aboutSection = document.querySelector('#about')?.closest('section');
        if (aboutSection) {
            const aboutText = aboutSection.querySelector('.display-flex .visually-hidden') ||
                             aboutSection.querySelector('.pv-shared-text-with-see-more span');
            if (aboutText && aboutText.textContent.trim().length > 20) {
                profile.summary = aboutText.textContent.trim();
            }
        }

        // Extract experience
        const expSection = document.querySelector('#experience');
        if (expSection) {
            const expItems = expSection.closest('section')?.querySelectorAll('li.artdeco-list__item, .pv-entity__position-group-pager');
            if (expItems && expItems.length > 0) {
                expItems.forEach(exp => {
                    const title = exp.querySelector('h3, .t-bold, .pv-entity__summary-info h3, .mr1')?.textContent?.trim() || '';
                    const company = exp.querySelector('.t-14.t-normal, .pv-entity__secondary-title, .t-normal')?.textContent?.trim() || '';
                    const dates = exp.querySelector('.t-14.t-black--light, .pv-entity__date-range span')?.textContent?.trim() || '';
                    const desc = exp.querySelector('.pv-entity__description, .inline-show-more-text, .pv-entity__extra-details')?.textContent?.trim() || '';
                    
                    if (title) {
                        profile.experience.push({ 
                            title: title.replace(company, '').trim().replace(/\s+/g, ' '),
                            company: company.replace(title, '').replace(dates, '').trim(),
                            dates: dates,
                            bullets: desc
                        });
                    }
                });
            }
        }

        // Extract education
        const eduSection = document.querySelector('#education');
        if (eduSection) {
            const eduItems = eduSection.closest('section')?.querySelectorAll('li.artdeco-list__item, .pv-entity__education');
            if (eduItems && eduItems.length > 0) {
                eduItems.forEach(edu => {
                    const degree = edu.querySelector('h3, .pv-entity__degree-name span, .t-bold')?.textContent?.trim() || '';
                    const school = edu.querySelector('.t-14.t-normal, .pv-entity__school-name, .pv-entity__secondary-title')?.textContent?.trim() || '';
                    const year = edu.querySelector('.t-14.t-black--light, .pv-entity__dates span')?.textContent?.trim() || '';
                    
                    if (degree || school) {
                        profile.education.push({ degree, school, year });
                    }
                });
            }
        }

        // Extract skills
        const skillSection = document.querySelector('#skills');
        if (skillSection) {
            const skillItems = skillSection.closest('section')?.querySelectorAll('.skill-category-entity__name-text, .pv-skill-category-entity__name-text, .pills__pill-text, .pv-skill-entity__skill-name');
            if (skillItems && skillItems.length > 0) {
                skillItems.forEach(skill => {
                    const skillName = skill.textContent.trim();
                    if (skillName && !profile.skills.includes(skillName)) {
                        profile.skills.push(skillName);
                    }
                });
            }
        }

        console.log('📊 Extracted Profile:', 
            '\n  Name:', profile.personal.fullName,
            '\n  Location:', profile.personal.location,
            '\n  Summary:', profile.summary?.substring(0, 50) + '...',
            '\n  Experience:', profile.experience.length, 'entries',
            '\n  Education:', profile.education.length, 'entries',
            '\n  Skills:', profile.skills.length, 'skills'
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