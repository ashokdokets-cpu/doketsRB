// LinkedIn to ResumeAI Pro - Content Script v3
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
    };

    try {
        // Get ALL text from the page
        const bodyText = document.body.innerText;
        const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        // Find the profile card section (everything between the name and the first "Experience"/"Education"/"About")
        const nameKeywords = ['followers', 'connections', 'Contact info'];
        const sectionHeaders = ['Experience', 'Education', 'Skills', 'About', 'Licenses', 'Certifications'];
        
        let profileStart = -1;
        let profileEnd = lines.length;
        
        // Find where the profile info starts (first non-navigation line)
        const skipWords = ['Home', 'My Network', 'Jobs', 'Messaging', 'Notifications', 'Me', 'For Business', 
                          'Premium', 'Skip to', 'notifications', 'Advertise', 'Business Services'];
        
        for (let i = 0; i < lines.length; i++) {
            if (!skipWords.some(w => lines[i].startsWith(w)) && 
                lines[i].length > 2 && 
                lines[i].length < 60 &&
                !lines[i].includes('notifications')) {
                profileStart = i;
                break;
            }
        }
        
        // Find where the profile section ends (first section header after profile info)
        for (let i = profileStart; i < lines.length; i++) {
            if (sectionHeaders.includes(lines[i]) && i > profileStart + 2) {
                profileEnd = i;
                break;
            }
        }
        
        console.log('Profile section:', profileStart, 'to', profileEnd);
        
        // Extract profile info from this section
        const profileLines = lines.slice(profileStart, profileEnd);
        console.log('Profile lines:', profileLines);
        
        if (profileLines.length > 0) {
            // Name is usually the first line
            profile.personal.fullName = profileLines[0];
            
            // Headline is usually the second or third line
            if (profileLines.length > 1 && profileLines[1].length < 100) {
                profile.summary = profileLines[1];
            }
            
            // Find location (contains commas, countries, or "Area")
            for (let i = 1; i < profileLines.length; i++) {
                if (profileLines[i].includes('India') || 
                    profileLines[i].includes('United') || 
                    profileLines[i].includes('Area') ||
                    profileLines[i].includes('·')) {
                    profile.personal.location = profileLines[i].replace('·', '').trim();
                    break;
                }
            }
            
            // Find contact info
            for (let i = 0; i < profileLines.length; i++) {
                if (profileLines[i].includes('Contact info')) {
                    // The company/school info is usually 1-2 lines before Contact info
                    if (i > 0 && profileLines[i-1].length > 2) {
                        // This could be company or school
                        const infoLine = profileLines[i-1];
                        if (!profile.experience.length) {
                            profile.experience.push({ title: '', company: infoLine, dates: '', bullets: '' });
                        }
                    }
                    break;
                }
            }
        }
        
        // === FIND SECTIONS BY SCANNING TEXT ===
        const sections = {};
        let currentSection = '';
        
        for (let i = 0; i < lines.length; i++) {
            if (['Experience', 'Education', 'Skills', 'About'].includes(lines[i])) {
                currentSection = lines[i];
                sections[currentSection] = [];
            } else if (currentSection && lines[i].length > 0) {
                if (['Experience', 'Education', 'Skills', 'About'].includes(lines[i])) {
                    // New section started
                } else {
                    sections[currentSection].push(lines[i]);
                }
            }
        }
        
        console.log('Found sections:', Object.keys(sections));
        
        // Extract Experience items
        if (sections['Experience']) {
            let expText = sections['Experience'].join('\n');
            // Split by company names or date patterns
            const expBlocks = expText.split(/(?=\d{4}|present|yr|year|mo)/i);
            expBlocks.forEach(block => {
                const blockLines = block.trim().split('\n').filter(l => l.length > 0);
                if (blockLines.length >= 2) {
                    profile.experience.push({
                        title: blockLines[0] || '',
                        company: blockLines[1] || '',
                        dates: blockLines.find(l => /\d{4}|present/i.test(l)) || '',
                        bullets: blockLines.slice(2).join('. ')
                    });
                }
            });
        }
        
        // Extract Education items
        if (sections['Education']) {
            let eduText = sections['Education'].join('\n');
            const eduBlocks = eduText.split(/(?=\d{4}|University|College|School|Institute)/i);
            eduBlocks.forEach(block => {
                const blockLines = block.trim().split('\n').filter(l => l.length > 0);
                if (blockLines.length >= 2) {
                    profile.education.push({
                        degree: blockLines[0] || '',
                        school: blockLines[1] || '',
                        year: blockLines.find(l => /\d{4}/.test(l)) || ''
                    });
                }
            });
        }
        
        // Extract Skills
        if (sections['Skills']) {
            sections['Skills'].forEach(line => {
                if (line.length > 2 && line.length < 50 && 
                    !line.includes('endorsement') && !line.includes('Skill')) {
                    profile.skills.push(line);
                }
            });
        }
        
        console.log('📊 FINAL RESULT:', 
            '\n  Name:', profile.personal.fullName,
            '\n  Location:', profile.personal.location,
            '\n  Headline:', profile.summary?.substring(0, 50),
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