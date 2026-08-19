var axios = require('axios');

async function getPayPalToken() {
    var auth = Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET).toString('base64');
    var res = await axios.post('https://api-m.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
        headers: { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return res.data.access_token;
}

module.exports = async function(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST only' });
    }
    try {
        var plan = req.body.plan || 'pro';
        var prices = { pro: '14.99', yearly: '99.00', lifetime: '149.00' };
        var price = prices[plan] || '14.99';
        var token = await getPayPalToken();
        var order = await axios.post('https://api-m.paypal.com/v2/checkout/orders', {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: { currency_code: 'USD', value: price },
                description: 'ResumeAI Pro - ' + plan.toUpperCase() + ' Plan'
            }]
        }, { headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' } });
        return res.status(200).json({ success: true, order_id: order.data.id, price: price, plan: plan });
    } catch (e) {
        console.error('PayPal error:', e.response?.data || e.message);
        return res.status(500).json({ 
            success: false, 
            error: e.response?.data?.error_description || e.response?.data?.message || e.message 
        });
    }
};