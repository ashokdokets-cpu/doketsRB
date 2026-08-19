// LinkedIn to ResumeAI Pro - Content Script v4 (with auto-scroll)
console.log('✅ LinkedIn to ResumeAI Pro - Content Script loaded');

async function extractLinkedInProfile() {
    const profile = {
        personal: { fullName: '', email: '', phone: '', location: '', linkedin: window.location.href },
        summary: '',
        experience: [],
        education: [],
        skills: [],
    };

    try {
        // === SCROLL TO LOAD ALL SECTIONS ===
        console.log('📜 Scrolling to load all sections...');
        const scrollDelay = 800;
        
        // Scroll to bottom slowly to trigger lazy loading
        for (let i = 0; i < 5; i++) {
            window.scrollBy(0, window.innerHeight);
            await new Promise(r => setTimeout(r, scrollDelay));
        }
        
        // Scroll back to top
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 500));
        
        console.log('✅ Scroll complete, extracting data...');

        // === GET ALL TEXT ===
        const bodyText = document.body.innerText;
        const lines = bodyText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        console.log('Total lines:', lines.length);
        
        // === FIND PROFILE NAME (starts at line 13 based on your data) ===
        let profileStart = 0;
        for (let i = 0; i < lines.length; i++) {
            // Skip navigation items
            const navItems = ['Home', 'My Network', 'Jobs', 'Messaging', 'Notifications', 'Me', 'For Business', 'Try Premium'];
            if (lines[i] === 'Bhavya M' || (!navItems.includes(lines[i]) && lines[i].length > 3 && i > 10)) {
                profileStart = i;
                break;
            }
        }
        
        profile.personal.fullName = lines[profileStart] || '';
        console.log('Name:', profile.personal.fullName, '(line', profileStart + ')');
        
        // === HEADLINE ===
        if (profileStart + 1 < lines.length) {
            profile.summary = lines[profileStart + 1];
        }
        
        // === LOCATION ===
        for (let i = profileStart; i < Math.min(profileStart + 15, lines.length); i++) {
            if (lines[i].includes('India') || lines[i].includes('Area') || lines[i].includes('United')) {
                profile.personal.location = lines[i].replace('·', '').trim();
                break;
            }
        }
        
        // === FIND SECTIONS ===
        const sectionLines = {};
        const sectionNames = ['About', 'Experience', 'Education', 'Skills', 'Licenses', 'Certifications'];
        
        lines.forEach((line, i) => {
            if (sectionNames.includes(line) && i > profileStart) {
                sectionLines[line] = i;
            }
        });
        
        console.log('Section positions:', sectionLines);
        
        // === EXTRACT EXPERIENCE ===
        if (sectionLines['Experience']) {
            const startIdx = sectionLines['Experience'] + 1;
            const endIdx = sectionLines['Education'] || sectionLines['Skills'] || lines.length;
            const expLines = lines.slice(startIdx, endIdx);
            
            console.log('Experience lines:', expLines.length);
            
            // Group by entries (each entry typically has company name followed by title)
            let currentExp = { title: '', company: '', dates: '', bullets: '' };
            for (let i = 0; i < expLines.length; i++) {
                const line = expLines[i];
                if (line.length > 100) continue; // skip long descriptions
                
                if (/^\d{4}|present|yr|year|mo/i.test(line) || line.includes('·')) {
                    // Date line
                    currentExp.dates = line;
                } else if (line === expLines[i-1] && i > 0) {
                    // Skip duplicates
                    continue;
                } else if (!currentExp.company) {
                    currentExp.company = line;
                } else if (!currentExp.title) {
                    currentExp.title = line;
                }
                
                // Check if this is the start of a new entry
                if (i > 0 && (expLines[i-1].includes('·') || /^\d{4}/.test(expLines[i-1])) && line.length < 30) {
                    if (currentExp.company || currentExp.title) {
                        profile.experience.push({ ...currentExp });
                    }
                    currentExp = { title: line, company: '', dates: '', bullets: '' };
                }
            }
            if (currentExp.company || currentExp.title) {
                profile.experience.push(currentExp);
            }
        }
        
        // === EXTRACT EDUCATION ===
        if (sectionLines['Education']) {
            const startIdx = sectionLines['Education'] + 1;
            const endIdx = sectionLines['Skills'] || sectionLines['Licenses'] || lines.length;
            const eduLines = lines.slice(startIdx, endIdx);
            
            console.log('Education lines:', eduLines.length);
            
            let currentEdu = { degree: '', school: '', year: '' };
            for (let i = 0; i < eduLines.length; i++) {
                const line = eduLines[i];
                if (line.length < 3) continue;
                
                if (!currentEdu.school) {
                    currentEdu.school = line;
                } else if (!currentEdu.degree) {
                    currentEdu.degree = line;
                } else if (/\d{4}/.test(line)) {
                    currentEdu.year = line;
                    profile.education.push({ ...currentEdu });
                    currentEdu = { degree: '', school: '', year: '' };
                }
            }
            if (currentEdu.school || currentEdu.degree) {
                profile.education.push(currentEdu);
            }
        }
        
        // === EXTRACT SKILLS ===
        if (sectionLines['Skills']) {
            const startIdx = sectionLines['Skills'] + 1;
            const endIdx = sectionLines['Licenses'] || sectionLines['Certifications'] || lines.length;
            const skillLines = lines.slice(startIdx, endIdx);
            
            skillLines.forEach(line => {
                if (line.length > 2 && line.length < 40 && !line.includes('endorse')) {
                    profile.skills.push(line);
                }
            });
        }
        
        console.log('📊 FINAL:', 
            '\n  Name:', profile.personal.fullName,
            '\n  Location:', profile.personal.location,
            '\n  Headline:', profile.summary,
            '\n  Experience:', profile.experience.length,
            '\n  Education:', profile.education.length,
            '\n  Skills:', profile.skills.length
        );
        
        console.log('Experience details:', profile.experience);
        console.log('Education details:', profile.education);
        console.log('Skills:', profile.skills);

    } catch (error) {
        console.error('❌ Extraction error:', error);
    }

    return profile;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scrapeProfile' || request.action === 'extract') {
        extractLinkedInProfile().then(profile => {
            sendResponse({ success: true, data: profile });
        });
        return true; // Keep channel open for async
    }
});

// ============================================
// SAVE TO DOKETS - Job Board Integration
// ============================================
function injectSaveToDoketsButton() {
    const currentUrl = window.location.href;
    const isJobBoard = currentUrl.includes('linkedin.com/jobs') || currentUrl.includes('indeed.com') || currentUrl.includes('glassdoor.com') || currentUrl.includes('naukri.com') || currentUrl.includes('monster.com');
    if (!isJobBoard) return;
    if (document.getElementById('dokets-save-btn')) return;
    const button = document.createElement('button');
    button.id = 'dokets-save-btn';
    button.innerHTML = '💾 Save to Dokets';
    button.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;padding:12px 20px;background:#6366f1;color:white;border:none;border-radius:25px;cursor:pointer;font-weight:700;font-size:14px;font-family:Arial,sans-serif;box-shadow:0 4px 16px rgba(99,102,241,0.4);';
    button.onmouseover = function() { button.style.background = '#4f46e5'; };
    button.onmouseout = function() { button.style.background = '#6366f1'; };
    button.onclick = function() {
        const jobData = extractJobData();
        chrome.runtime.sendMessage({ action: 'saveJobToDokets', jobData: jobData }, function(response) {
            if (response && response.success) { button.innerHTML = '✅ Saved!'; setTimeout(function(){ button.innerHTML = '💾 Save to Dokets'; }, 2000); }
        });
    };
    document.body.appendChild(button);
}
function extractJobData() {
    const url = window.location.href;
    let jobData = { title: '', company: '', location: '', salary: '', url: url, description: '', skills: [], source: '' };
    if (url.includes('linkedin.com/jobs')) {
        jobData.title = document.querySelector('.job-title, h1')?.textContent?.trim() || '';
        jobData.company = document.querySelector('.company-name')?.textContent?.trim() || '';
        jobData.description = document.querySelector('[class*="description"]')?.textContent?.trim() || '';
        jobData.source = 'LinkedIn';
    }
    if (jobData.description) {
        const skillKeywords = ['JavaScript','Python','Java','React','SQL','AWS','Node.js','TypeScript','Marketing','Sales','Management','Analysis','Design','Communication','Leadership','Agile','Excel','Tableau','Docker','Kubernetes','Git'];
        jobData.skills = skillKeywords.filter(function(skill){ return jobData.description.toLowerCase().includes(skill.toLowerCase()); });
    }
    return jobData;
}
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', injectSaveToDoketsButton); }
else { injectSaveToDoketsButton(); }
console.log('✅ Save to Dokets button ready!');
