var axios = require('axios');
var GEMINI_KEY = process.env.GEMINI_API_KEY || '';
var GROQ_KEY = process.env.GROQ_API_KEY || '';

// Try Gemini first, then Groq, return result or null
async function tryGemini(prompt) {
    if (!GEMINI_KEY || GEMINI_KEY.length < 10) return null;
    try {
        var r = await axios.post(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_KEY,
            { contents: [{ parts: [{ text: prompt }] }] },
            { headers: { 'Content-Type': 'application/json' }, timeout: 25000 }
        );
        var t = r.data.candidates[0].content.parts[0].text;
        var m = t.match(/\{[\s\S]*\}/);
        return { source: 'gemini', data: m ? JSON.parse(m[0]) : { raw: t } };
    } catch(e) {
        console.log('Gemini failed:', e.message);
        return null;
    }
}

// Try Groq (Llama 3) as secondary
async function tryGroq(prompt) {
    if (!GROQ_KEY || GROQ_KEY.length < 10) return null;
    try {
        var r = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'gpt-oss-20b',
                messages: [
                    { role: 'system', content: 'You are a resume analyzer. Return ONLY valid JSON with matched_skills array, missing_skills array, and score (0-100). No other text.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 800
            },
            {
                headers: {
                    'Authorization': 'Bearer ' + GROQ_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 25000
            }
        );
        var t = r.data.choices[0].message.content;
        var m = t.match(/\{[\s\S]*\}/);
        return { source: 'groq', data: m ? JSON.parse(m[0]) : { raw: t } };
    } catch(e) {
        console.log('Groq failed:', e.message);
        return null;
    }
}

module.exports = async function(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

    try {
        var b = req.body;
        var isTailor = b.type === 'tailor';
var prompt;
if (b.type === 'interview-prep') {
    prompt = 'You are an interview coach. Based on this resume: ' + JSON.stringify(b.resumeData || {}) + ' and this question: "' + (b.jobDescription || '') + '", write a sample answer under 150 words using STAR method with specific details from their experience. Write in first person.';
} else if (b.type === 'coding-prep') {
    prompt = 'Generate 5 coding interview questions for ' + (b.jobDescription || 'the given language') + '. Return ONLY valid JSON array with fields: title, difficulty (Easy/Medium/Hard), description (under 300 words), example, constraints, hint.';
} else if (b.type === 'coding-review') {
    prompt = b.jobDescription;
} else if (isTailor) {
    prompt = 'You are a professional resume writer. Rewrite this resume to match the job description below. Return ONLY valid JSON with: "summary" (a rewritten professional summary tailored to the job, 2-3 sentences), "bullets" (array of rewritten experience bullets using STAR method with metrics), "matched_skills" (array), "missing_skills" (array), "score" (0-100). Job: ' + (b.jobDescription || '') + ' Resume: ' + JSON.stringify(b.resumeData || {});
} else if (b.type === 'push_tip') {
    prompt = 'You are a resume coach. Give ONE specific tip to improve this resume ATS score. Return JSON with: "tip" (max 30 words). Resume: ' + JSON.stringify(b.resumeData || {});
} else {
    prompt = 'Analyze this job: ' + (b.jobDescription || '') + ' against this resume: ' + JSON.stringify(b.resumeData || {}) + '. Return JSON with matched_skills array, missing_skills array, score 0-100.';
}
        // Step 1: Try Gemini
        var result = await tryGemini(prompt);
        if (result) {
            return res.status(200).json({ success: true, data: result.data, fallback: false, source: result.source });
        }

        // Step 2: Try Groq
        result = await tryGroq(prompt);
        if (result) {
            return res.status(200).json({ success: true, data: result.data, fallback: false, source: result.source });
        }

        // Step 3: Both failed — tell frontend to use local
        return res.status(200).json({ success: true, data: null, fallback: true, message: 'All AI services unavailable. Use local analysis.' });

    } catch (e) {
        return res.status(200).json({ success: true, data: null, fallback: true, message: e.message });
    }
};
