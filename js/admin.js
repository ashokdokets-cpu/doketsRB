// Admin Dashboard — visible only to admin users
function showAdminDashboard() {
  if (!currentUser || !userProfile || currentUser.email !== 'contact@dokets.com') {
    showError('Admin access only.');
    return;
  }
  navigate('admin');
}

// Load all admin stats
async function loadAdminStats() {
  if (!sbClient) return;
  
  // Total Users
  try {
    var usersR = await sbClient.from('profiles').select('*', { count: 'exact', head: true });
    var totalUsers = usersR.count || 0;
    document.getElementById('admin-total-users').textContent = totalUsers;
  } catch(e) { console.log('Users count failed'); }

  // Pro Users
  try {
    var proR = await sbClient.from('profiles').select('*', { count: 'exact', head: true }).neq('plan', 'free');
    var proUsers = proR.count || 0;
    document.getElementById('admin-pro-users').textContent = proUsers;
  } catch(e) { console.log('Pro count failed'); }

  // Resumes Created
  try {
    var resumesR = await sbClient.from('resumes').select('*', { count: 'exact', head: true });
    var resumeCount = resumesR.count || 0;
    document.getElementById('admin-resumes').textContent = resumeCount;
  } catch(e) { console.log('Resumes count failed'); }

    // Total Revenue (sum of captured payments in rupees, convert from paise)
  try {
    var paymentsR = await sbClient.from('payments').select('amount, plan').eq('status', 'captured');
    var totalPaise = (paymentsR.data || []).reduce(function(sum, p) { return sum + (p.amount || 0); }, 0);
    var revenue = '₹' + Math.round(totalPaise / 100).toLocaleString('en-IN');
    document.getElementById('admin-revenue').textContent = revenue;
    
    // Revenue breakdown by plan
    var jobhuntCount = 0, jobhuntRevenue = 0;
    var proCount = 0, proRevenue = 0;
    var otherCount = 0, otherRevenue = 0;
    
    (paymentsR.data || []).forEach(function(p) {
      if (p.plan === 'jobhunt') {
        jobhuntCount++;
        jobhuntRevenue += (p.amount || 0);
      } else if (p.plan === 'pro' || p.plan === 'yearly') {
        proCount++;
        proRevenue += (p.amount || 0);
      } else {
        otherCount++;
        otherRevenue += (p.amount || 0);
      }
    });
    
    // Add breakdown below the stat cards
    var breakdownDiv = document.createElement('div');
    breakdownDiv.style.cssText = 'margin-top:8px;margin-bottom:16px;';
    breakdownDiv.innerHTML = '<div class="grid grid-cols-3 gap-2 text-center">' +
      '<div class="bg-green-50 rounded-lg p-2"><div class="text-xs font-bold text-green-700">Job Hunt Pass</div><div class="text-sm font-extrabold text-green-800">' + jobhuntCount + ' sales</div><div class="text-xs text-green-600">₹' + Math.round(jobhuntRevenue/100) + '</div></div>' +
      '<div class="bg-blue-50 rounded-lg p-2"><div class="text-xs font-bold text-blue-700">Pro Plans</div><div class="text-sm font-extrabold text-blue-800">' + proCount + ' sales</div><div class="text-xs text-blue-600">₹' + Math.round(proRevenue/100) + '</div></div>' +
      '<div class="bg-purple-50 rounded-lg p-2"><div class="text-xs font-bold text-purple-700">Other</div><div class="text-sm font-extrabold text-purple-800">' + otherCount + ' sales</div><div class="text-xs text-purple-600">₹' + Math.round(otherRevenue/100) + '</div></div>' +
    '</div>';
    
    var revenueCard = document.getElementById('admin-revenue').closest('.bg-white');
    if (revenueCard && !revenueCard.querySelector('.revenue-breakdown')) {
      breakdownDiv.className = 'revenue-breakdown';
      revenueCard.parentElement.appendChild(breakdownDiv);
    }
  } catch(e) { console.log('Revenue count failed'); }
}

// Visitor stats loader
async function loadVisitorStats() {
  var el = document.getElementById('admin-visitor-stats');
  if (!el || !sbClient) return;
  try {
    var today = new Date().toISOString().split('T')[0];
    var r = await sbClient.from('visitors').select('*', { count: 'exact' });
    var total = r.count || 0;
    var todayR = await sbClient.from('visitors').select('*', { count: 'exact' }).gte('visited_at', today);
    var todayCount = todayR.count || 0;
    var deviceR = await sbClient.from('visitors').select('device');
    var mobile = (deviceR.data || []).filter(function(v){ return v.device === 'mobile'; }).length;
    var desktop = (deviceR.data || []).filter(function(v){ return v.device === 'desktop'; }).length;
    el.innerHTML = '<div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-brand-600">'+todayCount+'</div><div class="text-xs text-gray-500 mt-1">Today</div></div><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-green-600">'+total+'</div><div class="text-xs text-gray-500 mt-1">Total Visits</div></div><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-purple-600">'+desktop+'</div><div class="text-xs text-gray-500 mt-1">Desktop</div></div><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-amber-600">'+mobile+'</div><div class="text-xs text-gray-500 mt-1">Mobile</div></div>';
  } catch(e) {}
}

// Register admin view
if (typeof Views !== 'undefined') {
  Views['admin'] = function() {
    if (!currentUser || !userProfile || currentUser.email !== 'contact@dokets.com') {
      return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Access Denied</h2><p class="text-gray-600">Admin only.</p></div>';
    }
    setTimeout(function() {
      loadAdminStats();
      loadVisitorStats();
    }, 500);
    return '<div class="max-w-6xl mx-auto px-4 py-8 animate-fade-in"><h1 class="text-2xl font-heading font-extrabold mb-6">Admin Dashboard</h1><div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-brand-600" id="admin-total-users">--</div><div class="text-xs text-gray-500 mt-1">Total Users</div></div><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-green-600" id="admin-pro-users">--</div><div class="text-xs text-gray-500 mt-1">Pro Users</div></div><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-purple-600" id="admin-resumes">--</div><div class="text-xs text-gray-500 mt-1">Resumes Created</div></div><div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-amber-600" id="admin-revenue">--</div><div class="text-xs text-gray-500 mt-1">Total Revenue</div></div></div><h2 class="font-bold text-lg mt-6 mb-3">📊 Visitor Analytics</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" id="admin-visitor-stats"><div class="text-center py-4 text-gray-500">Loading...</div></div><p class="text-xs text-gray-400 text-center">Admin Dashboard v1.0</p></div>';
  };
}