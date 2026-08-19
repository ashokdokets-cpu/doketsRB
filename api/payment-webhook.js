var supabaseLib = require('../lib/supabase');
var getSupabaseAdmin = supabaseLib.getSupabaseAdmin;

module.exports = async function(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
    
    try {
        var body = req.body || {};
        var event = body.event;
        var payload = body.payload || {};
        
        if (event === 'payment.captured') {
            var payment = payload.payment.entity;
            var supabase = getSupabaseAdmin();
            
            await supabase.from('payments').upsert({
                payment_id: payment.id,
                order_id: payment.order_id,
                razorpay_payment_id: payment.id,
                razorpay_order_id: payment.order_id,
                plan: 'jobhunt',
                amount: payment.amount,
                status: 'captured'
            }, { onConflict: 'payment_id' });
            
            console.log('Webhook saved payment:', payment.id);
        }
        
        return res.status(200).json({ success: true });
    } catch(e) {
        console.log('Webhook error:', e.message);
        return res.status(500).json({ success: false, error: e.message });
    }
};