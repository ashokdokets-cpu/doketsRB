var lib = require('../../lib/supabase');
var getSupabaseAdmin = lib.getSupabaseAdmin;

module.exports = async function(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'POST only' });
    }
    try {
        var event = req.body;
        if (event.event === 'payment.captured') {
            var p = event.payload.payment.entity;
            var supabase = getSupabaseAdmin();
            await supabase.from('payments').upsert({
                razorpay_payment_id: p.id,
                status: 'captured',
                amount: p.amount
            }, { onConflict: 'razorpay_payment_id' });
        }
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};