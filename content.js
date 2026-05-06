// LinkedIn to ResumeAI Pro - Content Script (Updated for LinkedIn 2026)
console.log('✅ LinkedIn to ResumeAI Pro - Content Script loaded');

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
        // === NAME ===
        // LinkedIn now puts name in h1 or in the top card
        const nameSelectors = [
            'h1',
            '.pv-top-card--list li:first-child',
            '[class*="top-card"] h1',
            '.text-heading-xlarge'
        ];
        for (const sel of nameSelectors) {
            const el = document.querySelector(sel);
            if (el && el.textContent.trim()) {
                profile.personal.fullName = el.textContent.trim();
                break;
            }
        }
        // Fallback: find name from body text
        if (!profile.personal.fullName) {
            const bodyText = document.body.innerText;
            const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            // Usually the first meaningful text line after "Skip to main content"
            for (let i = 0; i < Math.min(lines.length, 20); i++) {
                if (lines[i].length > 2 && 
                    !lines[i].includes('notifications') && 
                    !lines[i].includes('Skip to') &&
                    !lines[i].includes('Home') &&
                    !lines[i].includes('My Network') &&
                    !lines[i].includes('Jobs') &&
                    !lines[i].includes('Messaging') &&
                    !lines[i].includes('Notifications') &&
                    !lines[i].includes('Premium') &&
                    !lines[i].includes('Me') &&
                    lines[i].length < 60) {
                    profile.personal.fullName = lines[i];
                    break;
                }
            }
        }

        // === HEADLINE / SUMMARY ===
        const headlineEl = document.querySelector('[class*="top-card"] [class*="headline"], .pv-top-card__headline');
        if (headlineEl) {
            profile.summary = headlineEl.textContent.trim();
        } else {
            // Find headline from body text after name
            const bodyText = document.body.innerText;
            const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const nameIndex = lines.findIndex(l => l === profile.personal.fullName);
            if (nameIndex >= 0 && nameIndex + 1 < lines.length) {
                profile.summary = lines[nameIndex + 1];
            }
        }

        // === LOCATION ===
        const locationEl = document.querySelector('[class*="top-card"] [class*="location"], .pv-top-card__location');
        if (locationEl) {
            profile.personal.location = locationEl.textContent.trim().replace('·', '').trim();
        } else {
            // Find location from body text
            const bodyText = document.body.innerText;
            const lines = bodyText.split('\n').map(l => l.trim());
            const contactIndex = lines.findIndex(l => l.includes('Contact info'));
            if (contactIndex >= 0) {
                const prevLines = lines.slice(Math.max(0, contactIndex - 5), contactIndex);
                for (const line of prevLines.reverse()) {
                    if (line.includes('India') || line.includes('United') || line.includes('Area')) {
                        profile.personal.location = line.replace('·', '').trim();
                        break;
                    }
                }
            }
        }

        // === ABOUT SECTION (for summary) ===
        const aboutSection = document.querySelector('#about, [id*="about"], section:has([id*="about"])');
        if (aboutSection) {
            const aboutText = aboutSection.querySelector('span, p, div')?.textContent?.trim();
            if (aboutText && aboutText.length > 30) {
                profile.summary = aboutText;
            }
        }

        // === EXPERIENCE ===
        // Find all section headers and look for "Experience"
        const allSections = document.querySelectorAll('section');
        allSections.forEach(section => {
            const sectionText = section.textContent.trim();
            if (sectionText.startsWith('Experience') || sectionText.includes('Experience\n')) {
                // Found experience section - extract list items
                const items = section.querySelectorAll('li, [class*="position"], [class*="experience-item"]');
                items.forEach(item => {
                    const text = item.textContent.trim();
                    if (text && text.length > 10 && !text.startsWith('Experience')) {
                        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                        const title = lines[0] || '';
                        const company = lines[1] || '';
                        const dates = lines.find(l => l.includes('yr') || l.includes('year') || l.includes('mo') || l.includes('present') || /\d{4}/.test(l)) || '';
                        const desc = lines.filter(l => l.length > 30 && l !== title && l !== company && l !== dates).join('. ');
                        
                        if (title && title.length < 100) {
                            profile.experience.push({
                                title: title,
                                company: company,
                                dates: dates,
                                bullets: desc
                            });
                        }
                    }
                });
            }
        });

        // === EDUCATION ===
        allSections.forEach(section => {
            const sectionText = section.textContent.trim();
            if (sectionText.startsWith('Education') || sectionText.includes('Education\n')) {
                const items = section.querySelectorAll('li, [class*="education-item"]');
                items.forEach(item => {
                    const text = item.textContent.trim();
                    if (text && text.length > 5 && !text.startsWith('Education')) {
                        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                        const degree = lines[0] || '';
                        const school = lines[1] || '';
                        const year = lines.find(l => /\d{4}/.test(l)) || '';
                        
                        if (degree || school) {
                            profile.education.push({
                                degree: degree,
                                school: school,
                                year: year
                            });
                        }
                    }
                });
            }
        });

        // === SKILLS ===
        allSections.forEach(section => {
            const sectionText = section.textContent.trim();
            if (sectionText.startsWith('Skills') || sectionText.includes('Skills\n')) {
                const items = section.querySelectorAll('li, span, [class*="skill"], [class*="pill"]');
                items.forEach(item => {
                    const text = item.textContent.trim();
                    if (text && text.length > 1 && text.length < 50 && 
                        !text.startsWith('Skills') && !text.includes('endorsement')) {
                        if (!profile.skills.includes(text)) {
                            profile.skills.push(text);
                        }
                    }
                });
            }
        });

        console.log('📊 Extracted Profile:', 
            '\n  Name:', profile.personal.fullName,
            '\n  Location:', profile.personal.location,
            '\n  Summary:', profile.summary?.substring(0, 60) + '...',
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