// Job Application Tracker

const JobTracker = {
  statuses: ['saved','applied','phone_screen','interview','offer','accepted','rejected','withdrawn'],
  statusLabels: {
    saved: 'Saved', applied: 'Applied', phone_screen: 'Phone Screen',
    interview: 'Interview', offer: 'Offer', accepted: 'Accepted',
    rejected: 'Rejected', withdrawn: 'Withdrawn'
  },
  statusColors: {
    saved: 'bg-gray-100 text-gray-600', applied: 'bg-blue-100 text-blue-700',
    phone_screen: 'bg-purple-100 text-purple-700', interview: 'bg-indigo-100 text-indigo-700',
    offer: 'bg-green-100 text-green-700', accepted: 'bg-green-200 text-green-800',
    rejected: 'bg-red-100 text-red-700', withdrawn: 'bg-yellow-100 text-yellow-700'
  },
  statusIcons: { saved: '📌', applied: '📤', phone_screen: '📞', interview: '👥', offer: '🎉', accepted: '✅', rejected: '❌', withdrawn: '↩️' }
};

// Register the view
if (typeof Views !== 'undefined') {
  Views['job-tracker'] = function() {
    if (!currentUser) {
      return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><p class="text-gray-600 mb-6">Track your job applications in one place.</p><button onclick="navigate(\'login\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';
    }
    return '<div class="max-w-6xl mx-auto px-4 py-8 animate-fade-in"><div class="flex flex-wrap items-center justify-between gap-3 mb-6"><h1 class="text-2xl sm:text-3xl font-heading font-extrabold text-gray-900">Job Application Tracker</h1><button onclick="showAddJobModal()" class="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold text-sm">+ Add Application</button><button onclick="EmailTemplates.showPicker()" class="px-4 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm">📧 Email Templates</button></div><div id="job-tracker-stats" class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"></div><div id="job-tracker-list" class="space-y-3"></div></div>';
  };
}

// Load job applications
function autoAddJobFromExtension(jobData) {
  if (typeof addJobToTracker === 'function') {
    addJobToTracker(jobData);
    return;
  }
  // Fallback: save to localStorage
  var jobs = JSON.parse(localStorage.getItem('dokets_jobs') || '[]');
  jobs.push({
    title: jobData.title || 'Saved Job',
    company: jobData.company || '',
    status: 'Saved',
    source: 'Chrome Extension',
    url: jobData.url || '',
    dateAdded: new Date().toISOString()
  });
  localStorage.setItem('dokets_jobs', JSON.stringify(jobs));
  showSuccess('Job saved from Chrome Extension!');
}

async function checkPendingJob() {
  try {
    var pending = localStorage.getItem('dokets_pending_job') || (window.doketsPendingJob ? JSON.stringify(window.doketsPendingJob) : null);
    if (pending) {
      var job = JSON.parse(pending);
      if (job.title || job.company) {
        // Auto-add to tracker
        autoAddJobFromExtension(job);
        localStorage.removeItem('dokets_pending_job');
      }
    }
  } catch(e) { console.log('Pending job error:', e); }
}

async function loadJobApplications() {
  // Load local jobs from localStorage first
  var localJobs = [];
  try {
    localJobs = JSON.parse(localStorage.getItem("dokets_jobs") || "[]");
  } catch(e) { localJobs = []; }
  
  // Render local jobs immediately (works without login)
  if (localJobs.length > 0) {
    renderJobStats(localJobs);
    renderJobList(localJobs);
  }
  if (!currentUser || !sbClient) return;
  try {
    var r = await sbClient.from('job_applications').select('*').eq('user_id', currentUser.id).order('updated_at', { ascending: false });
    if (r.data) {
      renderJobStats(r.data);
      renderJobList(r.data);
    }
  } catch(e) {}
}

// Render stats
function renderJobStats(jobs) {
  var el = document.getElementById('job-tracker-stats');
  if (!el) return;
  var total = jobs.length;
  var interviews = jobs.filter(function(j){ return j.status === 'interview' || j.status === 'offer' || j.status === 'accepted'; }).length;
  var offers = jobs.filter(function(j){ return j.status === 'offer' || j.status === 'accepted'; }).length;
  var rejected = jobs.filter(function(j){ return j.status === 'rejected'; }).length;
  
  var stats = [
    { label: 'Total', value: total, color: 'brand' },
    { label: 'Interviews', value: interviews, color: 'purple' },
    { label: 'Offers', value: offers, color: 'green' },
    { label: 'Rejected', value: rejected, color: 'red' }
  ];
  
  el.innerHTML = stats.map(function(s){
    return '<div class="bg-white rounded-xl p-4 border text-center"><div class="text-2xl font-extrabold text-'+s.color+'-600">'+s.value+'</div><div class="text-xs text-gray-500 mt-1">'+s.label+'</div></div>';
  }).join('');
}

// Render job list
function renderJobList(jobs) {
  var el = document.getElementById('job-tracker-list');
  if (!el) return;
  
  if (jobs.length === 0) {
    el.innerHTML = '<div class="text-center py-12 bg-white rounded-xl border"><p class="text-gray-500 text-lg">No applications yet.</p><button onclick="showAddJobModal()" class="mt-3 px-5 py-2 bg-brand-600 text-white rounded-lg font-bold">Add Your First Application</button></div>';
    return;
  }
  
  el.innerHTML = jobs.map(function(job){
    var sc = JobTracker.statusColors[job.status] || 'bg-gray-100 text-gray-600';
    var si = JobTracker.statusIcons[job.status] || '📌';
    var sl = JobTracker.statusLabels[job.status] || job.status;
    var days = Math.floor((new Date() - new Date(job.applied_date)) / (1000*60*60*24));
    var daysText = days === 0 ? 'Today' : days + 'd ago';
    
    return '<div class="bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition"><div class="flex flex-wrap items-start justify-between gap-3"><div class="flex-1 min-w-0"><div class="flex items-center gap-2 mb-1"><h3 class="font-bold text-lg">'+job.role+'</h3><span class="text-sm text-gray-500">at '+job.company+'</span></div><div class="flex flex-wrap items-center gap-2 mt-2"><span class="px-2 py-0.5 rounded-full text-xs font-semibold '+sc+'">'+si+' '+sl+'</span><span class="text-xs text-gray-400">'+daysText+'</span>'+ (job.ats_score > 0 ? '<span class="text-xs font-semibold text-green-600">ATS: '+job.ats_score+'%</span>' : '') +'</div>'+ (job.notes ? '<p class="text-sm text-gray-600 mt-2 line-clamp-2">'+job.notes+'</p>' : '') +'</div><div class="flex items-center gap-2 flex-shrink-0"><select onchange="updateJobStatus('+job.id+', this.value)" class="text-xs border rounded-lg px-2 py-1">'+ JobTracker.statuses.map(function(s){ return '<option value="'+s+'" '+ (job.status===s?'selected':'') +'>'+JobTracker.statusIcons[s]+' '+JobTracker.statusLabels[s]+'</option>'; }).join('') +'</select><button onclick="deleteJobApplication('+job.id+')" class="text-red-500 hover:text-red-700 text-xs">🗑️</button></div></div></div>';
  }).join('');
}

// Show add job modal
function showAddJobModal(company, role) {
  var existing = document.getElementById('add-job-modal');
  if (existing) existing.remove();
  
  // Pre-fill from Dashboard job target if available
  var jt = App.jobTarget || {};
  var preCompany = company || jt.company || '';
  var preRole = role || jt.title || '';
  
  var modal = document.createElement('div');
  modal.id = 'add-job-modal';
  modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;display:flex;align-items:center;justify-content:center;';
  modal.onclick = function(e){ if(e.target===modal) modal.remove(); };
  
  modal.innerHTML = '<div style="background:white;border-radius:16px;padding:24px;max-width:450px;width:90%;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;"><h2 style="font-size:1.3rem;font-weight:700;">Add Application</h2><button onclick="document.getElementById(\'add-job-modal\').remove()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button></div><input id="aj-company" placeholder="Company *" value="'+preCompany+'" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;"><input id="aj-role" placeholder="Role *" value="'+preRole+'" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;"><input id="aj-url" placeholder="Job URL (optional)" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;"><textarea id="aj-notes" placeholder="Notes..." rows="2" style="width:100%;padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px;resize:vertical;"></textarea><button onclick="addJobApplication()" style="width:100%;padding:10px;background:#6366f1;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">Save Application</button></div>';
  document.body.appendChild(modal);
}

// Add job application
async function addJobApplication() {
  var company = document.getElementById('aj-company').value.trim();
  var role = document.getElementById('aj-role').value.trim();
  if (!company || !role) { showError('Company and role are required.'); return; }
  
  var url = document.getElementById('aj-url').value.trim();
  var notes = document.getElementById('aj-notes').value.trim();
  
  // Get ATS score if job target matches
  var atsScore = 0;
  var skillGap = '';
  if (App.jobTarget && App.jobTarget.company === company && App.jobTarget.title === role) {
    atsScore = App.jobMatch?.overallScore || 0;
    skillGap = (App.jobMatch?.skillMatch?.missing || []).slice(0,5).join(', ');
  }
  
  try {
    await sbClient.from('job_applications').insert({
      user_id: currentUser.id,
      company: company,
      role: role,
      url: url,
      notes: notes,
      ats_score: atsScore,
      skill_gap: skillGap,
      status: 'applied',
      applied_date: new Date().toISOString().split('T')[0]
    });
    document.getElementById('add-job-modal').remove();
        showSuccess('Application added!');
    // Sync to Charvakit
    if(currentUser){
        syncApplicationToCharvakit({
            userId: currentUser.id,
            title: role,
            company: company,
            url: url,
            status: 'applied'
        });
    }
    checkPendingJob().then(function() { loadJobApplications(); });
  } catch(e) {
    showError('Failed to add application.');
  }
}

// Update job status
async function updateJobStatus(id, status) {
  try {
    await sbClient.from('job_applications').update({ status: status, updated_at: new Date().toISOString() }).eq('id', id);
    showSuccess('Status updated!');
    loadJobApplications();
  } catch(e) { showError('Update failed.'); }
}

// Delete job application
async function deleteJobApplication(id) {
  if (!confirm('Delete this application?')) return;
  try {
    await sbClient.from('job_applications').delete().eq('id', id);
    showSuccess('Application deleted.');
    loadJobApplications();
  } catch(e) { showError('Delete failed.'); }
}

// Auto-load when viewing the page
if (typeof Views !== 'undefined') {
  var origNavigate = navigate;
  navigate = function(view) {
    origNavigate(view);
    if (view === 'job-tracker') setTimeout(loadJobApplications, 200);
  };
}