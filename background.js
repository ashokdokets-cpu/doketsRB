// LinkedIn to ResumeAI Pro - Background Service Worker
console.log('✅ LinkedIn to ResumeAI Pro background service worker started');

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('🎉 Extension installed - v2.0.1');
    } else if (details.reason === 'update') {
        console.log('🔄 Extension updated to v2.0.1');
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    if (tab.url && tab.url.includes('linkedin.com/in/')) {
        console.log('📋 LinkedIn profile detected:', tab.url);
    }
});

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openResumeAI') {
        chrome.tabs.create({
            url: 'https://doketsrb.com/#builder',
            active: true
        });
        sendResponse({ success: true });
    }
    return true;
});