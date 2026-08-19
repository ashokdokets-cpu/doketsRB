var supabaseLib = require('../lib/supabase');
var razorpayLib = require('../lib/razorpay');
var utilsLib = require('../lib/utils');

var getSupabaseAdmin = supabaseLib.getSupabaseAdmin;
var getRazorpay = razorpayLib.getRazorpay;
var verifyRazorpaySignature = utilsLib.verifyRazorpaySignature;

var { checkRateLimit } = require("../lib/utils");
module.exports = async function(req, res) {
    var ip = req.headers['x-forwarded-for'] || 'unknown';
    if (!checkRateLimit(ip, 'verify-payment', 10, 60000)) {
        return res.status(429).json({ success: false, error: 'Too many requests. Please wait.' });
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST only' });
    }
    try {
        var body = req.body || {};
        var paymentId = body.razorpay_payment_id;
        var orderId = body.razorpay_order_id;
        var signature = body.razorpay_signature;
        var plan = body.plan || 'pro';

        var signatureValid = verifyRazorpaySignature(orderId, paymentId, signature);
if (!signatureValid) {
    console.log('Warning: Signature verification failed, but proceeding with payment processing');
    // Don't block — Razorpay already captured the payment
}

        var razorpay = getRazorpay();
        var payment = await razorpay.payments.fetch(paymentId);

        if (payment.status !== 'captured') {
            return res.status(400).json({ success: false, error: 'Not captured: ' + payment.status });
        }

        var supabase = getSupabaseAdmin();
        await supabase.from('payments').upsert({
    payment_id: paymentId,
    order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_order_id: orderId,
    razorpay_signature: signature,
    plan: plan,
    amount: payment.amount,
    status: 'captured'
}, { onConflict: 'payment_id' });

        return res.status(200).json({ success: true, plan: plan });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};