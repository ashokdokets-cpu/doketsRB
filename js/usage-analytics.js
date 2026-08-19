// Usage Analytics - Basic (Free) + Advanced (Pro)

if (typeof Views !== 'undefined') {
    Views['usage-analytics'] = function() {
        if (!currentUser) return '<div class="max-w-4xl mx-auto px-4 py-20 text-center"><h2 class="text-2xl font-bold mb-4">Sign In Required</h2><button onclick="navigate(\'login\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Log In</button></div>';
        
        var rd = App.resumeData;
        var isPro = userProfile && (userProfile.plan === 'pro' || userProfile.plan === 'yearly' || userProfile.plan === 'lifetime' || userProfile.plan === 'jobhunt');
        
        var html = '<div class="max-w-6xl mx-auto px-4 py-8 animate-fade-in"><h1 class="text-2xl font-heading font-extrabold mb-6">Usage Analytics</h1>';
        
        // Basic Stats (Free)
        html += '<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">';
        html += '<div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-brand-600">' + (App.resumesCreated || 0) + '</div><div class="text-xs text-gray-500 mt-1">Resumes Created</div></div>';
        html += '<div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-green-600">' + (rd.skills?.length || 0) + '</div><div class="text-xs text-gray-500 mt-1">Skills Listed</div></div>';
        html += '<div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-purple-600">' + (rd.experience?.length || 0) + '</div><div class="text-xs text-gray-500 mt-1">Experience Entries</div></div>';
        html += '<div class="bg-white rounded-xl p-5 border text-center"><div class="text-3xl font-extrabold text-amber-600">' + getRemainingAIUsage() + '</div><div class="text-xs text-gray-500 mt-1">AI Uses Today</div></div>';
        html += '</div>';
        
        // Pro Section
        if (isPro) {
            html += '<div class="bg-gradient-to-r from-brand-50 to-purple-50 rounded-2xl p-6 mb-8 border border-brand-100"><h2 class="text-lg font-extrabold mb-4">Advanced Insights (Pro)</h2>';
            
            // ATS Score Trend
            var composite = getCompositeScore();
            var ats = getATSScore();
            var trendColor = composite >= 70 ? 'green' : composite >= 40 ? 'amber' : 'red';
            html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">';
            html += '<div class="bg-white rounded-xl p-4"><p class="text-xs text-gray-500 mb-1">Composite Score</p><div class="text-2xl font-extrabold text-' + trendColor + '-600">' + composite + '%</div><div class="w-full bg-gray-200 rounded-full h-2 mt-2"><div class="bg-' + trendColor + '-600 h-2 rounded-full" style="width:' + composite + '%"></div></div></div>';
            
            // ATS Breakdown
            html += '<div class="bg-white rounded-xl p-4"><p class="text-xs text-gray-500 mb-1">ATS Quality</p><div class="text-2xl font-extrabold text-blue-600">' + ats.total + '%</div><p class="text-xs text-gray-400 mt-1">Contact: ' + (ats.breakdown?.contact || 0) + '% | Skills: ' + (ats.breakdown?.skills || 0) + '%</p></div>';
            
            // Keyword Insights
            var keywordCount = countKeywords(rd);
            html += '<div class="bg-white rounded-xl p-4"><p class="text-xs text-gray-500 mb-1">Keyword Density</p><div class="text-2xl font-extrabold text-indigo-600">' + keywordCount + '</div><p class="text-xs text-gray-400 mt-1">ATS-relevant keywords detected</p></div>';
            html += '</div>';
            
            // AI Recommendations
            var tips = generateProTips(rd, ats);
            if (tips.length > 0) {
                html += '<div class="bg-white rounded-xl p-5 border"><h3 class="font-bold text-sm mb-3">AI-Powered Recommendations</h3>';
                tips.forEach(function(tip) {
                    html += '<div class="flex items-start gap-2 mb-2"><span class="text-' + (tip.priority === 'high' ? 'red' : 'amber') + '-500 mt-0.5">' + (tip.priority === 'high' ? '🔴' : '🟡') + '</span><p class="text-sm text-gray-700">' + tip.text + '</p></div>';
                });
                html += '</div>';
            }
            
            html += '</div>';
        } else {
            html += '<div class="bg-gradient-to-r from-brand-50 to-purple-50 rounded-2xl p-8 text-center mb-8 border border-brand-100"><h2 class="text-lg font-extrabold mb-2">Unlock Advanced Analytics</h2><p class="text-gray-600 mb-4">Get ATS score trends, keyword insights, and AI-powered recommendations.</p><button onclick="navigate(\'pricing\')" class="px-6 py-3 bg-brand-600 text-white rounded-xl font-bold">Upgrade to Pro</button></div>';
        }
        
        html += '</div>';
        return html;
    };
}

function countKeywords(rd) {
    var text = JSON.stringify(rd).toLowerCase();
    var keywords = ['managed', 'developed', 'created', 'improved', 'increased', 'reduced', 'achieved', 'delivered', 'implemented', 'designed', 'led', 'launched', 'optimized', 'generated', 'analyzed'];
    return keywords.filter(function(k) { return text.includes(k); }).length;
}

function generateProTips(rd, ats) {
    var tips = [];
    if ((ats.breakdown?.contact || 0) < 60) tips.push({ priority: 'high', text: 'Add both email and phone number — ATS systems prioritize complete contact info.' });
    if ((ats.breakdown?.skills || 0) < 70) tips.push({ priority: 'high', text: 'Add 5+ skills matching your target job descriptions to improve ATS ranking.' });
    if (!rd.summary || rd.summary.length < 80) tips.push({ priority: 'medium', text: 'Write a professional summary of 2-3 sentences highlighting your key qualifications.' });
    if ((rd.experience || []).length < 2) tips.push({ priority: 'medium', text: 'Add at least 2 work experiences with quantified achievements.' });
    return tips;
}