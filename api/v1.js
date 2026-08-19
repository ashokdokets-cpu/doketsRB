var { createClient } = require('@supabase/supabase-js');

// Shared auth check
async function checkAuth(req, res) {
    var apiKey = req.headers.authorization?.replace('Bearer ', '');
    if (!apiKey) { res.status(401).json({ error: 'API key required' }); return null; }
    
    var supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    var { data: keyData } = await supabase.from('api_keys').select('*').eq('api_key', apiKey).eq('is_active', true).single();
    if (!keyData) { res.status(401).json({ error: 'Invalid API key' }); return null; }
    
    await supabase.from('api_keys').update({ usage_count: keyData.usage_count + 1, last_used: new Date().toISOString() }).eq('id', keyData.id);
    return keyData;
}

function scoreResume(rd) {
    var skillCount = (rd.skills || []).length;
    var expCount = (rd.experience || []).length;
    var eduCount = (rd.education || []).length;
    var hasSummary = (rd.summary || '').length > 50;
    var hasName = rd.personal?.fullName ? true : false;
    
    var expScore = expCount >= 2 ? 90 : expCount === 1 ? 60 : 15;
    var skillScore = skillCount >= 8 ? 90 : skillCount >= 5 ? 70 : skillCount > 0 ? 45 : 10;
    var eduScore = eduCount >= 2 ? 90 : eduCount === 1 ? 60 : 15;
    var summaryScore = hasSummary ? 80 : 20;
    var personalScore = hasName ? 80 : 10;
    var overall = Math.round((expScore + skillScore + eduScore + summaryScore + personalScore) / 5);
    
    return { overall, breakdown: { experience: expScore, skills: skillScore, education: eduScore, summary: summaryScore, personal: personalScore }, sections: { skills: skillCount, experience: expCount, education: eduCount, has_summary: hasSummary } };
}

function matchSkills(resumeData, jobDescription) {
    var skills = (resumeData.skills || []).map(function(s){ return typeof s === 'string' ? s.toLowerCase().trim() : ''; }).filter(Boolean);
    var jdLower = (jobDescription || '').toLowerCase();
    var allKeywords = ['python','java','javascript','react','angular','vue','node','sql','mongodb','postgresql','aws','azure','docker','kubernetes','terraform','git','rest api','graphql','machine learning','data analysis','excel','tableau','power bi','figma','adobe','salesforce','hubspot','google analytics','seo','agile','scrum','jira','confluence','c++','c#','.net','php','django','flask','swift','kotlin','flutter','leadership','communication','project management','stakeholder management','analytical','problem-solving','team management','negotiation'];
    
    var matched = [];
    var missing = [];
    allKeywords.forEach(function(k){
        if (jdLower.includes(k)) {
            if (skills.some(function(s){ return s === k || k.includes(s) || s.includes(k); })) {
                matched.push(k);
            } else {
                missing.push(k);
            }
        }
    });
    
    var totalRelevant = matched.length + missing.length;
    var score = totalRelevant > 0 ? Math.round((matched.length / totalRelevant) * 100) : 0;
    return { score, matched, missing };
}

module.exports = async function(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    
    var keyData = await checkAuth(req, res);
    if (!keyData) return;
    
    try {
        var { action, resume_data, job_description, resumes } = req.body || {};
        
        // BATCH MODE
        if (action === 'batch' && resumes && Array.isArray(resumes)) {
            if (resumes.length > 50) return res.status(400).json({ error: 'Max 50 resumes per batch' });
            var results = resumes.map(function(r, i){
                var s = scoreResume(r);
                var m = job_description ? matchSkills(r, job_description) : { matched: [], missing: [], score: 0 };
                return { index: i, name: r.personal?.fullName || 'Resume '+(i+1), score: s.overall, skills_matched: m.matched, skills_missing: m.missing, email: r.personal?.email || '' };
            });
            return res.status(200).json({ success: true, total: results.length, average_score: Math.round(results.reduce(function(sum,r){return sum+r.score;},0)/results.length), results: results.sort(function(a,b){return b.score-a.score;}) });
        }
        
        // WELCOME EMAIL MODE
        if (action === 'welcome-email') {
            var email = req.body.email;
            var name = req.body.name || 'there';
            if (!email) return res.status(400).json({ error: 'Email required' });
            
            try {
                var nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_HOST || 'smtpout.secureserver.net',
                    port: 587,
                    secure: false,
                    auth: {
                        user: process.env.EMAIL_USER || 'contact@dokets.com',
                        pass: process.env.EMAIL_PASS || ''
                    }
                });
                
                await transporter.sendMail({
                    from: '"Dokets Resume Builder" <contact@dokets.com>',
                    to: email,
                    subject: 'Welcome to Dokets Resume Builder!',
                                        html: '<div style="max-width:600px;margin:0 auto;font-family:Arial,sans-serif;color:#333;"><div style="background:#2563eb;padding:30px;text-align:center;border-radius:12px 12px 0 0;"><h1 style="color:white;margin:0;font-size:24px;">Welcome to Dokets Resume Builder!</h1><p style="color:#bfdbfe;margin:8px 0 0;font-size:14px;">AI-Powered Resume Builder & ATS Checker</p></div><div style="background:white;padding:30px;border:1px solid #e5e7eb;border-top:none;"><p style="font-size:16px;">Hi <strong>'+name+'</strong>,</p><p style="font-size:16px;">Welcome to Dokets Resume Builder — the smartest way to build ATS-optimized resumes that get you hired.</p><div style="background:#f0fdf4;padding:20px;border-radius:8px;margin:20px 0;"><h3 style="margin:0 0 12px;color:#166534;">⚡ 3 Steps to Your First Resume:</h3><p style="margin:4px 0;"><strong>1. Upload or Import</strong> — Upload PDF/DOCX, connect LinkedIn, or start fresh</p><p style="margin:4px 0;"><strong>2. Target a Job</strong> — Paste a job description and let AI analyze it</p><p style="margin:4px 0;"><strong>3. Export & Apply</strong> — Download ATS-optimized PDF/DOCX and apply with confidence</p></div><div style="background:#eff6ff;padding:20px;border-radius:8px;margin:20px 0;"><h3 style="margin:0 0 12px;color:#1e40af;">🦾 What Makes Dokets Different:</h3><p style="margin:4px 0;">✅ <strong>Multi-AI Engine</strong> — Intelligent AI that never leaves you stuck</p><p style="margin:4px 0;">✅ <strong>Skill Gap Analyzer</strong> — See exactly what keywords you\'re missing</p><p style="margin:4px 0;">✅ <strong>STAR Method Coach</strong> — Weak bullets rewritten with measurable results</p><p style="margin:4px 0;">✅ <strong>12 Unique Templates</strong> — Different layouts for every industry</p><p style="margin:4px 0;">✅ <strong>Side-by-Side Compare</strong> — A/B test your resumes</p><p style="margin:4px 0;">✅ <strong>100% Free to Start</strong> — No credit card required</p></div><div style="text-align:center;margin:30px 0;"><a href="https://www.doketsrb.com/#builder" style="background:#2563eb;color:white;padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">Start Building Now →</a></div><p style="font-size:14px;color:#6b7280;">Need help? Reply to this email or reach us at <a href="mailto:contact@dokets.com" style="color:#2563eb;">contact@dokets.com</a></p></div><div style="background:#f8fafc;padding:20px;text-align:center;border-radius:0 0 12px 12px;border:1px solid #e5e7eb;border-top:none;"><p style="font-size:12px;color:#9ca3af;margin:0;">Dokets Resume Builder | <a href="https://www.doketsrb.com" style="color:#2563eb;">doketsrb.com</a></p></div></div>'
                });
                
                return res.status(200).json({ success: true, message: 'Welcome email sent' });
            } catch(e) {
                return res.status(200).json({ success: false, error: e.message });
            }
        }        
        if (!resume_data) return res.status(400).json({ error: 'resume_data required' });
        
        // SCORE MODE
        var scoreData = scoreResume(resume_data);
        
        // MATCH MODE (if job description provided)
        var matchData = job_description ? matchSkills(resume_data, job_description) : null;
        
        return res.status(200).json({
            success: true,
            data: {
                score: scoreData.overall,
                grade: scoreData.overall >= 90 ? 'A+' : scoreData.overall >= 80 ? 'A' : scoreData.overall >= 70 ? 'B' : scoreData.overall >= 60 ? 'C' : 'D',
                breakdown: scoreData.breakdown,
                sections: scoreData.sections,
                skills: matchData || { matched: [], missing: [], score: 0 }
            }
        });
        
    } catch(e) {
        return res.status(500).json({ error: e.message });
    }
};

// Currencies endpoint (merged to stay under 12 function limit)
module.exports.currencies = async function(req, res) {
  try {
    const { data } = await supabase.from('currencies').select('*').eq('is_active', true).order('display_order');
    res.status(200).json({ success: true, currencies: data || [] });
  } catch(e) {
    res.status(200).json({ success: false, currencies: [], error: e.message });
  }
};