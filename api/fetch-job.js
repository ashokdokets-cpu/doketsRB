var axios = require('axios');

var JOB_SITES = {
    'linkedin.com': {
        title: ['h1', '.job-title', '[class*="title"]'],
        company: ['.company-name', '[class*="company"]', 'a[href*="company"]'],
        desc: ['.description', '[class*="description"]', '#job-details']
    },
    'indeed.com': {
        title: ['h1', '.jobsearch-JobInfoHeader-title'],
        company: ['.companyName', '[class*="company"]'],
        desc: ['#jobDescriptionText', '.jobsearch-jobDescriptionText']
    },
    'naukri.com': {
        title: ['h1', '.job-title', '.jd-header-title'],
        company: ['.company-name', '.comp-name'],
        desc: ['.job-desc', '.jd-content', '[class*="description"]']
    },
    'monster.com': {
        title: ['h1', '.job-title'],
        company: ['.company-name', '[class*="company"]'],
        desc: ['.job-description', '[class*="description"]']
    }
};

function extractField(html, selectors) {
    for (var i = 0; i < selectors.length; i++) {
        var regex = new RegExp('<' + selectors[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^>]*>([^<]*)', 'i');
        var match = html.match(regex);
        if (match && match[1] && match[1].trim().length > 2) {
            return match[1].trim();
        }
    }
    return '';
}

function extractBestText(html) {
    var text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                   .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                   .replace(/<[^>]*>/g, ' ')
                   .replace(/&nbsp;/g, ' ')
                   .replace(/&amp;/g, '&')
                   .replace(/\s+/g, ' ')
                   .trim();
    return text.substring(0, 8000);
}

function detectSite(url) {
    try {
        var host = new URL(url).hostname.toLowerCase();
        for (var site in JOB_SITES) {
            if (host.includes(site)) return site;
        }
    } catch(e) {}
    return 'generic';
}

module.exports = async function(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    
    try {
        var { url } = req.body;
        if (!url) return res.status(400).json({ success: false, error: 'URL required' });
        
        var response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 12000,
            maxRedirects: 5
        });
        
        var html = response.data;
        var site = detectSite(url);
        var config = JOB_SITES[site] || { title: ['h1'], company: [], desc: [] };
        
        var title = extractField(html, config.title);
        var company = extractField(html, config.company);
        var description = extractBestText(html);
        
        if (!title) {
            var titleMatch = html.match(/<title>([^<]*)<\/title>/i);
            if (titleMatch) {
                title = titleMatch[1].replace(/\s*[-–|]\s*.+$/, '').trim();
            }
        }
        
        if (!description || description.length < 100) {
            description = extractBestText(html);
        }
        
        return res.status(200).json({
            success: true,
            data: {
                title: title || 'Position Title',
                company: company || '',
                description: description.substring(0, 5000),
                url: url,
                source: site
            }
        });
        
    } catch(e) {
        console.error('Job fetch error:', e.message);
        return res.status(200).json({
            success: false,
            error: 'Could not fetch job details. Try pasting the description manually.',
            fallback: true
        });
    }
};