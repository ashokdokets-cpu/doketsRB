// Team Dashboard — HR/Recruiter candidate management

if (typeof Views !== 'undefined') {
  Views['team'] = function() {
    if (!currentUser) return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><button onclick="navigate(\'login\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';
    if (userProfile?.plan !== 'enterprise') return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Enterprise Feature</h2><p class="text-gray-600 mb-6">Team Dashboard is available on the Enterprise plan.</p><button onclick="navigate(\'pricing\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">View Plans</button></div>';
    
    return '<div class="max-w-6xl mx-auto px-4 py-8 animate-fade-in"><h1 class="text-2xl sm:text-3xl font-heading font-extrabold mb-6">👥 Team Dashboard</h1><div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-brand-600" id="td-candidates">--</div><div class="text-xs text-gray-500 mt-1">Total Candidates</div></div><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-green-600" id="td-interviews">--</div><div class="text-xs text-gray-500 mt-1">In Pipeline</div></div><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-purple-600" id="td-hired">--</div><div class="text-xs text-gray-500 mt-1">Hired</div></div><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-amber-600" id="td-avg-score">--</div><div class="text-xs text-gray-500 mt-1">Avg ATS Score</div></div></div><div id="td-candidates-list" class="space-y-3"><p class="text-gray-500 text-center py-8">Loading candidates...</p></div></div>';
  };
}

async function loadTeamDashboard() {
  var listEl = document.getElementById('td-candidates-list');
  if (!listEl) return;
  
  listEl.innerHTML = '<div class="bg-white rounded-xl p-5 border text-center"><p class="text-gray-500">Team dashboard ready. Connect your ATS or upload candidate resumes to get started.</p><button onclick="navigate(\'builder\')" class="mt-3 px-5 py-2 bg-brand-600 text-white rounded-lg font-bold">Upload Resumes</button></div>';
}

