export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { code, redirectUri } = req.body;
    
    if (!code) {
        return res.status(400).json({ error: 'Missing authorization code' });
    }
    
    try {
        const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
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
        
        const data = await response.json();
        
        if (data.error) {
            return res.status(400).json({ error: data.error_description || 'Token exchange failed' });
        }
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}