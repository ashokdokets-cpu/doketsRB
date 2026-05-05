// LinkedIn to ResumeAI Pro - Popup Script
console.log('✅ LinkedIn to ResumeAI Pro popup loaded');

let extractedProfile = null;
const importBtn = document.getElementById('import-btn');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');
const reviewSection = document.getElementById('review-section');
const statusDiv = document.getElementById('status');
const linkedinBadge = document.getElementById('linkedin-badge');
const notLinkedinBadge = document.getElementById('not-linkedin-badge');

// Check if we're on a LinkedIn profile page
async function checkPage() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (tab.url && tab.url.includes('linkedin.com/in/')) {
            linkedinBadge.classList.remove('hidden');
            notLinkedinBadge.classList.add('hidden');
            importBtn.classList.remove('hidden');
            return true;
        } else {
            linkedinBadge.classList.add('hidden');
            notLinkedinBadge.classList.remove('hidden');
            importBtn.classList.add('hidden');
            statusDiv.textContent = '⚠️ Please navigate to a LinkedIn profile first';
            statusDiv.className = 'error';
            return false;
        }
    } catch (error) {
        statusDiv.textContent = '❌ Error checking page';
        statusDiv.className = 'error';
        return false;
    }
}

// Show status message
function showMessage(msg, type) {
    statusDiv.textContent = msg;
    statusDiv.className = type || '';
}

// Step 1: Extract data from LinkedIn
importBtn.addEventListener('click', async () => {
    importBtn.textContent = '⏳ Extracting...';
    importBtn.disabled = true;
    showMessage('Scanning LinkedIn profile...');

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrapeProfile' });
        
        if (response && response.success && response.data) {
            extractedProfile = response.data;
            
            // Show review section with stats
            document.getElementById('exp-count').textContent = extractedProfile.experience?.length || 0;
            document.getElementById('edu-count').textContent = extractedProfile.education?.length || 0;
            document.getElementById('skill-count').textContent = extractedProfile.skills?.length || 0;
            document.getElementById('cert-count').textContent = extractedProfile.certifications?.length || 0;
            
            importBtn.classList.add('hidden');
            reviewSection.classList.remove('hidden');
            showMessage(`✅ Found: ${extractedProfile.personal?.fullName || 'Profile'}`, 'success');
            
            console.log('📤 Extracted data ready:', extractedProfile);
        } else {
            showMessage('❌ Could not extract profile. Try refreshing the LinkedIn page.', 'error');
            importBtn.textContent = '📥 Import to ResumeAI Pro';
            importBtn.disabled = false;
        }
    } catch (error) {
        console.error('Extraction error:', error);
        showMessage('❌ Error. Make sure you are on a LinkedIn profile page.', 'error');
        importBtn.textContent = '📥 Import to ResumeAI Pro';
        importBtn.disabled = false;
    }
});

// Step 2: Confirm and send to ResumeAI Pro via URL params
confirmBtn.addEventListener('click', () => {
    if (!extractedProfile) {
        showMessage('❌ No profile data to import', 'error');
        return;
    }

    confirmBtn.textContent = '⏳ Opening ResumeAI Pro...';
    confirmBtn.disabled = true;
    showMessage('Sending profile data...');

    // Store in Chrome storage AND send via URL params
    chrome.storage.local.set({
        linkedinResumeData: extractedProfile,
        importTimestamp: Date.now()
    }, () => {
        // Encode the complete data for URL
        const jsonStr = JSON.stringify(extractedProfile);
        const encoded = encodeURIComponent(jsonStr);
        
        const url = `https://doketsrb.com/?linkedin_data=${encoded}#builder`;
        console.log('🔗 Opening URL with data:', url.substring(0, 100) + '...');
        
        // Open ResumeAI Pro with data in URL params
        chrome.tabs.create({ url: url, active: true });
        window.close();
    });
});

// Cancel and go back
cancelBtn.addEventListener('click', () => {
    extractedProfile = null;
    reviewSection.classList.add('hidden');
    importBtn.classList.remove('hidden');
    importBtn.textContent = '📥 Import to ResumeAI Pro';
    importBtn.disabled = false;
    showMessage('');
});

// Initialize
checkPage();