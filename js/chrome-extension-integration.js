// Chrome Extension Integration - Job Tracker Connection
// Connects Chrome extension "Save Job" functionality to Dokets Job Tracker
// Works with: LinkedIn, Indeed, Glassdoor, Naukri, Monster

const ChromeExtensionIntegration = {
  // Check if Chrome extension is installed
  isExtensionInstalled: function() {
    return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id;
  },

  // Listen for messages from Chrome extension
  init: function() {
    if (!this.isExtensionInstalled()) {
      console.log('Chrome extension not detected');
      return;
    }

    // Listen for job data from extension
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'saveJob') {
        this.saveJobFromExtension(request.jobData, sendResponse);
        return true;
      }
      if (request.action === 'importProfile') {
        this.importProfileFromExtension(request.profileData, sendResponse);
        return true;
      }
    });
  },

  // Save job from extension to Job Tracker
  saveJobFromExtension: function(jobData, sendResponse) {
    const job = {
      title: jobData.title || 'Untitled Position',
      company: jobData.company || '',
      location: jobData.location || '',
      salary: jobData.salary || '',
      url: jobData.url || window.location.href,
      source: jobData.source || 'Chrome Extension',
      description: jobData.description || '',
      skills: jobData.skills || [],
      status: 'Saved',
      dateAdded: new Date().toISOString()
    };

    // Save to job tracker
    if (typeof addJobApplication === 'function') {
      addJobApplication(job);
    } else {
      // Fallback to localStorage
      const saved = JSON.parse(localStorage.getItem('dokets_jobs') || '[]');
      saved.push(job);
      localStorage.setItem('dokets_jobs', JSON.stringify(saved));
    }

    // Sync to Charvak
    if (typeof syncApplicationToCharvakit === 'function') {
      syncApplicationToCharvakit({
        title: job.title,
        company: job.company,
        status: 'Saved'
      });
    }

    if (sendResponse) sendResponse({ success: true, message: 'Job saved to Dokets!' });
  },

  // Import profile from extension
  importProfileFromExtension: function(profileData, sendResponse) {
    if (!window.App || !window.App.resumeData) {
      if (sendResponse) sendResponse({ success: false, message: 'Builder not ready' });
      return;
    }

    App.resumeData.personal.fullName = profileData.fullName || '';
    App.resumeData.personal.email = profileData.email || '';
    App.resumeData.personal.phone = profileData.phone || '';
    App.resumeData.personal.location = profileData.location || '';
    App.resumeData.personal.linkedin = profileData.linkedin || '';
    App.resumeData.summary = profileData.summary || '';
    App.resumeData.skills = profileData.skills || [];
    App.resumeData.experience = profileData.experience || [];

    saveToStorage();
    refreshView();

    if (sendResponse) sendResponse({ success: true, message: 'Profile imported!' });
  },

  // Add "Save to Dokets" button on job boards
  injectSaveButton: function() {
    // Check if we're on a job board
    const isJobBoard = 
      window.location.href.includes('linkedin.com/jobs') ||
      window.location.href.includes('indeed.com') ||
      window.location.href.includes('glassdoor.com') ||
      window.location.href.includes('naukri.com') ||
      window.location.href.includes('monster.com');

    if (!isJobBoard) return;

    // Create button
    const button = document.createElement('button');
    button.id = 'dokets-save-job-btn';
    button.innerHTML = '💾 Save to Dokets';
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 99999;
      padding: 12px 20px;
      background: #6366f1;
      color: white;
      border: none;
      border-radius: 25px;
      cursor: pointer;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
      transition: all 0.2s;
    `;
    button.onmouseover = function() { this.style.background = '#4f46e5'; };
    button.onmouseout = function() { this.style.background = '#6366f1'; };

    button.onclick = () => {
      const jobData = this.extractJobFromPage();
      this.saveJobFromExtension(jobData);
      button.innerHTML = '✅ Saved!';
      setTimeout(() => { button.innerHTML = '💾 Save to Dokets'; }, 2000);
    };

    document.body.appendChild(button);
  },

  // Extract job data from current page
  extractJobFromPage: function() {
    const url = window.location.href;
    let jobData = {
      title: '',
      company: '',
      location: '',
      salary: '',
      url: url,
      description: '',
      skills: []
    };

    // LinkedIn
    if (url.includes('linkedin.com/jobs')) {
      jobData.title = document.querySelector('.job-title, h1')?.textContent?.trim() || '';
      jobData.company = document.querySelector('.company-name, [class*="company"]')?.textContent?.trim() || '';
      jobData.location = document.querySelector('[class*="location"]')?.textContent?.trim() || '';
      jobData.salary = document.querySelector('[class*="salary"]')?.textContent?.trim() || '';
      jobData.description = document.querySelector('[class*="description"]')?.textContent?.trim() || '';
    }
    // Indeed
    else if (url.includes('indeed.com')) {
      jobData.title = document.querySelector('.jobsearch-JobInfoHeader-title')?.textContent?.trim() || document.querySelector('h1')?.textContent?.trim() || '';
      jobData.company = document.querySelector('[class*="company"]')?.textContent?.trim() || '';
      jobData.location = document.querySelector('[class*="location"]')?.textContent?.trim() || '';
      jobData.salary = document.querySelector('[class*="salary"]')?.textContent?.trim() || '';
      jobData.description = document.querySelector('#jobDescriptionText')?.textContent?.trim() || '';
    }
    // Glassdoor
    else if (url.includes('glassdoor.com')) {
      jobData.title = document.querySelector('[class*="title"]')?.textContent?.trim() || '';
      jobData.company = document.querySelector('[class*="employer"]')?.textContent?.trim() || '';
      jobData.location = document.querySelector('[class*="location"]')?.textContent?.trim() || '';
      jobData.salary = document.querySelector('[class*="salary"]')?.textContent?.trim() || '';
      jobData.description = document.querySelector('[class*="description"]')?.textContent?.trim() || '';
    }

    // Extract skills from description
    if (jobData.description) {
      const skillKeywords = ['JavaScript', 'Python', 'Java', 'React', 'SQL', 'AWS', 'Node.js', 'TypeScript', 'Marketing', 'Sales', 'Management', 'Analysis', 'Design', 'Communication', 'Leadership', 'Agile', 'Scrum', 'Excel', 'Tableau', 'Power BI'];
      jobData.skills = skillKeywords.filter(skill => 
        jobData.description.toLowerCase().includes(skill.toLowerCase())
      );
    }

    jobData.source = url.includes('linkedin') ? 'LinkedIn' : 
                     url.includes('indeed') ? 'Indeed' : 
                     url.includes('glassdoor') ? 'Glassdoor' : 'Job Board';

    return jobData;
  }
};

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    ChromeExtensionIntegration.init();
    ChromeExtensionIntegration.injectSaveButton();
  });
} else {
  ChromeExtensionIntegration.init();
  ChromeExtensionIntegration.injectSaveButton();
}

window.ChromeExtensionIntegration = ChromeExtensionIntegration;