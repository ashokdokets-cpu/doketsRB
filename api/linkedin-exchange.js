export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { code, redirectUri } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Missing authorization code' });
    }
    
    try {
        // Step 1: Exchange code for access token
        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                client_id: process.env.LINKEDIN_CLIENT_ID || '86jm4ws8xy27h8',
                client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
            }),
        });
        
        const tokenData = await tokenResponse.json();
        
        if (tokenData.error) {
            return res.status(400).json({ error: tokenData.error_description || 'Token exchange failed' });
        }
        
        // Step 2: Fetch user profile using the access token (server-side — no CORS!)
        const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: { 'Authorization': `Bearer ${tokenData.access_token}` },
        });
        
        const profileData = await profileResponse.json();
        
        // Return both token and profile data
        return res.status(200).json({
            access_token: tokenData.access_token,
            profile: {
                name: profileData.name || '',
                email: profileData.email || '',
                picture: profileData.picture || '',
                sub: profileData.sub || '',
            }
        });
        
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}