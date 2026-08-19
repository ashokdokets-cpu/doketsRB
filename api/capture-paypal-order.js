var axios = require('axios');
var supabaseLib = require('../lib/supabase');
var getSupabaseAdmin = supabaseLib.getSupabaseAdmin;

async function getPayPalToken() {
    var auth = Buffer.from(process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET).toString('base64');
    var res = await axios.post('https://api-m.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
        headers: { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    return res.data.access_token;
}

module.exports = async function(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    try {
        var orderId = req.body.order_id;
        var plan = req.body.plan || 'pro';
        var token = await getPayPalToken();
        var capture = await axios.post('https://api-m.paypal.com/v2/checkout/orders/' + orderId + '/capture', {}, {
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
        });
        if (capture.data.status === 'COMPLETED') {
            var supabase = getSupabaseAdmin();
            await supabase.from('payments').upsert({
                razorpay_payment_id: 'paypal_' + orderId, plan: plan,
                amount: Math.round(parseFloat(capture.data.purchase_units[0].payments.captures[0].amount.value) * 100),
                currency: capture.data.purchase_units[0].payments.captures[0].amount.currency_code,
                status: 'captured', email: capture.data.payer.email_address
            }, { onConflict: 'razorpay_payment_id' });
            return res.status(200).json({ success: true, plan: plan, payer: capture.data.payer.name.given_name });
        }
        return res.status(400).json({ success: false, error: 'Payment not completed' });
    } catch (e) {
        var msg = (e.response && e.response.data && e.response.data.error_description) || e.message;
        return res.status(500).json({ success: false, error: msg });
    }
};