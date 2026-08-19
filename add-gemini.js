var fs = require('fs');
var path = require('path');
var html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Replace the parseAndMatch function to use AI for Pro users
var aiMatchFn = `
    async function aiAnalyze() {
        if (!currentUser || !canAccess('ai_targeting')) {
            parseAndMatch(); // Free users use regex
            return;
        }
        showLoader();
        try {
            var r = await fetch('/api/ai-analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobDescription: App.jobTarget.description,
                    resumeData: App.resumeData,
                    type: 'match'
                })
            });
            var d = await r.json();
            hideLoader();
            if (d.success && d.data && !d.fallback) {
                // Apply AI-powered results
                var m = App.jobMatch;
                if (d.data.matched_skills) m.skillMatch.matched = d.data.matched_skills;
                if (d.data.missing_skills) m.skillMatch.missing = d.data.missing_skills;
                if (d.data.score) m.overallScore = d.data.score;
                if (d.data.summary_suggestion) m.autoSummary = d.data.summary_suggestion;
                if (d.data.bullet_suggestions) {
                    d.data.bullet_suggestions.forEach(function(b, i) { m.autoBullets[i] = '• ' + b; });
                }
                if (d.data.missing_skills && d.data.missing_skills.length > 0) {
                    m.suggestions = ['AI Analysis: Missing skills: ' + d.data.missing_skills.slice(0,5).join(', ')];
                }
                App.jobTarget.parsed = true;
                updateState({ jobMatch: m });
                showSuccess('AI analysis complete!');
            } else {
                parseAndMatch(); // Fallback
            }
        } catch(e) { hideLoader(); parseAndMatch(); }
    }
`;

html = html.replace('function parseAndMatch() {', aiMatchFn + '\nfunction parseAndMatch() {');

// Update the Analyze button to use AI
html = html.replace('onclick="parseAndMatch()"', 'onclick="aiAnalyze()"');

fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
console.log('Gemini AI integration complete!');