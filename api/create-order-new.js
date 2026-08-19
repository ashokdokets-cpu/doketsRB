module.exports = async function(req, res) {
    var plan = req.body.plan || 'pro';
    var currency = req.body.currency || 'INR';

    var amounts = {
        INR: { pro: 49900, yearly: 399900, lifetime: 4999900, enterprise: 2999900, jobhunt: 9900 },
        USD: { pro: 1499, yearly: 9900, lifetime: 49900, enterprise: 29900, jobhunt: 299 },
        EUR: { pro: 1399, yearly: 8900, lifetime: 44900, enterprise: 27900, jobhunt: 299 },
        GBP: { pro: 1199, yearly: 7900, lifetime: 39900, enterprise: 24900, jobhunt: 249 },
        CAD: { pro: 1999, yearly: 12900, lifetime: 64900, enterprise: 39900, jobhunt: 399 },
        AUD: { pro: 2199, yearly: 13900, lifetime: 69900, enterprise: 44900, jobhunt: 499 },
        SGD: { pro: 1799, yearly: 11900, lifetime: 59900, enterprise: 39900, jobhunt: 399 },
        AED: { pro: 5499, yearly: 35900, lifetime: 179900, enterprise: 109900, jobhunt: 1099 },
        JPY: { pro: 220000, yearly: 1450000, lifetime: 7300000, enterprise: 4400000, jobhunt: 44000 },
        CNY: { pro: 9900, yearly: 65000, lifetime: 329000, enterprise: 199000, jobhunt: 1990 },
        HKD: { pro: 11700, yearly: 77000, lifetime: 389000, enterprise: 233000, jobhunt: 2300 },
        NZD: { pro: 2499, yearly: 15900, lifetime: 79900, enterprise: 47900, jobhunt: 499 },
        CHF: { pro: 1399, yearly: 8900, lifetime: 44900, enterprise: 26900, jobhunt: 299 },
        SEK: { pro: 14900, yearly: 99000, lifetime: 499000, enterprise: 299000, jobhunt: 2990 },
        BRL: { pro: 7499, yearly: 49900, lifetime: 249900, enterprise: 149900, jobhunt: 1499 }
    };

    var planAmounts = amounts[currency] || amounts['INR'];
    var amount = planAmounts[plan] || planAmounts['pro'];
    var key = process.env.RAZORPAY_KEY_ID || 'rzp_live_SkGxektNh5gQfY';

    // Create real Razorpay order
    var Razorpay = require('razorpay');
    var rzp = new Razorpay({
        key_id: key,
        key_secret: process.env.RAZORPAY_KEY_SECRET || ''
    });

    try {
        var order = await rzp.orders.create({
            amount: amount,
            currency: currency,
            receipt: 'dokets_' + Date.now()
        });
        res.status(200).json({ 
            success: true, 
            key: key, 
            amount: order.amount, 
            currency: order.currency,
            order_id: order.id 
        });
    } catch(e) {
        // Fallback: return amount without order (old way that worked)
        res.status(200).json({ 
            success: true, 
            key: key, 
            amount: amount, 
            currency: currency,
            order_id: null 
        });
    }
};