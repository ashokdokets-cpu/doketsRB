var axios = require('axios');

module.exports = async function(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST only' });
    }
    try {
        var code = req.body.code;
        if (!code) {
            return res.status(400).json({ error: 'Code required' });
        }
        var tokenRes = await axios.post('https://www.linkedin.com/oauth/v2/accessToken',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: req.body.redirectUri || 'https://www.doketsrb.com/',
                client_id: process.env.LINKEDIN_CLIENT_ID,
                client_secret: process.env.LINKEDIN_CLIENT_SECRET
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        var profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
            headers: { Authorization: 'Bearer ' + tokenRes.data.access_token }
        });
        return res.status(200).json({
            success: true,
            profile: {
                name: profileRes.data.name || '',
                email: profileRes.data.email || '',
                picture: profileRes.data.picture || ''
            }
        });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};