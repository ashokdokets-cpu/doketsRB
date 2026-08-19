// Job Tracker Pro — CRM with follow-ups and reminders

function showJobTrackerPro() {
  if (!canAccess('ai_targeting')) { showError('Pro feature. Please upgrade.'); return; }
  navigate('job-tracker-pro');
}

if (typeof Views !== 'undefined') {
  Views['job-tracker-pro'] = function() {
    if (!currentUser) return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><button onclick="navigate(\'login\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';
    
    return '<div class="max-w-6xl mx-auto px-4 py-8 animate-fade-in"><div class="flex flex-wrap items-center justify-between gap-3 mb-6"><h1 class="text-2xl sm:text-3xl font-heading font-extrabold">📊 Job Tracker Pro</h1><button onclick="showAddJobModal()" class="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold text-sm">+ Add Job</button></div><div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6" id="jtp-pipeline"></div><div id="jtp-list"></div></div>';
  };
}

async function loadJobTrackerPro() {
  if (!currentUser || !sbClient) return;
  
  try {
    var r = await sbClient.from('job_applications').select('*').eq('user_id', currentUser.id).order('updated_at', { ascending: false });
    var jobs = r.data || [];
    
    // Pipeline stats
    var stages = { saved: 0, applied: 0, phone_screen: 0, interview: 0, offer: 0, accepted: 0, rejected: 0 };
    jobs.forEach(function(j){ stages[j.status] = (stages[j.status] || 0) + 1; });
    
    var pipelineEl = document.getElementById('jtp-pipeline');
    if (pipelineEl) {
      var stageColors = { saved: 'gray', applied: 'blue', phone_screen: 'purple', interview: 'indigo', offer: 'green', accepted: 'emerald', rejected: 'red' };
      pipelineEl.innerHTML = Object.entries(stages).map(function(e){
        return '<div class="bg-white rounded-xl p-4 border text-center"><div class="text-2xl font-extrabold text-'+stageColors[e[0]]+'-600">'+e[1]+'</div><div class="text-xs text-gray-500 mt-1 capitalize">'+e[0].replace('_',' ')+'</div></div>';
      }).join('');
    }
    
    // Job list with follow-up reminders
    var listEl = document.getElementById('jtp-list');
    if (listEl) {
      if (jobs.length === 0) {
        listEl.innerHTML = '<div class="text-center py-12 bg-white rounded-xl border"><p class="text-gray-500">No applications yet.</p></div>';
      } else {
        listEl.innerHTML = jobs.map(function(job){
          var daysSince = Math.floor((new Date() - new Date(job.applied_date)) / (1000*60*60*24));
          var needsFollowUp = daysSince > 7 && !['offer','accepted','rejected','withdrawn'].includes(job.status);
          var sc = needsFollowUp ? 'border-l-4 border-l-amber-500' : '';
          
          return '<div class="bg-white rounded-xl p-5 border shadow-sm mb-3 '+sc+'"><div class="flex flex-wrap items-start justify-between gap-3"><div class="flex-1"><h3 class="font-bold">'+job.role+' <span class="text-sm text-gray-500">at '+job.company+'</span></h3><div class="flex flex-wrap items-center gap-2 mt-2"><span class="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">'+job.status.replace('_',' ')+'</span><span class="text-xs text-gray-400">'+daysSince+'d ago</span>'+ (needsFollowUp ? '<span class="text-xs text-amber-600 font-semibold">⚠️ Follow up recommended</span>' : '') +'</div></div><div class="flex gap-2"><button onclick="updateJobStatus('+job.id+', \'interview\')" class="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">+ Interview</button><button onclick="updateJobStatus('+job.id+', \'offer\')" class="px-3 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">+ Offer</button></div></div></div>';
        }).join('');
      }
    }
  } catch(e) {}
}
