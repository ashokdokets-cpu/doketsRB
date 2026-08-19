// API Key Management

function generateAPIKey() {
  return 'dok_' + Array.from({length:32}, function(){ return 'abcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random()*36)); }).join('');
}

async function createAPIKey() {
  if (!currentUser || !sbClient) { showError('Please login first.'); return; }
  
  var name = prompt('Name this key (e.g., "My App"):', 'API Key ' + new Date().toLocaleDateString());
  if (!name) return;
  
  var key = generateAPIKey();
  
  try {
    await sbClient.from('api_keys').insert({
      user_id: currentUser.id,
      api_key: key,
      name: name
    });
    showSuccess('API key created!');
    loadAPIKeys();
  } catch(e) {
    showError('Failed to create key.');
  }
}

async function loadAPIKeys() {
  if (!currentUser || !sbClient) return;
  
  var container = document.getElementById('api-keys-list');
  if (!container) return;
  
  try {
    var r = await sbClient.from('api_keys').select('*').eq('user_id', currentUser.id).eq('is_active', true).order('created_at', { ascending: false });
    
    if (!r.data || r.data.length === 0) {
      container.innerHTML = '<p class="text-sm text-gray-500 text-center py-6">No API keys yet. Create one to access the API.</p>';
      return;
    }
    
    container.innerHTML = r.data.map(function(k) {
      return '<div class="bg-gray-50 rounded-lg p-4 mb-3"><div class="flex justify-between items-center mb-2"><span class="font-semibold text-sm">'+k.name+'</span><span class="text-xs text-gray-400">Used '+k.usage_count+' times</span></div><div class="flex items-center gap-2"><code class="bg-white px-3 py-1.5 rounded text-xs flex-1 overflow-x-auto">'+k.api_key+'</code><button onclick="copyAPIKey(\''+k.api_key+'\')" class="px-3 py-1 bg-brand-100 text-brand-700 rounded text-xs font-semibold">Copy</button><button onclick="deleteAPIKey('+k.id+')" class="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold">Delete</button></div></div>';
    }).join('');
  } catch(e) {}
}

function copyAPIKey(key) {
  navigator.clipboard.writeText(key).then(function() {
    showSuccess('Key copied!');
  });
}

async function deleteAPIKey(id) {
  if (!confirm('Delete this API key? Apps using it will stop working.')) return;
  try {
    await sbClient.from('api_keys').update({ is_active: false }).eq('id', id);
    showSuccess('Key deleted.');
    loadAPIKeys();
  } catch(e) { showError('Failed.'); }
}

// Register the API Keys page
if (typeof Views !== 'undefined') {
  Views['api-keys'] = function() {
    if (!currentUser) {
      return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><button onclick="navigate(\'login\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';
    }
    return '<div class="max-w-3xl mx-auto px-4 py-8 animate-fade-in"><h1 class="text-2xl font-heading font-extrabold mb-6">API Keys</h1><p class="text-gray-600 mb-6 text-sm">Use these keys to access ResumeAI Pro API for resume parsing, AI tailoring, and ATS scoring.</p><button onclick="createAPIKey()" class="px-4 py-2 bg-brand-600 text-white rounded-lg font-bold text-sm mb-6">+ Create API Key</button><div id="api-keys-list"></div><div class="mt-8 p-5 bg-gray-50 rounded-xl"><h3 class="font-bold text-sm mb-2">API Endpoints</h3><div class="space-y-2 text-xs"><p><code class="bg-white px-2 py-0.5 rounded">POST /api/v1/parse</code> — Parse resume (PDF/DOCX)</p><p><code class="bg-white px-2 py-0.5 rounded">POST /api/v1/tailor</code> — AI tailor resume to job</p><p><code class="bg-white px-2 py-0.5 rounded">POST /api/v1/score</code> — Get ATS score</p><p><code class="bg-white px-2 py-0.5 rounded">POST /api/v1/match</code> — Match skills to job</p><p class="mt-2 text-gray-400">Header: <code>Authorization: Bearer YOUR_API_KEY</code></p></div></div></div>';
  };
}

